'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';

const CATEGORIES = ['General', 'Web Design', 'Mobile App', 'Branding', 'UI/UX', 'Logo', 'Social Media', 'Photography'];

export default function AdminPortfolio() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableError, setTableError] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [editItem, setEditItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [view, setView] = useState('grid'); // grid | list
  const [dupModal, setDupModal] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [removingDups, setRemovingDups] = useState(false);
  const [removingProgress, setRemovingProgress] = useState('');
  const [scanProgress, setScanProgress] = useState('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/admin/login'); return; }
    fetchItems();
  }, [user, authLoading]);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.message?.includes('schema cache') || error.message?.includes('relation') || error.code === 'PGRST106' || error.code === '42P01') {
        setTableError(true);
      }
      setLoading(false);
      return;
    }
    setItems(data || []);
    setLoading(false);
  }

  // ── Smart duplicate detection ─────────────────────────────────────────────
  // Groups images by: exact URL → exact file_size → stripped filename
  // Returns [{keep, remove, matchedBy}]
  function findDuplicates(allItems) {
    const seenRemoveIds = new Set();
    const result = [];

    // Pass 1: group by exact image_url
    const byUrl = {};
    for (const item of allItems) {
      const k = item.image_url?.trim().toLowerCase().split('?')[0];
      if (!k) continue;
      if (!byUrl[k]) byUrl[k] = [];
      byUrl[k].push(item);
    }

    // Pass 2: group by exact file_size (strongest signal for identical graphics)
    const bySize = {};
    for (const item of allItems) {
      if (!item.file_size || item.file_size < 5120) continue; // skip < 5KB
      const k = String(item.file_size);
      if (!bySize[k]) bySize[k] = [];
      bySize[k].push(item);
    }

    // Pass 3: group by cleaned filename
    const byName = {};
    for (const item of allItems) {
      const raw = (item.file_name || item.image_url?.split('/').pop() || '').split('?')[0];
      const name = raw.replace(/^\d{8,}_/, '').toLowerCase().trim();
      if (!name || name.length < 5) continue;
      if (!byName[name]) byName[name] = [];
      byName[name].push(item);
    }

    function processGroup(g, matchedBy) {
      if (g.length < 2) return;
      const sorted = [...g].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const keep = sorted[0];
      const remove = sorted.slice(1).filter(i => !seenRemoveIds.has(i.id) && i.id !== keep.id);
      if (remove.length === 0) return;
      remove.forEach(i => seenRemoveIds.add(i.id));
      result.push({ keep, remove, matchedBy });
    }

    Object.values(byUrl).forEach(g => processGroup(g, 'Exact URL'));
    Object.values(bySize).forEach(g => processGroup(g, 'Same file size'));
    Object.values(byName).forEach(g => processGroup(g, 'Same filename'));

    return result;
  }

  // ── Perceptual hash (dHash 8×8) via Canvas + server proxy (bypasses CORS) ──
  async function getImageHash(url) {
    return new Promise((resolve) => {
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const W = 9, H = 8; // 9 cols × 8 rows → 64 difference bits
          const canvas = document.createElement('canvas');
          canvas.width = W; canvas.height = H;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, W, H);
          const data = ctx.getImageData(0, 0, W, H).data;
          const gray = [];
          for (let i = 0; i < W * H; i++) {
            const r = data[i*4], g = data[i*4+1], b = data[i*4+2];
            gray.push(0.299*r + 0.587*g + 0.114*b);
          }
          let hash = '';
          for (let row = 0; row < H; row++) {
            for (let col = 0; col < W - 1; col++) {
              hash += gray[row*W + col] > gray[row*W + col + 1] ? '1' : '0';
            }
          }
          resolve(hash);
        } catch { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = proxyUrl;
      setTimeout(() => resolve(null), 12000);
    });
  }

  function hashDistance(h1, h2) {
    if (!h1 || !h2 || h1.length !== h2.length) return 999;
    let diff = 0;
    for (let i = 0; i < h1.length; i++) if (h1[i] !== h2[i]) diff++;
    return diff;
  }

  async function handleSmartScan() {
    setScanning(true);
    setScanProgress('Starting visual scan...');
    const allItems = [...items];
    const hashes = {};

    for (let i = 0; i < allItems.length; i++) {
      setScanProgress(`🔍 Hashing ${i + 1} / ${allItems.length}...`);
      const item = allItems[i];

      // Always compute visual hash via proxy (bypasses CORS)
      const h = await getImageHash(item.image_url);

      if (!h) {
        // Fallback: group by exact file_size if hash failed
        if (item.file_size && item.file_size > 5120) {
          const fk = `fallback_size_${item.file_size}`;
          if (!hashes[fk]) hashes[fk] = [];
          hashes[fk].push({ item, hash: fk });
        }
        continue;
      }

      // Find existing group within Hamming distance 5 (same graphic = nearly identical hash)
      let matched = false;
      for (const groupKey of Object.keys(hashes)) {
        if (!groupKey.startsWith('ph_')) continue;
        if (hashDistance(h, hashes[groupKey][0].hash) <= 5) {
          hashes[groupKey].push({ item, hash: h });
          matched = true;
          break;
        }
      }
      if (!matched) hashes[`ph_${i}_${Date.now()}`] = [{ item, hash: h }];
    }

    // Build duplicate groups
    const seenIds = new Set();
    const dups = [];
    for (const group of Object.values(hashes)) {
      if (group.length < 2) continue;
      const sorted = [...group].sort((a, b) => new Date(b.item.created_at) - new Date(a.item.created_at));
      const keep = sorted[0].item;
      const remove = sorted.slice(1).map(x => x.item).filter(i => !seenIds.has(i.id) && i.id !== keep.id);
      if (remove.length === 0) continue;
      remove.forEach(i => seenIds.add(i.id));
      const matchedBy = group[0].hash.startsWith('sz_') ? 'Same file size' : group[0].hash.startsWith('nm_') ? 'Same filename' : 'Visual match';
      dups.push({ keep, remove, matchedBy });
    }

    setScanning(false);
    setScanProgress('');
    setDuplicates(dups);
    setDupModal(true);
  }

  function handleFindDuplicates() {
    const dups = findDuplicates(items);
    setDuplicates(dups);
    setDupModal(true);
  }

  // ── Auto Delete: server-side SHA-256 scan + batch delete ─────────────────
  async function handleAutoDelete() {
    if (!confirm(`Auto Delete will scan all ${items.length} images by content hash and delete every duplicate.\n\nKeeps newest copy of each graphic. Continue?`)) return;

    setScanning(true);
    setScanProgress(`🚀 Starting server scan of ${items.length} images...`);

    try {
      // ── Phase 1: server-side scan via streaming API ──────────────────────
      const res = await fetch('/api/find-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!res.body) throw new Error('No response stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let groups = [];
      let totalDups = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const evt = JSON.parse(line);
            if (evt.type === 'log') setScanProgress(evt.msg);
            if (evt.type === 'done') { groups = evt.groups; totalDups = evt.totalDups; }
            if (evt.type === 'error') throw new Error(evt.error);
          } catch { /* skip parse errors */ }
        }
      }

      if (totalDups === 0) {
        setScanning(false);
        setScanProgress('');
        alert('✅ No duplicates found! All graphics are unique.');
        return;
      }

      // ── Phase 2: batch delete from DB ────────────────────────────────────
      const toRemove = groups.flatMap(g => g.remove);
      const ids = toRemove.map(i => i.id);

      setScanProgress(`🗑 Deleting ${ids.length} duplicate records...`);
      await supabase.from('portfolio_items').delete().in('id', ids);

      // ── Phase 3: delete from storage ─────────────────────────────────────
      const imgPaths = toRemove
        .map(i => i.image_url?.match(/\/portfolio-images\/(.+)/)?.[1]?.split('?')[0])
        .filter(Boolean);
      const thumbPaths = toRemove
        .map(i => i.thumbnail_url?.match(/\/portfolio-thumbnails\/(.+)/)?.[1]?.split('?')[0])
        .filter(Boolean);

      for (let i = 0; i < imgPaths.length; i += 20) {
        setScanProgress(`🗑 Storage ${i + 1}–${Math.min(i + 20, imgPaths.length)} / ${imgPaths.length}...`);
        await supabase.storage.from('portfolio-images').remove(imgPaths.slice(i, i + 20));
      }
      for (let i = 0; i < thumbPaths.length; i += 20) {
        await supabase.storage.from('portfolio-thumbnails').remove(thumbPaths.slice(i, i + 20));
      }

      const removedIds = new Set(ids);
      setItems(prev => prev.filter(i => !removedIds.has(i.id)));
      setScanning(false);
      setScanProgress('');
      alert(`✅ Auto Delete complete!\n\nRemoved: ${ids.length} duplicates\nGroups: ${groups.length}\nRemaining: ${items.length - ids.length} unique images`);

    } catch (err) {
      setScanning(false);
      setScanProgress('');
      alert('❌ Error: ' + err.message);
    }
  }

  // Group items by title — titles that appear >1 time are "same-title duplicates"
  function getSameTitleGroups() {
    const titleGroups = {};
    for (const item of items) {
      const t = (item.title || 'untitled').toLowerCase().trim();
      if (!titleGroups[t]) titleGroups[t] = [];
      titleGroups[t].push(item);
    }
    return Object.values(titleGroups).filter(g => g.length > 1).map(g => {
      const sorted = [...g].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return { keep: sorted[0], remove: sorted.slice(1) };
    });
  }

  async function handleRemoveDuplicates() {
    setRemovingDups(true);
    const toRemove = duplicates.flatMap(d => d.remove);
    let done = 0;

    // Batch delete DB rows (much faster than one-by-one)
    const ids = toRemove.map(i => i.id);
    setRemovingProgress(`Deleting ${ids.length} records from database...`);
    try {
      await supabase.from('portfolio_items').delete().in('id', ids);
    } catch (err) {
      console.error('Batch delete error:', err);
    }

    // Delete storage files in batches of 10
    const imgPaths = toRemove
      .map(i => i.image_url?.match(/\/portfolio-images\/(.+)/)?.[1]?.split('?')[0])
      .filter(Boolean);
    const thumbPaths = toRemove
      .map(i => i.thumbnail_url?.match(/\/portfolio-thumbnails\/(.+)/)?.[1]?.split('?')[0])
      .filter(Boolean);

    if (imgPaths.length > 0) {
      setRemovingProgress(`Deleting ${imgPaths.length} images from storage...`);
      for (let i = 0; i < imgPaths.length; i += 10) {
        await supabase.storage.from('portfolio-images').remove(imgPaths.slice(i, i + 10));
      }
    }
    if (thumbPaths.length > 0) {
      setRemovingProgress(`Deleting ${thumbPaths.length} thumbnails from storage...`);
      for (let i = 0; i < thumbPaths.length; i += 10) {
        await supabase.storage.from('portfolio-thumbnails').remove(thumbPaths.slice(i, i + 10));
      }
    }

    done = ids.length;
    const removeIds = new Set(ids);
    setItems(prev => prev.filter(i => !removeIds.has(i.id)));
    setRemovingDups(false);
    setRemovingProgress('');
    setDupModal(false);
    setDuplicates([]);
    alert(`✅ Removed ${done} duplicate image${done !== 1 ? 's' : ''}!`);
  }

  async function handleDelete(item) {
    if (!confirm(`Delete "${item.title || 'this image'}"?`)) return;
    setDeleting(item.id);
    const filePath = item.image_url?.split('/portfolio-images/')[1];
    if (filePath) await supabase.storage.from('portfolio-images').remove([filePath]);
    if (item.thumbnail_url) {
      const tp = item.thumbnail_url.split('/portfolio-thumbnails/')[1];
      if (tp) await supabase.storage.from('portfolio-thumbnails').remove([tp]);
    }
    await supabase.from('portfolio_items').delete().eq('id', item.id);
    setItems(prev => prev.filter(i => i.id !== item.id));
    setDeleting(null);
  }

  async function handleBulkDelete() {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} selected images?`)) return;
    setBulkDeleting(true);
    const ids = [...selected];
    await supabase.from('portfolio_items').delete().in('id', ids);
    setItems(prev => prev.filter(i => !selected.has(i.id)));
    setSelected(new Set());
    setBulkDeleting(false);
  }

  async function handleSaveEdit() {
    if (!editItem) return;
    await supabase.from('portfolio_items').update({ title: editItem.title, category: editItem.category }).eq('id', editItem.id);
    setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, title: editItem.title, category: editItem.category } : i));
    setEditItem(null);
  }

  function toggleSelect(id) {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  function selectAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(i => i.id)));
  }

  const categories = [...new Set(items.map(i => i.category).filter(Boolean))];
  const filtered = items.filter(i => {
    const matchCat = filter === 'all' || i.category === filter;
    const matchSearch = !search || i.title?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) return <div style={S.loading}><div style={S.spinner} /></div>;

  return (
    <div style={S.layout} suppressHydrationWarning>
      <AdminSidebar onLogout={async () => { await logout(); router.push('/admin/login'); }} userEmail={user?.email} userName={user?.displayName} userPhoto={user?.photoURL} />

      <main style={S.main}>
        {/* Top Bar */}
        <div style={S.topBar}>
          <div>
            <h1 style={S.pageTitle}>Portfolio</h1>
            <p style={S.pageSub}>{items.length} images total{selected.size > 0 ? ` · ${selected.size} selected` : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {selected.size > 0 && (
              <button onClick={handleBulkDelete} disabled={bulkDeleting} style={S.deleteSelectedBtn}>
                {bulkDeleting ? 'Deleting...' : `🗑 Delete ${selected.size}`}
              </button>
            )}
            {items.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={handleFindDuplicates} disabled={scanning} style={S.dupBtn} title="Fast scan by file size & filename">
                  ⚡ Quick Scan
                </button>
                <button onClick={handleSmartScan} disabled={scanning} style={{ ...S.dupBtn, background: 'rgba(108,99,255,0.12)', borderColor: 'rgba(108,99,255,0.3)', color: '#a78bfa' }} title="Visual scan — preview duplicates before deleting">
                  🧠 Smart Scan
                </button>
                <button onClick={handleAutoDelete} disabled={scanning} style={{ ...S.dupBtn, background: scanning ? 'rgba(255,60,60,0.25)' : 'rgba(255,60,60,0.15)', borderColor: 'rgba(255,60,60,0.4)', color: '#ff6b6b', fontWeight: 700 }} title="Auto scan + delete all duplicates in one click">
                  {scanning ? `⏳ ${scanProgress || 'Working...'}` : '🤖 Auto Delete Duplicates'}
                </button>
              </div>
            )}
            <Link href="/admin/scraper" style={S.secondaryBtn}>🔍 Extract Images</Link>
            <Link href="/admin/portfolio/upload" style={S.addBtn}>+ Upload</Link>
          </div>
        </div>

        {/* Table Setup Error */}
        {tableError && (
          <div style={S.setupBox}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚙️</div>
            <h3 style={{ color: '#fff', margin: '0 0 8px' }}>Database Tables Not Set Up</h3>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 20px' }}>
              The <code style={{ color: '#6c63ff' }}>portfolio_items</code> table does not exist yet. Run the SQL setup in Supabase to create all tables.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://supabase.com/dashboard/project/obmnplusxczaqgxpgswh/sql/new"
                target="_blank"
                rel="noreferrer"
                style={S.addBtn}
              >
                Open Supabase SQL Editor ↗
              </a>
              <button onClick={() => { setTableError(false); fetchItems(); }} style={S.secondaryBtn}>
                Retry
              </button>
            </div>
            <div style={S.sqlBox}>
              <p style={{ color: '#666', fontSize: 12, margin: '0 0 8px' }}>Paste this SQL and click Run:</p>
              <pre style={S.sqlPre}>{SQL_SETUP}</pre>
            </div>
          </div>
        )}

        {!tableError && (
          <>
            {/* Filters + Search + View Toggle */}
            <div style={S.toolbar}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                {['all', ...categories].map(cat => (
                  <button key={cat} onClick={() => setFilter(cat)}
                    style={filter === cat ? { ...S.filterBtn, ...S.filterBtnActive } : S.filterBtn}>
                    {cat === 'all' ? `All (${items.length})` : cat}
                  </button>
                ))}
              </div>
              <input
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={S.searchInput}
              />
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => setView('grid')} style={view === 'grid' ? { ...S.viewBtn, ...S.viewBtnActive } : S.viewBtn}>⊞</button>
                <button onClick={() => setView('list')} style={view === 'list' ? { ...S.viewBtn, ...S.viewBtnActive } : S.viewBtn}>≡</button>
              </div>
            </div>

            {/* Select All */}
            {filtered.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <label style={{ color: '#888', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={selectAll} />
                  Select All ({filtered.length})
                </label>
              </div>
            )}

            {/* Empty State */}
            {filtered.length === 0 && (
              <div style={S.empty}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🖼️</div>
                <p style={{ color: '#666', fontSize: 16, marginBottom: 20 }}>No images found.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <Link href="/admin/portfolio/upload" style={S.addBtn}>Upload Images</Link>
                  <Link href="/admin/scraper" style={S.secondaryBtn}>Extract from Web</Link>
                </div>
              </div>
            )}

            {/* Grid View */}
            {view === 'grid' && filtered.length > 0 && (
              <div style={S.grid}>
                {filtered.map(item => (
                  <div key={item.id} style={{ ...S.card, outline: selected.has(item.id) ? '2px solid #6c63ff' : 'none' }}>
                    <div style={S.imgWrap}>
                      <img src={item.image_url} alt={item.title} style={S.img} onError={e => e.target.src = '/assets/imgs/placeholder.jpg'} />
                      <div style={S.overlay} className="card-overlay">
                        <button onClick={() => setPreviewItem(item)} style={S.overlayBtn}>👁 View</button>
                        <button onClick={() => setEditItem({ ...item })} style={S.overlayBtn}>✏️ Edit</button>
                        <button onClick={() => handleDelete(item)} disabled={deleting === item.id} style={{ ...S.overlayBtn, background: 'rgba(255,68,68,0.9)' }}>
                          {deleting === item.id ? '...' : '🗑 Delete'}
                        </button>
                      </div>
                      <div style={S.selectCheck}>
                        <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} onClick={e => e.stopPropagation()} />
                      </div>
                    </div>
                    <div style={S.cardInfo}>
                      <p style={S.cardTitle}>{item.title || 'Untitled'}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={S.badge}>{item.category || 'General'}</span>
                        {item.file_size && <span style={{ color: '#555', fontSize: 11 }}>{Math.round(item.file_size / 1024)}KB</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {view === 'list' && filtered.length > 0 && (
              <div style={S.listTable}>
                <div style={S.listHeader}>
                  <span style={{ width: 30 }}><input type="checkbox" checked={selected.size === filtered.length} onChange={selectAll} /></span>
                  <span style={{ width: 60 }}>Image</span>
                  <span style={{ flex: 1 }}>Title</span>
                  <span style={{ width: 120 }}>Category</span>
                  <span style={{ width: 80 }}>Size</span>
                  <span style={{ width: 130 }}>Date</span>
                  <span style={{ width: 160 }}>Actions</span>
                </div>
                {filtered.map(item => (
                  <div key={item.id} style={{ ...S.listRow, background: selected.has(item.id) ? 'rgba(108,99,255,0.1)' : '#1a1a2e' }}>
                    <span style={{ width: 30 }}><input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} /></span>
                    <span style={{ width: 60 }}>
                      <img src={item.image_url} alt="" style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6 }} onError={e => e.target.src = '/assets/imgs/placeholder.jpg'} />
                    </span>
                    <span style={{ flex: 1, color: '#ccc', fontSize: 13 }}>{item.title || 'Untitled'}</span>
                    <span style={{ width: 120 }}><span style={S.badge}>{item.category || 'General'}</span></span>
                    <span style={{ width: 80, color: '#666', fontSize: 12 }}>{item.file_size ? `${Math.round(item.file_size / 1024)}KB` : '—'}</span>
                    <span style={{ width: 130, color: '#555', fontSize: 12 }}>{item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
                    <span style={{ width: 160, display: 'flex', gap: 6 }}>
                      <button onClick={() => setPreviewItem(item)} style={S.rowBtn}>👁</button>
                      <button onClick={() => setEditItem({ ...item })} style={S.rowBtn}>✏️</button>
                      <button onClick={() => handleDelete(item)} disabled={deleting === item.id} style={{ ...S.rowBtn, background: 'rgba(255,68,68,0.15)', color: '#ff6b6b' }}>
                        {deleting === item.id ? '...' : '🗑'}
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Edit Modal */}
      {editItem && (
        <div style={S.modalBg} onClick={() => setEditItem(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#fff', margin: '0 0 20px' }}>Edit Image</h3>
            <img src={editItem.image_url} alt="" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 20 }} />
            <label style={S.label}>Title</label>
            <input style={S.input} value={editItem.title || ''} onChange={e => setEditItem(p => ({ ...p, title: e.target.value }))} placeholder="Image title" />
            <label style={S.label}>Category</label>
            <select style={S.input} value={editItem.category || 'General'} onChange={e => setEditItem(p => ({ ...p, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={handleSaveEdit} style={{ ...S.addBtn, flex: 1 }}>Save Changes</button>
              <button onClick={() => setEditItem(null)} style={{ ...S.secondaryBtn, flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div style={S.modalBg} onClick={() => setPreviewItem(null)}>
          <div style={{ ...S.modal, maxWidth: 800, background: '#0d0d1a' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ color: '#fff', margin: 0 }}>{previewItem.title || 'Untitled'}</h3>
              <button onClick={() => setPreviewItem(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer' }}>×</button>
            </div>
            <img src={previewItem.image_url} alt="" style={{ width: '100%', maxHeight: 500, objectFit: 'contain', borderRadius: 10 }} />
            <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
              <span style={S.badge}>{previewItem.category || 'General'}</span>
              {previewItem.file_size && <span style={{ color: '#666', fontSize: 13 }}>{Math.round(previewItem.file_size / 1024)} KB</span>}
              <span style={{ color: '#666', fontSize: 13 }}>{previewItem.created_at ? new Date(previewItem.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <a href={previewItem.image_url} target="_blank" rel="noreferrer" style={{ ...S.secondaryBtn, textDecoration: 'none', textAlign: 'center' }}>Open Full Size ↗</a>
              <button onClick={() => { setPreviewItem(null); setEditItem({ ...previewItem }); }} style={S.addBtn}>✏️ Edit</button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicates Modal */}
      {dupModal && (
        <div style={S.modalBg} onClick={() => setDupModal(false)}>
          <div style={{ ...S.modal, maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ color: '#fff', margin: 0 }}>🔁 Duplicate Images</h3>
              <button onClick={() => setDupModal(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 22, cursor: 'pointer' }}>×</button>
            </div>

            {duplicates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <p style={{ color: '#4caf50', fontSize: 16, fontWeight: 600 }}>No duplicates found!</p>
                <p style={{ color: '#666', fontSize: 13 }}>All {items.length} images are unique.</p>
              </div>
            ) : (
              <>
                <p style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>
                  Found <span style={{ color: '#ff6b6b', fontWeight: 600 }}>{duplicates.reduce((a, d) => a + d.remove.length, 0)} duplicate{duplicates.reduce((a, d) => a + d.remove.length, 0) > 1 ? 's' : ''}</span> across {duplicates.length} group{duplicates.length > 1 ? 's' : ''}. The newest copy will be kept.
                </p>
                <div style={{ maxHeight: 400, overflowY: 'auto', marginBottom: 20 }}>
                  {duplicates.map((group, gi) => (
                    <div key={gi} style={{ background: '#0d0d1a', borderRadius: 10, padding: 14, marginBottom: 10, border: '1px solid #222' }}>
                      {/* Match reason badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 20, background: 'rgba(108,99,255,0.2)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.3)' }}>
                          🔍 {group.matchedBy}
                        </span>
                        <span style={{ color: '#555', fontSize: 11 }}>{group.remove.length + 1} copies → keeping newest</span>
                      </div>

                      {/* Images row */}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {/* KEEP */}
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ position: 'relative' }}>
                            <img src={group.keep.image_url} alt="" style={{ width: 90, height: 68, objectFit: 'cover', borderRadius: 6, border: '2px solid #4caf50', display: 'block' }} onError={e => { e.target.style.display='none'; }} />
                            <span style={{ position: 'absolute', top: 3, right: 3, background: '#4caf50', color: '#fff', fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 4 }}>KEEP</span>
                          </div>
                          <p style={{ color: '#4caf50', fontSize: 9, margin: '3px 0 0', fontWeight: 700 }}>{group.keep.file_size ? `${Math.round(group.keep.file_size/1024)}KB` : ''}</p>
                        </div>

                        {/* DELETE */}
                        {group.remove.map((item, ri) => (
                          <div key={ri} style={{ textAlign: 'center' }}>
                            <div style={{ position: 'relative' }}>
                              <img src={item.image_url} alt="" style={{ width: 90, height: 68, objectFit: 'cover', borderRadius: 6, border: '2px solid #ff4444', opacity: 0.65, display: 'block' }} onError={e => { e.target.style.display='none'; }} />
                              <span style={{ position: 'absolute', top: 3, right: 3, background: '#ff4444', color: '#fff', fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 4 }}>DEL</span>
                            </div>
                            <p style={{ color: '#ff6b6b', fontSize: 9, margin: '3px 0 0' }}>{item.file_size ? `${Math.round(item.file_size/1024)}KB` : ''}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={handleRemoveDuplicates}
                    disabled={removingDups}
                    style={{ ...S.deleteSelectedBtn, flex: 1, padding: '12px', fontSize: 14 }}
                  >
                    {removingDups ? (removingProgress || 'Removing...') : `🗑 Remove ${duplicates.reduce((a, d) => a + d.remove.length, 0)} Duplicates`}
                  </button>
                  <button onClick={() => setDupModal(false)} style={{ ...S.secondaryBtn, flex: 1, padding: '12px' }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .card-overlay { opacity: 0; transition: opacity 0.2s; }
        div:hover > div > .card-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

const SQL_SETUP = `CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  category TEXT DEFAULT 'General',
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read portfolio" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Admin insert portfolio" ON portfolio_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update portfolio" ON portfolio_items FOR UPDATE USING (true);
CREATE POLICY "Admin delete portfolio" ON portfolio_items FOR DELETE USING (true);`;

const S = {
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a18' },
  spinner: { width: 40, height: 40, border: '3px solid #222', borderTopColor: '#6c63ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  layout: { display: 'flex', minHeight: '100vh', background: '#0a0a18', fontFamily: 'Inter, system-ui, sans-serif' },
  main: { marginLeft: 250, flex: 1, padding: '32px 36px', minHeight: '100vh' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  pageTitle: { color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 4px' },
  pageSub: { color: '#666', fontSize: 14, margin: 0 },
  addBtn: { padding: '11px 22px', background: 'linear-gradient(135deg,#6c63ff,#e040fb)', borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
  secondaryBtn: { padding: '11px 22px', background: 'rgba(255,255,255,0.06)', border: '1px solid #333', borderRadius: 8, color: '#ccc', textDecoration: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
  deleteSelectedBtn: { padding: '11px 22px', background: 'rgba(255,68,68,0.15)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 8, color: '#ff6b6b', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  dupBtn: { padding: '11px 22px', background: 'rgba(255,165,0,0.12)', border: '1px solid rgba(255,165,0,0.25)', borderRadius: 8, color: '#ffab40', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  setupBox: { background: '#111127', border: '1px solid #333', borderRadius: 16, padding: '48px 32px', textAlign: 'center', marginBottom: 32 },
  sqlBox: { background: '#0d0d1a', border: '1px solid #222', borderRadius: 10, padding: 20, marginTop: 24, textAlign: 'left' },
  sqlPre: { color: '#6c63ff', fontSize: 11, margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.6 },
  toolbar: { display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' },
  filterBtn: { padding: '7px 14px', background: '#1a1a2e', border: '1px solid #333', borderRadius: 20, color: '#888', cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' },
  filterBtnActive: { background: '#6c63ff', borderColor: '#6c63ff', color: '#fff' },
  searchInput: { padding: '8px 14px', background: '#1a1a2e', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', minWidth: 180 },
  viewBtn: { width: 34, height: 34, background: '#1a1a2e', border: '1px solid #333', borderRadius: 6, color: '#888', cursor: 'pointer', fontSize: 16 },
  viewBtnActive: { background: '#6c63ff', borderColor: '#6c63ff', color: '#fff' },
  empty: { textAlign: 'center', padding: '80px 40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 },
  card: { background: '#1a1a2e', border: '1px solid #222', borderRadius: 12, overflow: 'hidden', transition: 'transform 0.15s', cursor: 'pointer' },
  imgWrap: { position: 'relative', overflow: 'hidden' },
  img: { width: '100%', height: 180, objectFit: 'cover', display: 'block' },
  overlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', padding: 8 },
  overlayBtn: { padding: '7px 12px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500 },
  selectCheck: { position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 4px' },
  cardInfo: { padding: 12 },
  cardTitle: { color: '#fff', fontSize: 13, margin: '0 0 8px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  badge: { background: 'rgba(108,99,255,0.2)', color: '#6c63ff', fontSize: 11, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(108,99,255,0.3)' },
  listTable: { background: '#111127', borderRadius: 12, overflow: 'hidden', border: '1px solid #222' },
  listHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#1a1a2e', color: '#555', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' },
  listRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderTop: '1px solid #1a1a2e', transition: 'background 0.15s' },
  rowBtn: { padding: '6px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid #333', borderRadius: 6, color: '#aaa', cursor: 'pointer', fontSize: 13 },
  modalBg: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  modal: { background: '#111127', border: '1px solid #333', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480 },
  label: { display: 'block', color: '#888', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 6, marginTop: 16 },
  input: { width: '100%', padding: '10px 14px', background: '#0d0d1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
};
