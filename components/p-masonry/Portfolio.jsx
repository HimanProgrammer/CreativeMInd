'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const STATIC = [
  { id: 's1', title: 'Brand Identity System', category: 'Branding',   image_url: '/assets/imgs/works/2/1.jpg' },
  { id: 's2', title: 'E-Commerce Platform',   category: 'Web Design',  image_url: '/assets/imgs/works/2/2.jpg' },
  { id: 's3', title: 'Mobile App UI',          category: 'UI/UX',      image_url: '/assets/imgs/works/2/3.jpg' },
  { id: 's4', title: 'Digital Marketing',      category: 'Marketing',  image_url: '/assets/imgs/works/2/4.jpg' },
  { id: 's5', title: 'Logo Design',            category: 'Branding',   image_url: '/assets/imgs/works/2/5.jpg' },
  { id: 's6', title: 'Social Campaign',        category: 'Marketing',  image_url: '/assets/imgs/works/2/6.jpg' },
  { id: 's7', title: 'Dashboard UI',           category: 'UI/UX',      image_url: '/assets/imgs/works/2/7.jpg' },
  { id: 's8', title: 'Landing Page',           category: 'Web Design', image_url: '/assets/imgs/works/2/8.jpg' },
  { id: 's9', title: 'App Redesign',           category: 'UI/UX',      image_url: '/assets/imgs/works/2/1.jpg' },
  { id: 's10', title: 'Print Campaign',        category: 'Branding',   image_url: '/assets/imgs/works/2/2.jpg' },
  { id: 's11', title: 'SEO Strategy',          category: 'Marketing',  image_url: '/assets/imgs/works/2/3.jpg' },
  { id: 's12', title: 'Corporate Website',     category: 'Web Design', image_url: '/assets/imgs/works/2/4.jpg' },
];

const ORANGE = '#f05a28';

