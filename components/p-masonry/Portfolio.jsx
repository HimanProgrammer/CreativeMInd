'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

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

export default function Portfolio() {
  const [allItems, setAllItems]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive]         = useState('All');
  const [hovered, setHovered]       = useState(null);
  const [playing, setPlaying]       = useState(null);
  const [animating, setAnimating]   = useState(false);
  const [loaded, setLoaded]         = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    (async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('id,title,category,image_url,thumbnail_url,video_url,file_size')
          .order('created_at', { ascending: false })
          .abortSignal(controller.signal);
        clearTimeout(timeout);
        if (!error && data?.length) {
          const valid = data.filter(i =>
            (i.image_url && i.image_url.startsWith('http')) ||
            (i.thumbnail_url && i.thumbnail_url.startsWith('http')) ||
            i.video_url
          );
          setAllItems(valid);
          setCategories([...new Set(valid.map(i => i.category).filter(Boolean))]);
        }
      } catch { clearTimeout(timeout); }
      finally { setLoaded(true); }
    })();
    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  const handleFilter = useCallback((cat) => {
    if (cat === active) return;
    setAnimating(true);
    setTimeout(() => { setActive(cat); setAnimating(false); }, 200);
  }, [active]);

  const filtered = active === 'All' ? allItems : allItems.filter(i => i.category === active);
  const allCats  = ['All', ...categories];

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
              <div style={S.pinInner}>
                {/* ── Playing: inline YouTube embed ── */}
                {playing === item.id && item.video_url ? (() => {
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
                        onClick={() => setPlaying(null)}
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

                    {/* Hover overlay */}
                    <div style={{ ...S.overlay, opacity: hovered === item.id ? 1 : 0 }}>
                      {item.category && <span style={S.catPill}>{item.category}</span>}
                      <div style={S.overlayCenter}>
                        {item.video_url ? (
                          <button
                            onClick={() => setPlaying(item.id)}
                            style={S.actionCircle}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={ORANGE}>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
                        ) : (
                          <div style={S.actionCircle}>
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
      `}</style>
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
