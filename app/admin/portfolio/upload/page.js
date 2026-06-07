'use client';
import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/lib/authContext';

const CATEGORIES = ['Web Design', 'UI/UX', 'Branding', 'Mobile App', 'Logo', 'Social Media', 'Photography', 'General'];

// Compress image to WebP with max dimensions — returns { blob, sizeKB }
async function compressImage(file, maxWidth = 1200, maxHeight = 900, quality = 0.65) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > maxWidth || h > maxHeight) {
        const ratio = Math.min(maxWidth / w, maxHeight / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      // Try WebP first, fallback to JPEG
      canvas.toBlob((blob) => {
        resolve({ blob, sizeKB: Math.round(blob.size / 1024), ext: 'webp' });
      }, 'image/webp', quality);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

// Small thumbnail for grid display — 400×300 max, WebP q0.6
async function makeThumbnail(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = Math.min(400 / img.width, 300 / img.height, 1);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => resolve(blob), 'image/webp', 0.6);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

export default function UploadPortfolio() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [category, setCategory] = useState('Web Design');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, current: '' });
  const [results, setResults] = useState([]);

  function handleFileSelect(e) {
    const selected = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    setFiles(selected);
    setResults([]);
    // Generate previews
    setPreviews(selected.map(f => URL.createObjectURL(f)));
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    setFiles(dropped);
    setResults([]);
    setPreviews(dropped.map(f => URL.createObjectURL(f)));
  }

  function removeFile(i) {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleUpload() {
    if (!files.length) return;
    setUploading(true);
    setProgress({ done: 0, total: files.length, current: '' });
    const newResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const ts = Date.now();
      setProgress(p => ({ ...p, current: file.name }));

      try {
        // 1. Compress main image
        const compressed = await compressImage(file, 1200, 900, 0.65);
        if (!compressed?.blob) throw new Error('Compression failed');

        const mainName = `${ts}_${baseName}.webp`;
        const { error: uploadErr } = await supabase.storage
          .from('portfolio-images')
          .upload(mainName, compressed.blob, { contentType: 'image/webp', upsert: false });
        if (uploadErr) throw uploadErr;

        const { data: mainUrl } = supabase.storage.from('portfolio-images').getPublicUrl(mainName);

        // 2. Make thumbnail
        const thumbBlob = await makeThumbnail(file);
        const thumbName = `thumb_${ts}_${baseName}.webp`;
        let thumbUrl = mainUrl.publicUrl;
        if (thumbBlob) {
          await supabase.storage.from('portfolio-thumbnails').upload(thumbName, thumbBlob, { contentType: 'image/webp', upsert: false });
          const { data: td } = supabase.storage.from('portfolio-thumbnails').getPublicUrl(thumbName);
          thumbUrl = td.publicUrl;
        }

        // 3. Insert DB record
        const title = baseName.replace(/[_-]+/g, ' ').trim();
        const { error: dbErr } = await supabase.from('portfolio_items').insert({
          title,
          category,
          image_url: mainUrl.publicUrl,
          thumbnail_url: thumbUrl,
          file_name: mainName,
          file_size: compressed.blob.size,
        });
        if (dbErr) throw dbErr;

        newResults.push({ name: file.name, status: 'success', origKB: Math.round(file.size / 1024), compKB: compressed.sizeKB });
      } catch (err) {
        newResults.push({ name: file.name, status: 'error', message: err.message });
      }

      setProgress(p => ({ ...p, done: i + 1 }));
    }

    // Cleanup preview URLs
    previews.forEach(u => URL.revokeObjectURL(u));
    setFiles([]);
    setPreviews([]);
    setResults(newResults);
    setUploading(false);
  }

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const totalSaved = results.filter(r => r.status === 'success').reduce((a, r) => a + (r.origKB - r.compKB), 0);

  return (
    <div style={S.layout}>
      <AdminSidebar
        onLogout={async () => { await logout(); router.push('/admin/login'); }}
        userEmail={user?.email}
        userName={user?.displayName}
        userPhoto={user?.photoURL}
      />

      <main style={S.main}>
        <div style={S.topBar}>
          <div>
            <h1 style={S.pageTitle}>Upload Portfolio Images</h1>
            <p style={S.pageSub}>Compressed to WebP · Max 1200×900 · ~65% quality · Low file size</p>
          </div>
          <Link href="/admin/portfolio" style={S.backBtn}>← Back to Portfolio</Link>
        </div>

        <div style={S.card}>
          {/* Drop Zone */}
          <div
            style={S.dropZone}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={{ fontSize: 44, marginBottom: 12 }}>📁</div>
            <p style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '0 0 6px' }}>Drag & Drop images here</p>
            <p style={{ color: '#666', fontSize: 13, margin: 0 }}>or click to browse · JPG, PNG, WebP · Auto-compressed to WebP</p>
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
          </div>

          {/* Category */}
          <div style={S.field}>
            <label style={S.label}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={S.select}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* File Previews */}
          {files.length > 0 && (
            <div style={S.field}>
              <label style={S.label}>{files.length} file{files.length > 1 ? 's' : ''} selected — will be compressed before upload</label>
              <div style={S.previewGrid}>
                {files.map((f, i) => (
                  <div key={i} style={S.previewCard}>
                    <img src={previews[i]} alt={f.name} style={S.previewImg} />
                    <div style={S.previewInfo}>
                      <span style={{ color: '#ccc', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name.slice(0, 20)}</span>
                      <span style={{ color: '#888', fontSize: 11 }}>{(f.size / 1024).toFixed(0)}KB → ~{Math.round(f.size / 1024 * 0.35)}KB</span>
                    </div>
                    <button onClick={() => removeFile(i)} style={S.removeBtn}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          {uploading && (
            <div style={S.field}>
              <div style={S.progressBar}>
                <div style={{ ...S.progressFill, width: `${(progress.done / progress.total) * 100}%` }} />
              </div>
              <p style={{ color: '#aaa', fontSize: 13, margin: '8px 0 0' }}>
                Compressing & uploading {progress.done}/{progress.total} — {progress.current}
              </p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div style={S.resultsBox}>
              <p style={{ color: '#4caf50', margin: '0 0 6px', fontWeight: 600 }}>✅ {successCount} uploaded successfully</p>
              {totalSaved > 0 && <p style={{ color: '#6c63ff', fontSize: 13, margin: '0 0 6px' }}>💾 Saved ~{totalSaved}KB total by compression</p>}
              {errorCount > 0 && <p style={{ color: '#ff6b6b', margin: '0 0 8px' }}>❌ {errorCount} failed</p>}
              {results.filter(r => r.status === 'success').map((r, i) => (
                <p key={i} style={{ color: '#666', fontSize: 12, margin: '2px 0' }}>
                  ✓ {r.name} — {r.origKB}KB → {r.compKB}KB (saved {r.origKB - r.compKB}KB)
                </p>
              ))}
              {results.filter(r => r.status === 'error').map((r, i) => (
                <p key={i} style={{ color: '#ff6b6b', fontSize: 12, margin: '2px 0' }}>✗ {r.name}: {r.message}</p>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <Link href="/admin/portfolio" style={S.uploadBtn}>View Portfolio</Link>
                <button onClick={() => setResults([])} style={S.clearBtn}>Upload More</button>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {files.length > 0 && !uploading && results.length === 0 && (
            <button onClick={handleUpload} style={S.uploadBtn}>
              ↑ Compress & Upload {files.length} Image{files.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

const S = {
  layout: { display: 'flex', minHeight: '100vh', background: '#0a0a18', fontFamily: 'Inter, system-ui, sans-serif' },
  main: { marginLeft: 250, flex: 1, padding: '32px 36px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  pageTitle: { color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 4px' },
  pageSub: { color: '#666', fontSize: 13, margin: 0 },
  backBtn: { padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid #333', borderRadius: 8, color: '#aaa', textDecoration: 'none', fontSize: 13 },
  card: { background: '#111127', border: '1px solid #222', borderRadius: 16, padding: 32, maxWidth: 720 },
  dropZone: { border: '2px dashed #333', borderRadius: 12, padding: '48px 32px', textAlign: 'center', cursor: 'pointer', marginBottom: 24, transition: 'border-color 0.2s', background: 'rgba(108,99,255,0.03)' },
  field: { marginBottom: 24 },
  label: { display: 'block', color: '#888', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 },
  select: { width: '100%', padding: '11px 14px', background: '#0d0d1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' },
  previewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 },
  previewCard: { position: 'relative', background: '#1a1a2e', borderRadius: 8, overflow: 'hidden', border: '1px solid #222' },
  previewImg: { width: '100%', height: 110, objectFit: 'cover', display: 'block' },
  previewInfo: { padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 2 },
  removeBtn: { position: 'absolute', top: 4, right: 4, width: 22, height: 22, background: 'rgba(255,68,68,0.8)', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 },
  progressBar: { background: '#1a1a2e', borderRadius: 8, height: 8, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#6c63ff,#e040fb)', borderRadius: 8, transition: 'width 0.3s' },
  resultsBox: { background: '#0d0d1a', border: '1px solid #222', borderRadius: 10, padding: 20 },
  uploadBtn: { display: 'inline-block', padding: '13px 28px', background: 'linear-gradient(135deg,#6c63ff,#e040fb)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' },
  clearBtn: { padding: '13px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid #333', borderRadius: 8, color: '#aaa', fontSize: 14, cursor: 'pointer' },
};