export default function Portfolio() {
  const [allItems, setAllItems]     = useState(STATIC);
  const [categories, setCategories] = useState([]);
  const [active, setActive]         = useState('All');
  const [hovered, setHovered]       = useState(null);
  const [animating, setAnimating]   = useState(false);
  const [loaded, setLoaded]         = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    (async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('id,title,category,image_url,thumbnail_url')
          .order('created_at', { ascending: false })
          .limit(100)
          .abortSignal(controller.signal);
        clearTimeout(timeout);
        if (!error && data?.length) {
          const isHash = (s) => /^[0-9a-f]{20,}$/i.test((s || '').trim());
          const clean = data.filter(i => !isHash(i.title) && !isHash(i.image_url));
          if (clean.length) {
            setAllItems(clean);
            setCategories([...new Set(clean.map(i => i.category).filter(Boolean))]);
          }
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

  const filtered = active === 'All'
    ? allItems
    : allItems.filter(i => i.category === active);

  const allCats = ['All', ...categories];

  return (
    <section style={S.section}>

      {/* ── Header ── */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <span style={S.eyebrow}>✦ OUR PORTFOLIO</span>
          <h2 style={S.heading}>
            Creative <span style={S.outline}>Works</span>
          </h2>
          <p style={S.sub}>
            A curated selection of projects across branding, web design, UI/UX and digital marketing.
          </p>
        </div>

        <div style={S.stats}>
          {[
            { n: `${allItems.length}+`, l: 'Projects' },
            { n: `${categories.length || 4}`,  l: 'Categories' },
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
      <div style={S.filterSection}>
        <div style={S.filterInner}>
          <div style={S.filterRow}>
            {allCats.map(cat => (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                style={{
                  ...S.filterBtn,
                  ...(active === cat ? S.filterActive : {}),
                }}
              >
                {active === cat && <span style={S.filterDot} />}
                {cat}
                {active === cat && (
                  <span style={S.filterCount}>{filtered.length}</span>
                )}
              </button>
            ))}
          </div>
          <span style={S.totalCount}>
            {filtered.length} / {allItems.length} projects
          </span>
        </div>
      </div>

      {/* ── Masonry Grid ── */}
      <div style={S.masonryOuter}>
        <div
          className="pm-masonry"
          style={{
            ...S.masonry,
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(14px)' : 'translateY(0)',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
        >
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              style={{
                ...S.item,
                animationDelay: `${(idx % 12) * 40}ms`,
              }}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={S.imgBox}>
                <img
                  src={item.thumbnail_url || item.image_url}
                  alt={item.title || ''}
                  style={{
                    ...S.img,
                    transform: hovered === item.id ? 'scale(1.07)' : 'scale(1)',
                  }}
                  onError={e => { e.target.src = '/assets/imgs/works/2/1.jpg'; }}
                  loading="lazy"
                />

                <div style={S.grad} />

                {/* Hover overlay */}
                <div style={{
                  ...S.overlay,
                  opacity: hovered === item.id ? 1 : 0,
                  transform: hovered === item.id ? 'scale(1)' : 'scale(1.04)',
                }}>
                  <span style={S.ovCat}>{item.category}</span>
                  <a href="/project-details" style={S.ovArrow} title="View Project">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                </div>

                <span style={S.chip}>{item.category || 'Design'}</span>
              </div>

              <div style={S.foot}>
                <h5 style={S.footTitle}>{item.title || 'Untitled'}</h5>
                <a href="/project-details" style={S.footLink}>View →</a>
              </div>
            </div>
          ))}

          {filtered.length === 0 && loaded && (
            <div style={S.empty}>
              <p style={{ color: '#555', fontSize: 15 }}>No projects in this category yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={S.cta}>
        <div style={S.ctaLine} />
        <a href="/page-contact" style={S.ctaBtn}>
          Start a Project
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 8 }}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <div style={S.ctaLine} />
      </div>

      <style>{`
        @media (max-width: 1200px) { .pm-masonry { column-count: 3 !important; } }
        @media (max-width: 900px)  { .pm-masonry { column-count: 2 !important; } }
        @media (max-width: 540px)  { .pm-masonry { column-count: 1 !important; } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

const S = {
  section: {
    background: '#080808',
    padding: '100px 0 80px',
    minHeight: '100vh',
    fontFamily: 'inherit',
  },

  /* header */
  header: {
    maxWidth: 1400, margin: '0 auto 0', padding: '0 48px',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-end', gap: 40, flexWrap: 'wrap',
    marginBottom: 48,
  },
  headerLeft: { flex: 1 },
  eyebrow: {
    display: 'block', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.22em', color: ORANGE, marginBottom: 14,
    textTransform: 'uppercase',
  },
  heading: {
    fontSize: 'clamp(44px,5.5vw,76px)', fontWeight: 800,
    color: '#fff', lineHeight: 1.0, margin: '0 0 18px',
    letterSpacing: '-0.02em',
  },
  outline: { WebkitTextStroke: `2px ${ORANGE}`, color: 'transparent' },
  sub: { color: '#555', fontSize: 15, lineHeight: 1.7, maxWidth: 420, margin: 0 },

  /* stats */
  stats: {
    display: 'flex', alignItems: 'center', gap: 28,
    background: '#111', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 20, padding: '20px 30px', flexShrink: 0,
  },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  statN: { color: '#fff', fontSize: 26, fontWeight: 800, lineHeight: 1 },
  statL: { color: '#444', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' },
  statDiv: { width: 1, height: 36, background: 'rgba(255,255,255,0.07)' },

  /* filter section */
  filterSection: {
    maxWidth: 1400, margin: '0 auto 40px', padding: '0 48px',
  },
  filterInner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 12,
    borderTop: '1px solid rgba(255,255,255,0.07)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '20px 0',
  },
  filterRow: {
    display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '9px 20px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 50,
    color: '#666', cursor: 'pointer',
    fontSize: 13, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: 7,
    transition: 'all 0.18s',
    letterSpacing: '0.03em',
  },
  filterActive: {
    background: ORANGE,
    borderColor: ORANGE,
    color: '#fff',
    boxShadow: `0 4px 20px ${ORANGE}55`,
  },
  filterDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: 'rgba(255,255,255,0.9)', flexShrink: 0,
  },
  filterCount: {
    background: 'rgba(255,255,255,0.25)',
    borderRadius: 50, fontSize: 10, fontWeight: 700,
    padding: '1px 6px', lineHeight: 1.6,
  },
  totalCount: {
    color: '#333', fontSize: 12, letterSpacing: '0.06em', whiteSpace: 'nowrap',
  },

  /* masonry */
  masonryOuter: { maxWidth: 1400, margin: '0 auto', padding: '0 48px' },
  masonry: {
    columnCount: 4,
    columnGap: 16,
  },
  item: {
    breakInside: 'avoid',
    marginBottom: 16,
    background: '#111',
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
    animation: 'fadeUp 0.5s ease both',
  },

  imgBox: { position: 'relative', overflow: 'hidden' },
  img: {
    width: '100%', height: 'auto', display: 'block',
    transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
  },
  grad: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  overlay: {
    position: 'absolute', inset: 0,
    background: `rgba(240,90,40,0.92)`,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 14,
    transition: 'opacity 0.28s, transform 0.28s',
  },
  ovCat: {
    fontSize: 10, fontWeight: 700, letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase',
  },
  ovArrow: {
    width: 48, height: 48, background: '#fff', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#111', textDecoration: 'none',
  },
  chip: {
    position: 'absolute', top: 12, left: 12,
    padding: '4px 10px', background: 'rgba(10,10,10,0.75)',
    borderRadius: 20, color: '#ccc', fontSize: 10, fontWeight: 600,
    backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.1)',
    letterSpacing: '0.06em',
  },

  foot: {
    padding: '12px 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  footTitle: { color: '#ddd', fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.3 },
  footLink: { color: ORANGE, fontSize: 12, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: 8 },

  empty: { columnSpan: 'all', textAlign: 'center', padding: '60px 0' },

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
