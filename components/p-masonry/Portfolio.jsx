'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
// Filter definitions are shared with the admin panel so the two always match.
import { PINNED_CATEGORIES, buildFilterList, matchesFilter } from '@/common/portfolioFilters';

const ORANGE = '#f05a28';

const isShort = (url) => url && url.includes('/shorts/');

function getYtId(url) {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function hqUrl(url) {
  return url || '';
}

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return (url || '').replace(/^https?:\/\//, '').replace(/\/.*$/, ''); }
}

export default function Portfolio() {
  const [allItems, setAllItems]     = useState([]);
  const [categories, setCategories] = useState(PINNED_CATEGORIES);
  const [active, setActive]         = useState('All');
  const [hovered, setHovered]       = useState(null);
  const [playing, setPlaying]       = useState(null);
  const [animating, setAnimating]   = useState(false);
  const [loaded, setLoaded]         = useState(false);
  const [lightIdx, setLightIdx]     = useState(null);

  // Single fetch, reused for the initial load and every live refresh.
  const fetchItems = useCallback(async (signal) => {
    try {
      let q = supabase
        .from('portfolio_items')
        .select('id,title,category,image_url,thumbnail_url,video_url,website_url,file_size')
        .order('created_at', { ascending: false });
      if (signal) q = q.abortSignal(signal);
      const { data, error } = await q;
      if (error || !data) return;
      const valid = data.filter(i =>
        (i.image_url && i.image_url.startsWith('http')) ||
        (i.thumbnail_url && i.thumbnail_url.startsWith('http')) ||
        i.video_url || i.website_url
      );
      setAllItems(valid);
      const found = [...new Set(valid.map(i => i.category).filter(Boolean))];
      const pinned = PINNED_CATEGORIES.filter(c => !found.includes(c));
      setCategories([...found, ...pinned]);
    } catch { /* aborted or offline — keep what we have */ }
  }, []);

  // Initial load
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetchItems(controller.signal).finally(() => {
      clearTimeout(timeout);
      setLoaded(true);
    });
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [fetchItems]);

  // Live updates: refresh whenever the admin changes portfolio_items.
  // Falls back to refetching when the tab regains focus, so this still works
  // even if Realtime replication isn't enabled on the table.
  useEffect(() => {
    const channel = supabase
      .channel('portfolio_items_live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_items' }, () => {
        fetchItems();
      })
      .subscribe();

    const onFocus = () => { if (document.visibilityState === 'visible') fetchItems(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [fetchItems]);

  const handleFilter = useCallback((cat) => {
    if (cat === active) return;
    setAnimating(true);
    setTimeout(() => { setActive(cat); setAnimating(false); }, 200);
  }, [active]);

  // Websites only appear under their own category filter, never in "All".
  const filtered = active === 'All'
    ? allItems.filter(i => !i.website_url)
    : allItems.filter(i => matchesFilter(i, active));
  const allCats  = ['All', ...buildFilterList(categories)];

  const closeLb = useCallback(() => setLightIdx(null), []);
  const stepLb  = useCallback((dir) => {
    setLightIdx(i => (i === null ? i : (i + dir + filtered.length) % filtered.length));
  }, [filtered.length]);

  // Lightbox: keyboard nav + lock background scroll while open
  useEffect(() => {
    if (lightIdx === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape')     closeLb();
      if (e.key === 'ArrowRight') stepLb(1);
      if (e.key === 'ArrowLeft')  stepLb(-1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightIdx, closeLb, stepLb]);

  // Close the lightbox if the filter changes underneath it
  useEffect(() => { setLightIdx(null); }, [active]);

  return (
    <section style={S.section}>

      {/* ── Header ── */}
      <div style={S.header}>
        <div>
          <span style={S.eyebrow}>✦ OUR PORTFOLIO</span>
          <h2 style={S.heading}>
            Selected <span style={S.outline}>Works</span>
          </h2>
          <p style={S.sub}>A curated selection of projects across branding, web, UI/UX &amp; digital marketing.</p>
        </div>
        <div style={S.stats}>
          {[
            { n: `${allItems.length}+`, l: 'Projects' },
            { n: `${categories.length || 6}`, l: 'Categories' },
            { n: '5★', l: 'Rated' },
          ].map((s, i) => (
            <React.Fragment key={s.l}>
              {i > 0 && <div style={S.statDiv} />}
              <div style={S.statItem}>
                <span style={S.statN}>{s.n}</span>
                <span style={S.statL}>{s.l}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div style={S.filterWrap}>
        <div style={S.filterRow}>
          {allCats.map(cat => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              style={{ ...S.filterBtn, ...(active === cat ? S.filterActive : {}) }}
            >
              {active === cat && <span style={S.dot} />}
              {cat}
              {active === cat && <span style={S.count}>{filtered.length}</span>}
            </button>
          ))}
        </div>
        <span style={S.total}>{filtered.length} / {allItems.length} projects</span>
      </div>

      {/* ── Pinterest Masonry ── */}
      <div style={S.gridWrap}>
        {!loaded && (
          <div style={S.centerBox}>
            <div style={S.spinner} />
            <p style={{ color: '#555', marginTop: 16 }}>Loading portfolio...</p>
          </div>
        )}
        {loaded && filtered.length === 0 && (
          <div style={S.centerBox}>
            <p style={{ color: '#555', fontSize: 15 }}>No projects in this category yet.</p>
          </div>
        )}

        <div
          className="pin-grid"
          style={{
            columnCount: 4,
            columnGap: 16,
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
        >
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="pin-item"
              style={{ animationDelay: `${(idx % 16) * 40}ms` }}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                style={{ ...S.pinInner, cursor: playing === item.id ? 'default' : (item.website_url ? 'pointer' : 'zoom-in') }}
                onClick={() => {
                  if (playing === item.id) return;
                  if (item.website_url) window.open(item.website_url, '_blank', 'noopener,noreferrer');
                  else setLightIdx(idx);
                }}
                title={item.website_url ? `Open ${item.website_url} in a new tab` : undefined}
              >
                {/* ── Website: link card (no screenshot) ── */}
                {item.website_url ? (
                  <div style={S.webCard}>
                    <div style={S.webIcon}>🌐</div>
                    <div style={S.webTitle}>{item.title || hostOf(item.website_url)}</div>
                    <div style={S.webHost}>{hostOf(item.website_url)}</div>
                    {item.category && <span style={S.webCatPill}>{item.category}</span>}
                    <span style={S.webBtn}>
                      Visit Website
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 6 }}>
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </span>
                  </div>
                ) : playing === item.id && item.video_url ? (() => {
                  const ytId   = getYtId(item.video_url);
                  const short  = isShort(item.video_url);
                  return (
                    <div style={{ position: 'relative' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                        style={{
                          width: '100%',
                          aspectRatio: short ? '9/16' : '16/9',
                          border: 'none', display: 'block', borderRadius: 14,
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); setPlaying(null); }}
                        style={S.closeBtn}
                      >✕</button>
                    </div>
                  );
                })() : (
                  <>
                    <img
                      src={hqUrl(item.image_url || item.thumbnail_url)}
                      alt={item.title || item.category || 'Portfolio'}
                      style={isShort(item.video_url) ? S.pinImgShort : S.pinImg}
                      onError={e => {
                        const ytId = getYtId(item.video_url);
                        if (ytId) {
                          e.target.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                        } else {
                          e.target.closest('.pin-item').style.display = 'none';
                        }
                      }}
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Video badge */}
                    {item.video_url && (
                      <div style={S.videoBadge}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        VIDEO
                      </div>
                    )}

                    {/* Website badge */}
                    {item.website_url && !item.video_url && (
                      <div style={S.webBadge}>🌐 WEBSITE</div>
                    )}

                    {/* Hover overlay */}
                    <div style={{ ...S.overlay, opacity: hovered === item.id ? 1 : 0 }}>
                      {item.category && <span style={S.catPill}>{item.category}</span>}
                      <div style={S.overlayCenter}>
                        {item.video_url ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); setPlaying(item.id); }}
                            style={S.actionCircle}
                            title="Play video"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={ORANGE}>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
                        ) : (
                          <div style={S.actionCircle} title={item.website_url ? 'Open website' : undefined}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                              stroke={ORANGE} strokeWidth="2.5">
                              <path d="M7 17L17 7M17 7H7M17 7v10" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {item.file_size && (
                        <span style={S.sizePill}>
                          {item.file_size > 1048576
                            ? (item.file_size / 1048576).toFixed(1) + ' MB'
                            : Math.round(item.file_size / 1024) + ' KB'}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>


      <style>{`
        .pin-item {
          break-inside: avoid;
          display: inline-block;
          width: 100%;
          margin-bottom: 16px;
          border-radius: 14px;
          overflow: hidden;
          animation: pinUp 0.5s ease both;
          cursor: pointer;
        }
        .pin-item:hover { transform: translateY(-3px); transition: transform 0.25s; }
        @media (max-width: 1100px) { .pin-grid { column-count: 3 !important; } }
        @media (max-width: 768px)  { .pin-grid { column-count: 2 !important; } }
        @media (max-width: 480px)  { .pin-grid { column-count: 1 !important; } }
        @keyframes pinUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes lbFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lbZoom { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
        .lb-backdrop { animation: lbFade 0.2s ease both; }
        .lb-content  { animation: lbZoom 0.25s cubic-bezier(0.22,1,0.36,1) both; }
        .lb-btn:hover { background: rgba(255,255,255,0.22) !important; }
        @media (max-width: 640px) {
          .lb-nav { width: 40px !important; height: 40px !important; font-size: 22px !important; }
        }
      `}</style>

      {/* ── Lightbox (portaled to <body> so it escapes any transformed ancestor) ── */}
      {lightIdx !== null && filtered[lightIdx] && typeof document !== 'undefined' && (() => {
        const item  = filtered[lightIdx];
        const ytId  = getYtId(item.video_url);
        const short = isShort(item.video_url);
        const src   = item.image_url || item.thumbnail_url ||
                      (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : '');
        return createPortal(
          <div style={S.lbBackdrop} className="lb-backdrop" onClick={closeLb} role="dialog" aria-modal="true">
            <button style={S.lbClose} className="lb-btn" onClick={closeLb} aria-label="Close">✕</button>

            {filtered.length > 1 && (
              <>
                <button
                  style={{ ...S.lbNav, left: 24 }} className="lb-btn lb-nav" aria-label="Previous"
                  onClick={(e) => { e.stopPropagation(); stepLb(-1); }}
                >‹</button>
                <button
                  style={{ ...S.lbNav, right: 24 }} className="lb-btn lb-nav" aria-label="Next"
                  onClick={(e) => { e.stopPropagation(); stepLb(1); }}
                >›</button>
              </>
            )}

            <div style={S.lbContent} className="lb-content" onClick={(e) => e.stopPropagation()}>
              {ytId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                  style={{
                    border: 'none', borderRadius: 10, display: 'block', background: '#000',
                    width: short ? 'min(86vw, 420px)' : 'min(92vw, 1100px)',
                    aspectRatio: short ? '9/16' : '16/9',
                    maxHeight: '82vh',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img src={src} alt={item.title || item.category || 'Portfolio'} style={S.lbImg} className="no-anim" />
              )}

              <div style={S.lbBar}>
                <div style={{ minWidth: 0 }}>
                  {item.category && <span style={S.lbCat}>{item.category}</span>}
                  {item.title && <span style={S.lbTitle}>{item.title}</span>}
                </div>
                <span style={S.lbCount}>{lightIdx + 1} / {filtered.length}</span>
              </div>
            </div>
          </div>,
          document.body
        );
      })()}
    </section>
  );
}

const S = {
  section: {
    background: '#0a0a0a',
    padding: '100px 0 80px',
    minHeight: '100vh',
    fontFamily: 'inherit',
  },

  /* Lightbox */
  lbBackdrop: {
    position: 'fixed', inset: 0, zIndex: 99999,
    background: 'rgba(6,6,8,0.94)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24,
  },
  lbContent: {
    position: 'relative', maxWidth: '92vw', maxHeight: '90vh',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
  },
  lbImg: {
    display: 'block', maxWidth: '92vw', maxHeight: '80vh',
    width: 'auto', height: 'auto', objectFit: 'contain',
    borderRadius: 10, boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
  },
  lbClose: {
    position: 'absolute', top: 20, right: 24, zIndex: 2,
    width: 44, height: 44, borderRadius: '50%',
    background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff', fontSize: 18, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.2s',
  },
  lbNav: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 2,
    width: 52, height: 52, borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
    color: '#fff', fontSize: 30, lineHeight: 1, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    paddingBottom: 4, transition: 'background 0.2s',
  },
  lbBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 16, width: '100%', maxWidth: 1100,
  },
  lbCat: {
    display: 'inline-block', padding: '4px 12px', borderRadius: 20,
    background: ORANGE, color: '#fff', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 10,
  },
  lbTitle: { color: '#ddd', fontSize: 13 },
  lbCount: { color: '#888', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' },

  /* Header */
  header: {
    maxWidth: 1400, margin: '0 auto 48px', padding: '0 48px',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-end', gap: 40, flexWrap: 'wrap',
  },
  eyebrow: {
    display: 'block', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.22em', color: ORANGE, marginBottom: 14,
    textTransform: 'uppercase',
  },
  heading: {
    fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 800,
    color: '#fff', lineHeight: 1.0, margin: '0 0 16px',
    letterSpacing: '-0.02em',
  },
  outline: { WebkitTextStroke: `2px ${ORANGE}`, color: 'transparent' },
  sub: { color: '#555', fontSize: 15, lineHeight: 1.7, maxWidth: 420, margin: 0 },

  /* Stats */
  stats: {
    display: 'flex', alignItems: 'center', gap: 28,
    background: '#111', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 20, padding: '20px 30px', flexShrink: 0,
  },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  statN: { color: '#fff', fontSize: 26, fontWeight: 800, lineHeight: 1 },
  statL: { color: '#444', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' },
  statDiv: { width: 1, height: 36, background: 'rgba(255,255,255,0.07)' },

  /* Filter */
  filterWrap: {
    maxWidth: 1400, margin: '0 auto 36px', padding: '20px 48px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 12,
    borderTop: '1px solid rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  filterRow: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  filterBtn: {
    padding: '9px 20px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 50, color: '#666', cursor: 'pointer',
    fontSize: 13, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: 7,
    transition: 'all 0.18s', letterSpacing: '0.03em',
  },
  filterActive: {
    background: ORANGE, borderColor: ORANGE, color: '#fff',
    boxShadow: `0 4px 20px ${ORANGE}55`,
  },
  dot:   { width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', flexShrink: 0 },
  count: { background: 'rgba(255,255,255,0.25)', borderRadius: 50, fontSize: 10, fontWeight: 700, padding: '1px 6px', lineHeight: 1.6 },
  total: { color: '#333', fontSize: 12, letterSpacing: '0.06em', whiteSpace: 'nowrap' },

  /* Grid */
  gridWrap: { maxWidth: 1400, margin: '0 auto', padding: '0 48px' },
  centerBox: { textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  spinner:   { width: 36, height: 36, border: '3px solid #222', borderTopColor: ORANGE, borderRadius: '50%', animation: 'spin 0.8s linear infinite' },

  /* Pin card */
  pinInner: { position: 'relative', borderRadius: 14, overflow: 'hidden' },
  pinImg: {
    width: '100%', height: 'auto', display: 'block', borderRadius: 14,
    imageRendering: '-webkit-optimize-contrast',
  },
  pinImgShort: {
    width: '100%', aspectRatio: '9/16', display: 'block', borderRadius: 14,
    objectFit: 'cover', objectPosition: 'center top',
    imageRendering: '-webkit-optimize-contrast',
  },

  /* Overlay */
  overlay: {
    position: 'absolute', inset: 0, borderRadius: 14,
    background: 'rgba(0,0,0,0.55)',
    transition: 'opacity 0.22s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  overlayCenter: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  actionCircle: {
    width: 52, height: 52, borderRadius: '50%',
    background: 'rgba(255,255,255,0.95)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textDecoration: 'none', border: 'none', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  },
  closeBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 30, height: 30, borderRadius: '50%',
    background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff', fontSize: 14, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 10,
  },
  webBadge: {
    position: 'absolute', top: 10, right: 10,
    background: 'rgba(22,163,74,0.92)', backdropFilter: 'blur(6px)',
    color: '#fff', fontSize: 9, fontWeight: 800,
    letterSpacing: '0.1em',
    padding: '4px 8px', borderRadius: 20,
    display: 'flex', alignItems: 'center', gap: 4,
    zIndex: 2,
  },
  webCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
    gap: 8, padding: '38px 24px',
    background: 'linear-gradient(160deg, #15151f 0%, #0e1b14 100%)',
    border: '1px solid rgba(34,197,94,0.25)', borderRadius: 14,
    minHeight: 200, justifyContent: 'center',
  },
  webIcon: {
    width: 54, height: 54, borderRadius: 16,
    background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 26, marginBottom: 4,
  },
  webTitle: { color: '#fff', fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em' },
  webHost: { color: '#7ee2a8', fontSize: 12, wordBreak: 'break-all' },
  webCatPill: {
    marginTop: 4, padding: '3px 10px', borderRadius: 20,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#aaa', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
  },
  webBtn: {
    marginTop: 12, display: 'inline-flex', alignItems: 'center',
    padding: '9px 20px', borderRadius: 30,
    background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: '#fff',
    fontSize: 12.5, fontWeight: 700,
  },
  videoBadge: {
    position: 'absolute', top: 10, right: 10,
    background: 'rgba(240,90,40,0.92)', backdropFilter: 'blur(6px)',
    color: '#fff', fontSize: 9, fontWeight: 800,
    letterSpacing: '0.1em',
    padding: '4px 8px', borderRadius: 20,
    display: 'flex', alignItems: 'center', gap: 4,
    zIndex: 2,
  },
  catPill: {
    position: 'absolute', top: 12, left: 12,
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
    color: '#fff', fontSize: 10, fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '4px 10px', borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.15)',
  },
  sizePill: {
    position: 'absolute', bottom: 12, right: 12,
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
    color: '#aaa', fontSize: 10, fontWeight: 600,
    padding: '3px 9px', borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.1)',
  },

  /* CTA */
  cta: {
    maxWidth: 1400, margin: '60px auto 0', padding: '0 48px',
    display: 'flex', alignItems: 'center', gap: 24,
  },
  ctaLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center',
    padding: '15px 34px', background: ORANGE, borderRadius: 50,
    color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700,
    letterSpacing: '0.03em', whiteSpace: 'nowrap',
    boxShadow: `0 8px 30px ${ORANGE}44`,
  },
};
