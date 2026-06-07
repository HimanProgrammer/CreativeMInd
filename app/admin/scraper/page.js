'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

export default function ScraperPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('web'); // 'web' | 'behance'

  // Web scraper state
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle');
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [folder, setFolder] = useState('');
  const [savingToPortfolio, setSavingToPortfolio] = useState(false);
  const [portfolioCategory, setPortfolioCategory] = useState('General');
  const [saveMsg, setSaveMsg] = useState('');
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  // Behance state
  const [bUsername, setBUsername] = useState('');
  const [bApiKey, setBApiKey] = useState('');
  const [bStatus, setBStatus] = useState('idle');
  const [bImages, setBImages] = useState([]);
  const [bSelected, setBSelected] = useState(new Set());
  const [bError, setBError] = useState('');
  const [bFolder, setBFolder] = useState('');
  const [bSaving, setBSaving] = useState(false);
  const [bSaveMsg, setBSaveMsg] = useState('');
  const [bCategory, setBCategory] = useState('Design');
  const [bLogs, setBLogs] = useState([]);
  const logEndRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/admin/login'); return; }
    // Load history from localStorage
    const h = JSON.parse(localStorage.getItem('scrape_history') || '[]');
    setHistory(h);
  }, [user, authLoading]);

  async function handleScrape(e) {
    e.preventDefault();
    if (!url.trim()) return;
    setStatus('loading');
    setImages([]);
    setSelected(new Set());
    setError('');
    setSaveMsg('');

    const ts = Date.now().toString();
    setFolder(ts);
    setProgress('Fetching page...');

    try {
      const res = await fetch('/api/scrape-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), folder: ts }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Scrape failed');
        setStatus('error');
        return;
      }
      setImages(data.images || []);
      setFolder(data.folder);
      setStatus('done');

      // Auto-select all
      setSelected(new Set((data.images || []).map((_, i) => i)));

      // Save to history
      const entry = { url: url.trim(), count: data.total, folder: data.folder, date: new Date().toLocaleString() };
      const newHistory = [entry, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('scrape_history', JSON.stringify(newHistory));
    } catch (err) {
      setError(err.message || 'Network error');
      setStatus('error');
    }
  }

  function toggleSelect(i) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function selectAll() { setSelected(new Set(images.map((_, i) => i))); }
  function deselectAll() { setSelected(new Set()); }

  async function handleSaveToPortfolio() {
    const toSave = images.filter((_, i) => selected.has(i));
    if (toSave.length === 0) return;
    setSavingToPortfolio(true);
    setSaveMsg('');

    // Fetch existing filenames to skip duplicates
    const { data: existing } = await supabase.from('portfolio_items').select('file_name');
    const existingNames = new Set((existing || []).map(e => e.file_name?.replace(/^\d+_/, '').toLowerCase()));

    const rows = toSave
      .filter(img => !existingNames.has(img.filename.replace(/^\d+_/, '').toLowerCase()))
      .map((img) => ({
        title: img.filename.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
        category: portfolioCategory,
        image_url: `${window.location.origin}${img.url}`,
        thumbnail_url: `${window.location.origin}${img.url}`,
        file_name: img.filename,
        file_size: img.size * 1024,
      }));

    if (rows.length === 0) {
      setSavingToPortfolio(false);
      setSaveMsg('⚠️ All selected images already exist in Portfolio (duplicates skipped).');
      return;
    }

    const skipped = toSave.length - rows.length;
    const { error } = await supabase.from('portfolio_items').insert(rows);
    setSavingToPortfolio(false);
    if (error) {
      if (error.message?.includes('schema cache') || error.message?.includes('relation') || error.code === 'PGRST106' || error.code === '42P01') {
        setSaveMsg('⚠️ Table not found — run the SQL setup in Supabase first. Go to Admin Portfolio page to see the setup guide.');
      } else {
        setSaveMsg(`Error: ${error.message}`);
      }
    } else {
      setSaveMsg(`✓ ${rows.length} image${rows.length > 1 ? 's' : ''} saved to Portfolio!${skipped > 0 ? ` (${skipped} duplicate${skipped > 1 ? 's' : ''} skipped)` : ''}`);
    }
  }

  function handleDownloadSelected() {
    images.filter((_, i) => selected.has(i)).forEach((img) => {
      const a = document.createElement('a');
      a.href = img.url;
      a.download = img.filename;
      a.click();
    });
  }

  async function handleLogout() { await logout(); router.push('/admin/login'); }

  // Auto-scroll log panel to bottom
  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [bLogs]);

  // ── Behance handlers ────────────────────────────────────────
  async function handleBehanceFetch(e) {
    e.preventDefault();
    if (!bUsername.trim()) return;
    setBStatus('loading');
    setBImages([]);
    setBSelected(new Set());
    setBError('');
    setBSaveMsg('');
    setBLogs([]);
    const ts = Date.now().toString();
    setBFolder(ts);
    try {
      const res = await fetch('/api/behance-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: bUsername.trim(), apiKey: bApiKey.trim() || undefined, folder: ts }),
      });

      if (!res.body) throw new Error('No response stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete last line
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            if (event.type === 'log') {
              setBLogs(prev => [...prev, { text: event.msg, ts: new Date().toLocaleTimeString() }]);
            } else if (event.type === 'done') {
              setBImages(event.images || []);
              setBFolder(event.folder);
              setBStatus('done');
              setBSelected(new Set((event.images || []).map((_, i) => i)));
            } else if (event.type === 'error') {
              setBError(event.error || 'Failed');
              setBStatus('error');
            }
          } catch { /* malformed line */ }
        }
      }
    } catch (err) {
      setBError(err.message || 'Network error');
      setBStatus('error');
    }
  }

  function bToggle(i) { setBSelected(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; }); }
  function bSelectAll() { setBSelected(new Set(bImages.map((_, i) => i))); }
  function bDeselectAll() { setBSelected(new Set()); }

  async function handleBSaveToPortfolio() {
    const toSave = bImages.filter((_, i) => bSelected.has(i));
    if (!toSave.length) return;
    setBSaving(true); setBSaveMsg('');
    const { data: existing } = await supabase.from('portfolio_items').select('file_name');
    const existingNames = new Set((existing || []).map(e => e.file_name?.replace(/^\d+_/, '').toLowerCase()));
    const rows = toSave
      .filter(img => !existingNames.has(img.filename.replace(/^\d+_/, '').toLowerCase()))
      .map(img => ({
        title: img.title || img.filename.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
        category: bCategory,
        image_url: `${window.location.origin}${img.url}`,
        thumbnail_url: `${window.location.origin}${img.url}`,
        file_name: img.filename,
        file_size: img.size * 1024,
      }));
    if (!rows.length) { setBSaving(false); setBSaveMsg('⚠️ All selected images already exist (duplicates skipped).'); return; }
    const skipped = toSave.length - rows.length;
    const { error } = await supabase.from('portfolio_items').insert(rows);
    setBSaving(false);
    setBSaveMsg(error ? `Error: ${error.message}` : `✓ ${rows.length} image${rows.length > 1 ? 's' : ''} saved!${skipped ? ` (${skipped} duplicates skipped)` : ''}`);
  }

  const selectedImages = images.filter((_, i) => selected.has(i));

  return (
    <div style={s.layout}>
      <AdminSidebar onLogout={handleLogout} userEmail={user?.email} userName={user?.displayName} userPhoto={user?.photoURL} />
      <main style={s.main}>

        {/* Header */}
        <div style={s.topBar}>
          <div>
            <h1 style={s.title}>Image Extractor</h1>
            <p style={s.sub}>Scrape images from any website or your Behance profile</p>
          </div>
          {activeTab === 'web' && images.length > 0 && (
            <div style={s.topStats}>
              <span style={s.statPill}>{images.length} found</span>
              <span style={s.statPillActive}>{selected.size} selected</span>
            </div>
          )}
          {activeTab === 'behance' && bImages.length > 0 && (
            <div style={s.topStats}>
              <span style={s.statPill}>{bImages.length} found</span>
              <span style={s.statPillActive}>{bSelected.size} selected</span>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div style={s.tabs}>
          <button onClick={() => setActiveTab('web')} style={{ ...s.tab, ...(activeTab === 'web' ? s.tabActive : {}) }}>
            🌐 Web Scraper
          </button>
          <button onClick={() => setActiveTab('behance')} style={{ ...s.tab, ...(activeTab === 'behance' ? s.tabActiveBehance : {}) }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.2.247 2.194 2.105 2.194.657 0 1.282-.3 1.394-.829h2.257zM15.97 13h4.908c-.07-1.099-.756-1.756-2.359-1.756-1.665 0-2.35.657-2.549 1.756zM7.337 11.854c0-1.16-.629-1.977-2.183-1.977H3v3.934h2.154c1.554 0 2.183-.797 2.183-1.957zm.629 4.966c0-1.34-.75-2.183-2.53-2.183H3V19h2.436c1.78 0 2.53-.843 2.53-2.18zM0 21V3h7.184c2.456 0 4.065 1.544 4.065 3.93 0 1.48-.584 2.562-1.75 3.273C11.044 10.826 12 12.132 12 14.053 12 16.9 10.13 21 6.817 21H0z"/></svg>
            Behance
          </button>
        </div>

        {/* ── WEB SCRAPER TAB ── */}
        {activeTab === 'web' && <>
        <div style={s.inputCard}>
          <form onSubmit={handleScrape} style={s.inputRow}>
            <div style={s.urlInputWrap}>
              <span style={s.urlIcon}>🌐</span>
              <input
                ref={inputRef}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL — e.g. https://unsplash.com/photos"
                style={s.urlInput}
                disabled={status === 'loading'}
                autoFocus
              />
              {url && <button type="button" onClick={() => setUrl('')} style={s.clearBtn}>✕</button>}
            </div>
            <button type="submit" disabled={status === 'loading' || !url.trim()} style={s.scrapeBtn}>
              {status === 'loading' ? (
                <><span style={s.spinner} /> Extracting...</>
              ) : (
                '🔍 Extract Images'
              )}
            </button>
          </form>

          {/* Progress */}
          {status === 'loading' && (
            <div style={s.progressBar}>
              <div style={s.progressFill} />
            </div>
          )}
          {status === 'loading' && <p style={s.progressText}>{progress}</p>}
          {status === 'error' && <p style={s.errorText}>⚠️ {error}</p>}
        </div>

        {/* History quick-picks */}
        {history.length > 0 && status === 'idle' && (
          <div style={s.historyRow}>
            <span style={s.historyLabel}>Recent:</span>
            {history.slice(0, 5).map((h, i) => (
              <button key={i} onClick={() => setUrl(h.url)} style={s.historyChip}>
                {new URL(h.url.startsWith('http') ? h.url : `https://${h.url}`).hostname}
                <span style={s.historyCount}>{h.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {status === 'done' && (
          <>
            {images.length === 0 ? (
              <div style={s.empty}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
                <p style={{ color: '#555' }}>No images found on this page.</p>
                <p style={{ color: '#444', fontSize: 12 }}>Try a different URL or a page with visible images.</p>
              </div>
            ) : (
              <>
                {/* Toolbar */}
                <div style={s.toolbar}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={selectAll} style={s.toolBtn}>Select All</button>
                    <button onClick={deselectAll} style={s.toolBtn}>Deselect All</button>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select value={portfolioCategory} onChange={(e) => setPortfolioCategory(e.target.value)} style={s.catSelect}>
                      {['General', 'Design', 'Development', 'Marketing', 'Branding', 'Photography'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleSaveToPortfolio}
                      disabled={selected.size === 0 || savingToPortfolio}
                      style={{ ...s.actionBtn, background: 'linear-gradient(135deg,#6c63ff,#e040fb)', opacity: selected.size === 0 ? 0.5 : 1 }}>
                      {savingToPortfolio ? 'Saving...' : `📁 Save to Portfolio (${selected.size})`}
                    </button>
                    <button
                      onClick={handleDownloadSelected}
                      disabled={selected.size === 0}
                      style={{ ...s.actionBtn, background: 'rgba(0,191,165,0.15)', border: '1px solid rgba(0,191,165,0.3)', color: '#00bfa5', opacity: selected.size === 0 ? 0.5 : 1 }}>
                      ⬇ Download ({selected.size})
                    </button>
                  </div>
                </div>

                {saveMsg && (
                  <div style={{ ...s.saveMsg, color: saveMsg.startsWith('Error') ? '#ff6b6b' : '#10b981', background: saveMsg.startsWith('Error') ? 'rgba(255,107,107,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${saveMsg.startsWith('Error') ? 'rgba(255,107,107,0.2)' : 'rgba(16,185,129,0.2)'}` }}>
                    {saveMsg}
                  </div>
                )}

                {/* Image Grid */}
                <div style={s.grid}>
                  {images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => toggleSelect(i)}
                      style={{ ...s.card, ...(selected.has(i) ? s.cardSelected : {}) }}
                    >
                      {/* Checkbox */}
                      <div style={{ ...s.checkbox, ...(selected.has(i) ? s.checkboxChecked : {}) }}>
                        {selected.has(i) && '✓'}
                      </div>

                      {/* Image */}
                      <div style={s.imgWrap}>
                        <img
                          src={img.url}
                          alt={img.filename}
                          style={s.img}
                          loading="lazy"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                        <div style={{ ...s.imgError, display: 'none' }}>
                          <span>⚠️</span>
                          <span style={{ fontSize: 10, color: '#555' }}>Load error</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div style={s.cardInfo}>
                        <div style={s.cardName} title={img.filename}>{img.filename.slice(0, 22)}{img.filename.length > 22 ? '…' : ''}</div>
                        <div style={s.cardMeta}>{img.size} KB</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Local path info */}
                <div style={s.pathInfo}>
                  <span style={{ color: '#444', fontSize: 12 }}>📁 Saved locally at:</span>
                  <code style={s.pathCode}>public{folder}/</code>
                </div>
              </>
            )}
          </>
        )}
        </>}

        {/* ── BEHANCE TAB ── */}
        {activeTab === 'behance' && (
          <>
            {/* Behance Input Card */}
            <div style={s.inputCard}>
              <form onSubmit={handleBehanceFetch} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={s.inputRow}>
                  <div style={s.urlInputWrap}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1769ff" style={{ flexShrink: 0 }}><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.2.247 2.194 2.105 2.194.657 0 1.282-.3 1.394-.829h2.257zM15.97 13h4.908c-.07-1.099-.756-1.756-2.359-1.756-1.665 0-2.35.657-2.549 1.756zM7.337 11.854c0-1.16-.629-1.977-2.183-1.977H3v3.934h2.154c1.554 0 2.183-.797 2.183-1.957zm.629 4.966c0-1.34-.75-2.183-2.53-2.183H3V19h2.436c1.78 0 2.53-.843 2.53-2.18zM0 21V3h7.184c2.456 0 4.065 1.544 4.065 3.93 0 1.48-.584 2.562-1.75 3.273C11.044 10.826 12 12.132 12 14.053 12 16.9 10.13 21 6.817 21H0z"/></svg>
                    <input
                      value={bUsername}
                      onChange={(e) => setBUsername(e.target.value)}
                      placeholder="Public gallery URL — e.g. behance.net/gallery/217395233/Project-Title"
                      style={s.urlInput}
                      disabled={bStatus === 'loading'}
                      autoFocus
                    />
                    {bUsername && <button type="button" onClick={() => setBUsername('')} style={s.clearBtn}>✕</button>}
                  </div>
                  <button type="submit" disabled={bStatus === 'loading' || !bUsername.trim()} style={{ ...s.scrapeBtn, background: 'linear-gradient(135deg,#1769ff,#0050d0)' }}>
                    {bStatus === 'loading' ? <><span style={s.spinner} /> Fetching...</> : '🎨 Fetch Images'}
                  </button>
                </div>

                {/* Optional API Key row */}
                {/* Editor URL warning */}
                {/portfolio\/editor/i.test(bUsername) && (
                  <div style={{ background: 'rgba(255,180,0,0.1)', border: '1px solid rgba(255,180,0,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#f5c542', lineHeight: 1.6 }}>
                    ⚠️ <strong>Editor URL detected</strong> — this page requires Behance login and cannot be scraped.<br />
                    Use the <strong>public gallery URL</strong> instead:<br />
                    <span style={{ color: '#aaa' }}>https://www.behance.net/gallery/<strong style={{ color: '#fff' }}>217395233</strong>/Your-Project-Title</span>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ ...s.urlInputWrap, flex: 1 }}>
                    <span style={{ ...s.urlIcon, fontSize: 13 }}>🔑</span>
                    <input
                      type="password"
                      value={bApiKey}
                      onChange={(e) => setBApiKey(e.target.value)}
                      placeholder="Behance API key (optional — improves results)"
                      style={{ ...s.urlInput, fontSize: 13 }}
                      disabled={bStatus === 'loading'}
                    />
                  </div>
                  <a href="https://www.behance.net/dev/register" target="_blank" rel="noreferrer" style={{ color: '#1769ff', fontSize: 11, whiteSpace: 'nowrap', textDecoration: 'none', fontWeight: 600 }}>
                    Get API key ↗
                  </a>
                </div>
              </form>

              {bStatus === 'loading' && (
                <div style={s.progressBar}>
                  <div style={{ ...s.progressFill, background: 'linear-gradient(90deg,#1769ff,#0050d0)' }} />
                </div>
              )}
              {bStatus === 'error' && <p style={s.errorText}>⚠️ {bError}</p>}
            </div>

            {/* Live Log Panel */}
            {(bStatus === 'loading' || (bStatus === 'done' && bLogs.length > 0) || (bStatus === 'error' && bLogs.length > 0)) && (
              <div style={s.logPanel}>
                <div style={s.logHeader}>
                  <span style={s.logTitle}>
                    {bStatus === 'loading' ? <><span style={s.logDot} /> Live Log</> : '📋 Extraction Log'}
                  </span>
                  <span style={{ color: '#444', fontSize: 11 }}>{bLogs.length} line{bLogs.length !== 1 ? 's' : ''}</span>
                </div>
                <div style={s.logBody}>
                  {bLogs.map((entry, i) => (
                    <div key={i} style={s.logLine}>
                      <span style={s.logTs}>{entry.ts}</span>
                      <span style={{
                        ...s.logText,
                        color: entry.text.startsWith('  ✓') ? '#10b981'
                          : entry.text.startsWith('  ✗') ? '#f87171'
                          : entry.text.startsWith('Done!') ? '#34d399'
                          : entry.text.includes('Error') ? '#f87171'
                          : '#c9d1d9',
                      }}>{entry.text}</span>
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </div>
            )}

            {/* Behance Results */}
            {bStatus === 'done' && (
              bImages.length === 0 ? (
                <div style={s.empty}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🎨</div>
                  <p style={{ color: '#555' }}>No images found.</p>
                  <p style={{ color: '#444', fontSize: 12 }}>
                    • Use the <strong style={{ color: '#888' }}>public gallery URL</strong>: behance.net/gallery/ID/title<br />
                    • Avoid editor URLs (/portfolio/editor) — they require login<br />
                    • Add a Behance API key for best results
                  </p>
                </div>
              ) : (
                <>
                  <div style={s.toolbar}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={bSelectAll} style={s.toolBtn}>Select All</button>
                      <button onClick={bDeselectAll} style={s.toolBtn}>Deselect All</button>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <select value={bCategory} onChange={(e) => setBCategory(e.target.value)} style={s.catSelect}>
                        {['Design', 'Branding', 'UI/UX', 'Photography', 'Illustration', 'Marketing', 'General'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <button
                        onClick={handleBSaveToPortfolio}
                        disabled={bSelected.size === 0 || bSaving}
                        style={{ ...s.actionBtn, background: 'linear-gradient(135deg,#1769ff,#0050d0)', opacity: bSelected.size === 0 ? 0.5 : 1 }}>
                        {bSaving ? 'Saving...' : `📁 Save to Portfolio (${bSelected.size})`}
                      </button>
                    </div>
                  </div>

                  {bSaveMsg && (
                    <div style={{ ...s.saveMsg, color: bSaveMsg.startsWith('Error') ? '#ff6b6b' : '#10b981', background: bSaveMsg.startsWith('Error') ? 'rgba(255,107,107,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${bSaveMsg.startsWith('Error') ? 'rgba(255,107,107,0.2)' : 'rgba(16,185,129,0.2)'}` }}>
                      {bSaveMsg}
                    </div>
                  )}

                  <div style={s.grid}>
                    {bImages.map((img, i) => (
                      <div key={i} onClick={() => bToggle(i)} style={{ ...s.card, ...(bSelected.has(i) ? s.cardSelected : {}) }}>
                        <div style={{ ...s.checkbox, ...(bSelected.has(i) ? s.checkboxChecked : {}) }}>
                          {bSelected.has(i) && '✓'}
                        </div>
                        <div style={s.imgWrap}>
                          <img src={img.url} alt={img.filename} style={s.img} loading="lazy"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                          <div style={{ ...s.imgError, display: 'none' }}>
                            <span>⚠️</span>
                            <span style={{ fontSize: 10, color: '#555' }}>Load error</span>
                          </div>
                        </div>
                        <div style={s.cardInfo}>
                          <div style={s.cardName} title={img.title || img.filename}>{(img.title || img.filename || '').slice(0, 22)}…</div>
                          <div style={s.cardMeta}>{img.size} KB</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={s.pathInfo}>
                    <span style={{ color: '#444', fontSize: 12 }}>📁 Saved locally at:</span>
                    <code style={s.pathCode}>public{bFolder}/</code>
                  </div>
                </>
              )
            )}
          </>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes progressAnim { 0% { width: 5%; } 50% { width: 70%; } 90% { width: 90%; } 100% { width: 95%; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .log-body::-webkit-scrollbar { width: 4px; }
        .log-body::-webkit-scrollbar-track { background: transparent; }
        .log-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
}

const s = {
  layout: { display: 'flex', minHeight: '100vh', background: '#0a0a18', fontFamily: 'Inter, system-ui, sans-serif' },
  tabs: { display: 'flex', gap: 8, marginBottom: 20 },
  tab: { display: 'flex', alignItems: 'center', padding: '9px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#666', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s' },
  tabActive: { background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#a78bfa' },
  tabActiveBehance: { background: 'rgba(23,105,255,0.15)', border: '1px solid rgba(23,105,255,0.35)', color: '#5b9dff' },
  main: { marginLeft: 250, flex: 1, padding: '32px 36px', minHeight: '100vh' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  title: { color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' },
  sub: { color: '#555', fontSize: 13, margin: 0 },
  topStats: { display: 'flex', gap: 8, alignItems: 'center' },
  statPill: { padding: '5px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, color: '#aaa', fontSize: 12, fontWeight: 600 },
  statPillActive: { padding: '5px 12px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 20, color: '#a78bfa', fontSize: 12, fontWeight: 600 },

  inputCard: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px', marginBottom: 20 },
  inputRow: { display: 'flex', gap: 12 },
  urlInputWrap: { flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '0 14px', gap: 10 },
  urlIcon: { fontSize: 16, flexShrink: 0 },
  urlInput: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, padding: '13px 0', fontFamily: 'inherit' },
  clearBtn: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14, padding: '4px', flexShrink: 0 },
  scrapeBtn: { padding: '12px 28px', background: 'linear-gradient(135deg,#6c63ff,#e040fb)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(108,99,255,0.35)', whiteSpace: 'nowrap' },
  progressBar: { height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 3, marginTop: 16, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#6c63ff,#e040fb)', borderRadius: 3, animation: 'progressAnim 8s ease-out forwards' },
  progressText: { color: '#555', fontSize: 12, marginTop: 8, marginBottom: 0 },
  errorText: { color: '#ff6b6b', fontSize: 13, marginTop: 12, marginBottom: 0, padding: '8px 12px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.15)', borderRadius: 8 },

  historyRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  historyLabel: { color: '#444', fontSize: 12, fontWeight: 600 },
  historyChip: { padding: '5px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, color: '#888', cursor: 'pointer', fontSize: 11, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 },
  historyCount: { background: 'rgba(108,99,255,0.2)', color: '#a78bfa', fontSize: 10, padding: '1px 5px', borderRadius: 8 },

  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 },
  toolBtn: { padding: '7px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  catSelect: { padding: '7px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12, outline: 'none', cursor: 'pointer' },
  actionBtn: { padding: '8px 16px', border: 'none', borderRadius: 9, color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 },
  saveMsg: { padding: '10px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600, marginBottom: 16 },

  empty: { textAlign: 'center', padding: '80px 0' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 },
  card: { background: 'rgba(255,255,255,0.02)', border: '2px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', position: 'relative', transition: 'all 0.15s', userSelect: 'none' },
  cardSelected: { border: '2px solid #6c63ff', boxShadow: '0 0 0 1px rgba(108,99,255,0.3)', background: 'rgba(108,99,255,0.05)' },
  checkbox: { position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 6, background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 700, zIndex: 2, backdropFilter: 'blur(4px)' },
  checkboxChecked: { background: 'linear-gradient(135deg,#6c63ff,#e040fb)', border: '2px solid transparent' },
  imgWrap: { width: '100%', height: 140, background: '#111', overflow: 'hidden', position: 'relative' },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.2s' },
  imgError: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4, background: 'rgba(255,255,255,0.03)' },
  cardInfo: { padding: '10px 12px' },
  cardName: { color: '#ccc', fontSize: 11, fontWeight: 500, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardMeta: { color: '#444', fontSize: 10 },

  pathInfo: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, padding: '10px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 9 },
  pathCode: { color: '#6c63ff', fontSize: 12, fontFamily: 'monospace', background: 'rgba(108,99,255,0.1)', padding: '3px 8px', borderRadius: 5 },
  spinner: { display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' },

  // Log panel
  logPanel: { background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, marginBottom: 20, overflow: 'hidden' },
  logHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' },
  logTitle: { color: '#e6edf3', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'monospace' },
  logDot: { display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse 1s ease-in-out infinite' },
  logBody: { padding: '10px 0', maxHeight: 280, overflowY: 'auto', fontFamily: 'monospace', fontSize: 12 },
  logLine: { display: 'flex', gap: 12, padding: '2px 16px', alignItems: 'flex-start' },
  logTs: { color: '#484f58', fontSize: 10, flexShrink: 0, paddingTop: 1, minWidth: 70 },
  logText: { color: '#c9d1d9', lineHeight: 1.5, wordBreak: 'break-all' },
};
