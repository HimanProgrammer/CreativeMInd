'use client';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/lib/authContext';

const CATEGORIES = ['Website Design', 'Web Design', 'UI/UX', 'Branding', 'Mobile App', 'Logo', 'Social Media', 'Photography', 'General'];

// Auto-captures a site's home page (free, no API key needed).
export function shotUrl(url, w = 1200) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${w}`;
}

async function compressImage(file, maxWidth = 1200, maxHeight = 900, quality = 0.65) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxWidth || h > maxHeight) {
        const r = Math.min(maxWidth / w, maxHeight / h);
        w = Math.round(w * r); h = Math.round(h * r);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => resolve({ blob, sizeKB: Math.round(blob.size / 1024) }), 'image/webp', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

async function makeThumbnail(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const r = Math.min(400 / img.width, 300 / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * r);
      canvas.height = Math.round(img.height * r);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => resolve(blob), 'image/webp', 0.6);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

export default function UploadPortfolio() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const imgInputRef   = useRef(null);
  const videoInputRef = useRef(null);

  // Form fields
  const [category,  setCategory]  = useState('General');
  const [videoUrl,  setVideoUrl]  = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [title,     setTitle]     = useState('');

  // Selected files
  const [images,   setImages]   = useState([]); // [{ file, preview }]
  const [videos,   setVideos]   = useState([]); // [{ file }]

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState({ done: 0, total: 0, msg: '' });
  const [results,   setResults]   = useState([]);

  // YouTube status
  const [ytConnected, setYtConnected] = useState(false);
  const [ytConnecting, setYtConnecting] = useState(false);

  // DB health
  const [dbStatus,   setDbStatus]   = useState(null);
  const [dbSql,      setDbSql]      = useState('');
  const [dbChecking, setDbChecking] = useState(true);
  const [sqlCopied,  setSqlCopied]  = useState(false);

  useEffect(() => {
    fetch('/api/init-db')
      .then(r => r.json())
      .then(d => { setDbStatus(d.status); if (d.sql) setDbSql(d.sql); })
      .catch(() => setDbStatus('error'))
      .finally(() => setDbChecking(false));

    fetch('/api/youtube/status')
      .then(r => r.json())
      .then(d => setYtConnected(d.connected))
      .catch(() => {});
  }, []);

  async function connectYouTube() {
    setYtConnecting(true);
    try {
      const res  = await fetch('/api/youtube/auth');
      const data = await res.json();
      if (data.error) { alert('Setup YOUTUBE_CLIENT_ID in .env.local first.\n\n' + data.error); return; }
      const popup = window.open(data.url, 'yt-auth', 'width=500,height=600');
      // Poll for popup close then re-check status
      const timer = setInterval(async () => {
        if (popup?.closed) {
          clearInterval(timer);
          const s = await fetch('/api/youtube/status').then(r => r.json());
          setYtConnected(s.connected);
          setYtConnecting(false);
        }
      }, 800);
    } catch { setYtConnecting(false); }
  }

  function addImages(fileList) {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    setImages(prev => [...prev, ...files.map(f => ({ file: f, preview: URL.createObjectURL(f) }))]);
    setResults([]);
  }

  function addVideos(fileList) {
    const files = Array.from(fileList).filter(f => f.type.startsWith('video/'));
    setVideos(prev => [...prev, ...files.map(f => ({ file: f }))]);
    setResults([]);
  }

  function removeImage(i) {
    setImages(prev => { URL.revokeObjectURL(prev[i].preview); return prev.filter((_, idx) => idx !== i); });
  }

  function removeVideo(i) {
    setVideos(prev => prev.filter((_, idx) => idx !== i));
  }

  const totalCount  = images.length + videos.length;
  const canUploadImg = images.length > 0 && !uploading && dbStatus === 'ok';
  const canUploadVid = (videos.length > 0 || videoUrl.trim().length > 0) && !uploading && dbStatus === 'ok';
  const canAddWebsite = websiteUrl.trim().length > 0 && !uploading && dbStatus === 'ok';

  // ── Add a website entry (home page captured automatically) ─────────
  async function handleAddWebsite() {
    const url = websiteUrl.trim();
    if (!url) return;
    setUploading(true);
    setProgress({ done: 0, total: 1, msg: 'Capturing home page & saving...' });
    try {
      let host = url;
      try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { /* keep raw */ }
      const { error } = await supabase.from('portfolio_items').insert({
        title: title.trim() || host,
        category: 'Website Design',
        image_url: shotUrl(url),
        thumbnail_url: shotUrl(url, 600),
        website_url: url,
      });
      if (error) {
        if (error.code === '42P01' || error.message?.includes('relation')) setDbStatus('table_missing');
        throw error;
      }
      setResults(r => [...r, { type: 'website', name: host, status: 'ok', websiteUrl: url, sizeMB: '—' }]);
      setWebsiteUrl('');
    } catch (err) {
      setResults(r => [...r, { type: 'website', name: url, status: 'err', message: err.message }]);
    }
    setProgress({ done: 1, total: 1, msg: '' });
    setUploading(false);
  }

  async function handleUpload(mode = 'all') {
    if (mode === 'website') return handleAddWebsite();
    const uploadImages = mode === 'all' ? images : mode === 'images' ? images : [];
    const uploadVideos = mode === 'all' ? videos : mode === 'videos' ? videos : [];
    const total = uploadImages.length + uploadVideos.length;
    const isUrlOnly = mode === 'videos' && total === 0 && videoUrl.trim().length > 0;
    if (!total && !isUrlOnly) return;
    setUploading(true);
    setProgress({ done: 0, total: total || 1, msg: '' });
    const newResults = [];
    let done = 0;

    // ── Upload Images ────────────────────────────────────────────────
    for (let i = 0; i < uploadImages.length; i++) {
      const { file } = uploadImages[i];
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const ts = Date.now() + i;
      setProgress({ done, total, msg: `Uploading image ${i + 1}/${uploadImages.length}...` });

      try {
        const compressed = await compressImage(file);
        if (!compressed?.blob) throw new Error('Compression failed');

        const mainName = `${ts}_${baseName}.webp`;
        const { error: upErr } = await supabase.storage
          .from('portfolio-images')
          .upload(mainName, compressed.blob, { contentType: 'image/webp', upsert: false });
        if (upErr) throw upErr;

        const { data: mainData } = supabase.storage.from('portfolio-images').getPublicUrl(mainName);

        const thumbBlob = await makeThumbnail(file);
        const thumbName = `thumb_${ts}_${baseName}.webp`;
        let thumbUrl = mainData.publicUrl;
        if (thumbBlob) {
          await supabase.storage.from('portfolio-thumbnails').upload(thumbName, thumbBlob, { contentType: 'image/webp', upsert: false });
          const { data: td } = supabase.storage.from('portfolio-thumbnails').getPublicUrl(thumbName);
          thumbUrl = td.publicUrl;
        }

        const itemTitle = title.trim() || baseName.replace(/[_-]+/g, ' ').trim();
        const dbPromise = supabase.from('portfolio_items').insert({
          title: itemTitle, category,
          image_url: mainData.publicUrl,
          thumbnail_url: thumbUrl,
          file_name: mainName,
          file_size: compressed.blob.size,
          video_url: videoUrl.trim() || null,
          website_url: websiteUrl.trim() || null,
        });
        const timeout = new Promise(res => setTimeout(() => res({ error: new Error('Database timed out — run SQL setup in Supabase') }), 12000));
        const { error: dbErr } = await Promise.race([dbPromise, timeout]);
        if (dbErr) { if (dbErr.code === '42P01' || dbErr.message?.includes('relation')) setDbStatus('table_missing'); throw dbErr; }

        newResults.push({ type: 'image', name: file.name, status: 'ok', origKB: Math.round(file.size / 1024), compKB: compressed.sizeKB });
      } catch (err) {
        newResults.push({ type: 'image', name: file.name, status: 'err', message: err.message });
      }
      done++;
      setProgress(p => ({ ...p, done }));
    }

    // ── Save Video URL directly (no file upload needed) ─────────────
    if (uploadVideos.length === 0 && videoUrl.trim()) {
      setProgress({ done: 0, total: 1, msg: 'Saving video URL to database...' });
      try {
        const ytMatch = videoUrl.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
        const ytId    = ytMatch?.[1];
        const thumb   = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
        const itemTitle = title.trim() || (ytId ? `YouTube Video` : 'Video');
        const { error: dbErr } = await supabase.from('portfolio_items').insert({
          title: itemTitle,
          category,
          image_url:     thumb || '',
          thumbnail_url: thumb || '',
          video_url:     videoUrl.trim(),
          file_name:     null,
          file_size:     null,
        });
        if (dbErr) throw dbErr;
        newResults.push({ type: 'video', name: videoUrl.trim(), status: 'ok', videoUrl: videoUrl.trim(), sizeMB: '—' });
      } catch (err) {
        newResults.push({ type: 'video', name: videoUrl.trim(), status: 'err', message: err.message });
      }
      setVideoUrl('');
      setResults(newResults);
      setUploading(false);
      return;
    }

    // ── Upload Videos → YouTube ──────────────────────────────────────
    for (let i = 0; i < uploadVideos.length; i++) {
      const { file } = uploadVideos[i];
      const baseName  = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
      const itemTitle = title.trim() || baseName;
      setProgress({ done, total, msg: `Uploading video ${i + 1}/${uploadVideos.length} to YouTube...` });

      try {
        const form = new FormData();
        form.append('video',    file);
        form.append('title',    itemTitle);
        form.append('category', category);

        const res  = await fetch('/api/youtube/upload', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'YouTube upload failed');

        // Save to Supabase DB (placeholder image = YouTube thumbnail)
        const ytThumb = `https://img.youtube.com/vi/${data.videoId}/hqdefault.jpg`;
        const dbPromise = supabase.from('portfolio_items').insert({
          title: itemTitle, category,
          image_url:     ytThumb,
          thumbnail_url: ytThumb,
          file_name:     file.name,
          file_size:     file.size,
          video_url:     data.videoUrl,
        });
        const timeout = new Promise(res => setTimeout(() => res({ error: new Error('DB timeout') }), 15000));
        const { error: dbErr } = await Promise.race([dbPromise, timeout]);
        if (dbErr) throw dbErr;

        newResults.push({ type: 'video', name: file.name, status: 'ok', videoUrl: data.videoUrl, sizeMB: (file.size / 1024 / 1024).toFixed(1) });
      } catch (err) {
        newResults.push({ type: 'video', name: file.name, status: 'err', message: err.message });
      }
      done++;
      setProgress(p => ({ ...p, done }));
    }

    if (mode === 'images' || mode === 'all') {
      uploadImages.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
    }
    if (mode === 'videos' || mode === 'all') setVideos([]);
    setResults(newResults);
    setUploading(false);
  }

  const okCount  = results.filter(r => r.status === 'ok').length;
  const errCount = results.filter(r => r.status === 'err').length;

  return (
    <div style={S.layout}>
      <AdminSidebar
        onLogout={async () => { await logout(); router.push('/admin/login'); }}
        userEmail={user?.email} userName={user?.displayName} userPhoto={user?.photoURL}
      />

      <main style={S.main}>
        <div style={S.topBar}>
          <div>
            <h1 style={S.pageTitle}>Upload Portfolio</h1>
            <p style={S.pageSub}>Images auto-compressed to WebP · Videos stored directly</p>
          </div>
          <Link href="/admin/portfolio" style={S.backBtn}>← Back to Portfolio</Link>
        </div>

        {/* DB Banners */}
        {dbChecking && <div style={S.infoBanner}>⏳ Checking database...</div>}
        {dbStatus === 'table_missing' && (
          <div style={S.errBanner}>
            <b>⚠️ Database not ready.</b> Run SQL in <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ color: '#f4a261' }}>Supabase → SQL Editor</a> then refresh.
            <div style={S.sqlBox}><pre style={{ margin: 0, fontSize: 11, color: '#a8d8a8', whiteSpace: 'pre-wrap' }}>{dbSql}</pre></div>
            <button onClick={() => { navigator.clipboard.writeText(dbSql); setSqlCopied(true); setTimeout(() => setSqlCopied(false), 2000); }} style={S.copyBtn}>{sqlCopied ? '✅ Copied!' : '📋 Copy SQL'}</button>
          </div>
        )}

        <div style={S.card}>

          {/* ── Fields Row ── */}
          <div style={S.fieldsRow}>
            <div style={S.fieldCol}>
              <label style={S.lbl}>Title <span style={S.opt}>(optional)</span></label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Leave blank to use filename" style={S.inp} />
            </div>
            <div style={S.fieldCol}>
              <label style={S.lbl}>📂 Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={S.inp}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ ...S.fieldCol, flex: 2 }}>
              <label style={S.lbl}>🎬 Video URL <span style={S.opt}>(YouTube / Vimeo link)</span></label>
              <input
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{ ...S.inp, color: videoUrl ? '#c4b5fd' : undefined }}
              />
            </div>
          </div>

          {/* ── Website URL ── */}
          <div style={{ ...S.fieldsRow, marginTop: 14, alignItems: 'flex-end' }}>
            <div style={{ ...S.fieldCol, flex: 3 }}>
              <label style={S.lbl}>🌐 Website URL <span style={S.opt}>(live site — its home page is captured automatically)</span></label>
              <input
                type="url"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                style={{ ...S.inp, color: websiteUrl ? '#86efac' : undefined }}
              />
            </div>
            <div style={S.fieldCol}>
              <button
                onClick={() => handleUpload('website')}
                disabled={!canAddWebsite}
                style={{
                  ...S.uploadBtn,
                  width: '100%',
                  background: canAddWebsite ? 'linear-gradient(135deg,#16a34a,#22c55e)' : '#1a1a2e',
                  color: canAddWebsite ? '#fff' : '#444',
                  cursor: canAddWebsite ? 'pointer' : 'not-allowed',
                }}
              >
                🌐 Add Website
              </button>
            </div>
          </div>
          {websiteUrl.trim() && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src={shotUrl(websiteUrl.trim())}
                alt="Home page preview"
                style={{ width: 160, height: 100, objectFit: 'cover', objectPosition: 'top', borderRadius: 8, border: '1px solid #222', background: '#111' }}
              />
              <span style={{ color: '#666', fontSize: 12 }}>
                Home page preview — saved to the <strong style={{ color: '#86efac' }}>Website Design</strong> category and opens in a new tab on the site.
              </span>
            </div>
          )}

          <div style={S.divider} />

          {/* ── Two Drop Zones ── */}
          <div style={S.zonesRow}>

            {/* Images Zone */}
            <div style={S.zoneWrap}>
              <div
                style={S.dropZone}
                onDrop={e => { e.preventDefault(); addImages(e.dataTransfer.files); }}
                onDragOver={e => e.preventDefault()}
                onClick={() => imgInputRef.current?.click()}
              >
                <div style={{ fontSize: 40, marginBottom: 10 }}>🖼️</div>
                <p style={S.zoneTitle}>Drop Images Here</p>
                <p style={S.zoneSub}>JPG · PNG · WebP</p>
                <input ref={imgInputRef} type="file" multiple accept="image/*" onChange={e => addImages(e.target.files)} style={{ display: 'none' }} />
              </div>
              {/* Image Previews */}
              {images.length > 0 && (
                <div style={S.previewGrid}>
                  {images.map((img, i) => (
                    <div key={i} style={S.previewCard}>
                      <img src={img.preview} alt="" style={S.previewImg} />
                      <button onClick={() => removeImage(i)} style={S.removeBtn}>✕</button>
                    </div>
                  ))}
                </div>
              )}
              {images.length > 0 && <p style={S.countBadge}>🖼️ {images.length} image{images.length !== 1 ? 's' : ''} selected</p>}
            </div>

            {/* Videos Zone */}
            <div style={S.zoneWrap}>
              {/* YouTube Connect Status */}
              <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                {ytConnected ? (
                  <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 600 }}>✅ YouTube Connected</span>
                ) : (
                  <>
                    <span style={{ color: '#f87171', fontSize: 12 }}>⚠️ YouTube not connected</span>
                    <button onClick={connectYouTube} disabled={ytConnecting} style={S.ytBtn}>
                      {ytConnecting ? '⏳ Connecting...' : '🔗 Connect YouTube'}
                    </button>
                  </>
                )}
              </div>
              <div
                style={{ ...S.dropZone, borderColor: videos.length ? '#7c3aed' : '#2a2a4a', opacity: ytConnected ? 1 : 0.5 }}
                onDrop={e => { e.preventDefault(); addVideos(e.dataTransfer.files); }}
                onDragOver={e => e.preventDefault()}
                onClick={() => { if (!ytConnected) { alert('Connect YouTube first!'); return; } videoInputRef.current?.click(); }}
              >
                <div style={{ fontSize: 40, marginBottom: 10 }}>🎬</div>
                <p style={S.zoneTitle}>Drop Videos Here</p>
                <p style={S.zoneSub}>MP4 · MOV · WEBM</p>
                <input ref={videoInputRef} type="file" multiple accept="video/*" onChange={e => addVideos(e.target.files)} style={{ display: 'none' }} />
              </div>
              {/* Video List */}
              {videos.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                  {videos.map((v, i) => (
                    <div key={i} style={S.videoRow}>
                      <span style={{ fontSize: 20 }}>🎬</span>
                      <span style={{ flex: 1, color: '#aaa', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {v.file.name}
                      </span>
                      <span style={{ color: '#555', fontSize: 12 }}>{(v.file.size / 1024 / 1024).toFixed(1)} MB</span>
                      <button onClick={() => removeVideo(i)} style={S.removeBtn}>✕</button>
                    </div>
                  ))}
                </div>
              )}
              {videos.length > 0 && <p style={{ ...S.countBadge, color: '#a78bfa' }}>🎬 {videos.length} video{videos.length !== 1 ? 's' : ''} selected</p>}
            </div>

          </div>

          {/* ── Two Upload Buttons ── */}
          <div style={{ marginTop: 28, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>

            {/* Upload Images Button */}
            <button
              onClick={() => handleUpload('images')}
              disabled={!canUploadImg}
              style={{
                ...S.uploadBtn,
                background: canUploadImg ? 'linear-gradient(135deg,#6c63ff,#4f46e5)' : '#1a1a2e',
                opacity: canUploadImg ? 1 : 0.45,
                cursor: canUploadImg ? 'pointer' : 'not-allowed',
                boxShadow: canUploadImg ? '0 4px 20px rgba(108,99,255,0.4)' : 'none',
              }}
            >
              {uploading && progress.msg?.includes('image')
                ? `⏳ ${progress.done}/${progress.total}`
                : `🖼️ Upload Images${images.length > 0 ? ` (${images.length})` : ''}`}
            </button>

            {/* Upload Videos Button */}
            <button
              onClick={() => handleUpload('videos')}
              disabled={!canUploadVid}
              style={{
                ...S.uploadBtn,
                background: canUploadVid ? 'linear-gradient(135deg,#f05a28,#e040fb)' : '#1a1a2e',
                opacity: canUploadVid ? 1 : 0.45,
                cursor: canUploadVid ? 'pointer' : 'not-allowed',
                boxShadow: canUploadVid ? '0 4px 20px rgba(240,90,40,0.4)' : 'none',
              }}
            >
              {uploading && progress.msg?.includes('video')
                ? `⏳ ${progress.done}/${progress.total}`
                : `🎬 Upload Videos${videos.length > 0 ? ` (${videos.length})` : ''}`}
            </button>

            {dbStatus !== 'ok' && !dbChecking && (
              <span style={{ color: '#f87171', fontSize: 12 }}>⚠️ Fix DB setup first</span>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div style={{ marginTop: 16 }}>
              <div style={S.progressBar}>
                <div style={{ ...S.progressFill, width: `${(progress.done / progress.total) * 100}%` }} />
              </div>
              <p style={{ color: '#6c63ff', fontSize: 13, margin: '8px 0 0' }}>{progress.msg}</p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div style={S.resultsBox}>
              {okCount > 0 && <p style={{ color: '#4ade80', fontWeight: 700, margin: '0 0 8px', fontSize: 15 }}>✅ {okCount} uploaded successfully</p>}
              {errCount > 0 && <p style={{ color: '#f87171', fontWeight: 700, margin: '0 0 8px', fontSize: 15 }}>❌ {errCount} failed</p>}
              {results.map((r, i) => r.status === 'ok' ? (
                <p key={i} style={{ color: '#6b7280', fontSize: 12, margin: '3px 0' }}>
                  {r.type === 'image' ? '🖼️' : '🎬'}{' '}
                  {r.type === 'image'
                    ? `${r.origKB}KB → ${r.compKB}KB`
                    : <><a href={r.videoUrl} target="_blank" rel="noreferrer" style={{ color: '#f87171' }}>YouTube ↗</a> · {r.sizeMB}MB</>
                  }
                  {' '}· <span style={{ color: '#818cf8' }}>{category}</span>
                </p>
              ) : (
                <p key={i} style={{ color: '#f87171', fontSize: 12, margin: '3px 0' }}>✗ {r.name}: {r.message}</p>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <Link href="/admin/portfolio" style={S.uploadBtn}>View Portfolio →</Link>
                <button onClick={() => { setResults([]); setTitle(''); setVideoUrl(''); }} style={S.ghostBtn}>Upload More</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const S = {
  layout:    { display: 'flex', minHeight: '100vh', background: '#0a0a18', fontFamily: 'Inter, system-ui, sans-serif' },
  main:      { marginLeft: 250, flex: 1, padding: '32px 36px' },
  topBar:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  pageTitle: { color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 4px' },
  pageSub:   { color: '#666', fontSize: 13, margin: 0 },
  backBtn:   { padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid #333', borderRadius: 8, color: '#aaa', textDecoration: 'none', fontSize: 13 },
  card:      { background: '#111127', border: '1px solid #222', borderRadius: 16, padding: 32, maxWidth: 900 },
  infoBanner: { background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#aaa', fontSize: 13 },
  errBanner:  { background: 'rgba(255,68,68,0.07)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 12, padding: '18px 22px', marginBottom: 20, color: '#fca5a5', fontSize: 13, lineHeight: 1.6 },
  sqlBox:     { background: '#0a0a18', border: '1px solid #333', borderRadius: 8, padding: '12px 14px', margin: '12px 0', maxHeight: 180, overflowY: 'auto' },
  copyBtn:    { padding: '7px 16px', background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.35)', borderRadius: 6, color: '#a78bfa', fontSize: 12, cursor: 'pointer', fontWeight: 600 },

  // Fields
  fieldsRow: { display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' },
  fieldCol:  { flex: 1, display: 'flex', flexDirection: 'column', gap: 7, minWidth: 160 },
  lbl:       { color: '#888', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' },
  opt:       { color: '#444', fontWeight: 400, textTransform: 'none', fontSize: 11 },
  inp:       { padding: '10px 13px', background: '#0a0a18', border: '1px solid #2a2a4a', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' },
  divider:   { height: 1, background: '#1e1e3a', margin: '4px 0 24px' },

  // Zones
  zonesRow:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  zoneWrap:  { display: 'flex', flexDirection: 'column' },
  dropZone:  { border: '2px dashed #2a2a4a', borderRadius: 12, padding: '36px 20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(108,99,255,0.03)', transition: 'border-color 0.2s' },
  zoneTitle: { color: '#fff', fontSize: 16, fontWeight: 700, margin: '0 0 4px' },
  zoneSub:   { color: '#444', fontSize: 12, margin: 0 },

  // Previews
  previewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8, marginTop: 12 },
  previewCard: { position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #2a2a4a' },
  previewImg:  { width: '100%', height: 64, objectFit: 'cover', display: 'block' },
  removeBtn:   { position: 'absolute', top: 3, right: 3, width: 20, height: 20, background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: '50%', color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  countBadge:  { color: '#6c63ff', fontSize: 12, margin: '8px 0 0', fontWeight: 600 },
  videoRow:    { display: 'flex', alignItems: 'center', gap: 10, background: '#0d0d20', border: '1px solid #1e1e3a', borderRadius: 8, padding: '8px 12px' },

  // Upload btn
  uploadBtn:   { display: 'inline-flex', alignItems: 'center', padding: '13px 32px', background: 'linear-gradient(135deg,#6c63ff,#e040fb)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', textDecoration: 'none', letterSpacing: '-0.01em' },
  ghostBtn:    { padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a4a', borderRadius: 8, color: '#888', fontSize: 14, cursor: 'pointer' },
  ytBtn:       { padding: '5px 14px', background: 'rgba(255,68,68,0.15)', border: '1px solid rgba(255,68,68,0.35)', borderRadius: 6, color: '#f87171', fontSize: 12, cursor: 'pointer', fontWeight: 600 },
  progressBar: { background: '#1a1a2e', borderRadius: 8, height: 8, overflow: 'hidden', marginBottom: 0 },
  progressFill:{ height: '100%', background: 'linear-gradient(90deg,#6c63ff,#e040fb)', borderRadius: 8, transition: 'width 0.3s' },
  resultsBox:  { background: '#0d0d1a', border: '1px solid #1e1e3a', borderRadius: 12, padding: 20, marginTop: 24 },
};
