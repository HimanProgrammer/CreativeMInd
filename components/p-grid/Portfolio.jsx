'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const STATIC = [
  { id: 's1', title: 'Brand Identity System', category: 'Branding', image_url: '/assets/imgs/works/2/1.jpg' },
  { id: 's2', title: 'E-Commerce Platform', category: 'Web Design', image_url: '/assets/imgs/works/2/2.jpg' },
  { id: 's3', title: 'Mobile App UI', category: 'UI/UX', image_url: '/assets/imgs/works/2/3.jpg' },
  { id: 's4', title: 'Digital Marketing', category: 'Marketing', image_url: '/assets/imgs/works/2/4.jpg' },
  { id: 's5', title: 'Logo & Visual Identity', category: 'Branding', image_url: '/assets/imgs/works/2/5.jpg' },
  { id: 's6', title: 'Social Media Campaign', category: 'Marketing', image_url: '/assets/imgs/works/2/6.jpg' },
];

export default function Portfolio() {
  const [items, setItems] = useState(STATIC);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState('All');
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    (async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('id,title,category,image_url,thumbnail_url')
          .order('created_at', { ascending: false })
          .limit(24)
          .abortSignal(controller.signal);
        clearTimeout(timeout);
        if (!error && data?.length) {
          const isHash = (s) => /^[0-9a-f]{20,}$/i.test((s || '').trim());
          const clean = data.filter(i => !isHash(i.title) && !isHash(i.image_url));
          setItems(clean.length ? clean : STATIC);
          setCategories([...new Set(clean.map(i => i.category).filter(Boolean))]);
        }
      } catch { clearTimeout(timeout); }
    })();
    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  const filtered = active === 'All' ? items : items.filter(i => i.category === active);
  const allCats = ['All', ...categories];

  return (
    <section style={S.section}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <span style={S.eyebrow}>OUR WORK</span>
          <h2 style={S.heading}>
            Selected <em style={S.headingAccent}>Projects</em>
          </h2>
          <p style={S.subText}>A curated collection of work we&apos;re proud of.</p>
        </div>

        {/* Filter tabs */}
        <div style={S.filters}>
          {allCats.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{ ...S.tab, ...(active === cat ? S.tabActive : {}) }}
            >
              {active === cat && <span style={S.tabBar} />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Row list */}
      <div style={S.list}>
        {filtered.map((item, i) => {
          const flip = i % 2 === 1;
          const isHov = hovered === item.id;
          return (
            <div
              key={item.id}
              style={S.row}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Big index */}
              <span style={S.index}>{String(i + 1).padStart(2, '0')}</span>

              {/* Image — alternates left/right */}
              <div style={{
                ...S.imgWrap,
                order: flip ? 3 : 1,
              }}>
                <img
                  src={item.thumbnail_url || item.image_url}
                  alt={item.title}
                  style={{
                    ...S.img,
                    transform: isHov ? 'scale(1.06) rotate(-1deg)' : 'scale(1) rotate(0deg)',
                  }}
                  onError={e => { e.target.src = '/assets/imgs/works/2/1.jpg'; }}
                  loading="lazy"
                />
                {/* corner tag */}
                <span style={S.tag}>{item.category || 'Design'}</span>
              </div>

              {/* Divider line */}
              <div style={{ ...S.vline, order: 2 }} />

              {/* Text */}
              <div style={{ ...S.info, order: flip ? 1 : 3, textAlign: flip ? 'right' : 'left' }}>
                <p style={S.infoCat}>{item.category || 'Design'}</p>
                <h3 style={S.infoTitle}>{item.title || 'Project'}</h3>
                <p style={S.infoDesc}>
                  A creative project blending strategy and design to deliver exceptional results for our client.
                </p>
                <a
                  href="/project-details"
                  style={{
                    ...S.viewBtn,
                    ...(isHov ? S.viewBtnHov : {}),
                    alignSelf: flip ? 'flex-end' : 'flex-start',
                  }}
                >
                  View Case Study
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 8 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={S.cta}>
        <div style={S.ctaInner}>
          <p style={S.ctaLabel}>Ready to build something great?</p>
          <h3 style={S.ctaHeading}>Let&apos;s work together.</h3>
          <a href="/page-contact" style={S.ctaBtn}>Start a Project →</a>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

const S = {
  section: {
    background: '#f7f5f2',
    padding: '100px 0 0',
    minHeight: '100vh',
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    maxWidth: 1200,
    margin: '0 auto 80px',
    padding: '0 48px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 32,
  },
  eyebrow: {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.22em',
    color: '#f05a28',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  heading: {
    fontSize: 'clamp(40px, 5vw, 64px)',
    fontWeight: 800,
    color: '#111',
    lineHeight: 1.05,
    margin: '0 0 12px',
    fontStyle: 'normal',
  },
  headingAccent: {
    fontStyle: 'italic',
    fontWeight: 700,
    color: '#f05a28',
  },
  subText: {
    color: '#888',
    fontSize: 15,
    margin: 0,
    fontWeight: 400,
  },

  // ── Filters ─────────────────────────────────────────────────
  filters: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    alignItems: 'flex-end',
  },
  tab: {
    background: 'none',
    border: 'none',
    color: '#aaa',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    padding: '6px 0',
    position: 'relative',
    letterSpacing: '0.04em',
    transition: 'color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  tabActive: {
    color: '#111',
  },
  tabBar: {
    display: 'inline-block',
    width: 20,
    height: 2,
    background: '#f05a28',
    borderRadius: 2,
  },

  // ── Row list ─────────────────────────────────────────────────
  list: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 48px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    padding: '56px 0',
    borderTop: '1px solid #e0ddd8',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  // Big number
  index: {
    position: 'absolute',
    top: 20,
    left: 0,
    fontSize: 11,
    fontWeight: 800,
    color: '#ccc',
    letterSpacing: '0.1em',
    fontFamily: 'monospace',
  },

  // Image side
  imgWrap: {
    width: '45%',
    flexShrink: 0,
    borderRadius: 20,
    overflow: 'hidden',
    aspectRatio: '4/3',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
  },
  tag: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    background: 'rgba(10,10,10,0.72)',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '5px 12px',
    borderRadius: 50,
    backdropFilter: 'blur(6px)',
  },

  // Center divider
  vline: {
    width: 1,
    alignSelf: 'stretch',
    background: '#e0ddd8',
    margin: '0 48px',
    flexShrink: 0,
  },

  // Text side
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  infoCat: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.18em',
    color: '#f05a28',
    textTransform: 'uppercase',
    margin: 0,
  },
  infoTitle: {
    fontSize: 'clamp(22px, 2.5vw, 34px)',
    fontWeight: 800,
    color: '#111',
    lineHeight: 1.15,
    margin: 0,
  },
  infoDesc: {
    fontSize: 14,
    color: '#888',
    lineHeight: 1.7,
    margin: 0,
    maxWidth: 340,
  },
  viewBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '11px 24px',
    background: '#111',
    color: '#fff',
    borderRadius: 50,
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.02em',
    transition: 'background 0.2s, transform 0.2s',
    width: 'fit-content',
  },
  viewBtnHov: {
    background: '#f05a28',
    transform: 'translateX(4px)',
  },

  // ── CTA ─────────────────────────────────────────────────────
  cta: {
    background: '#111',
    marginTop: 100,
    padding: '80px 48px',
  },
  ctaInner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 20,
  },
  ctaLabel: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#f05a28',
    textTransform: 'uppercase',
    margin: 0,
  },
  ctaHeading: {
    fontSize: 'clamp(32px, 4vw, 52px)',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.1,
    margin: 0,
  },
  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '15px 36px',
    background: '#f05a28',
    color: '#fff',
    borderRadius: 50,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.03em',
    marginTop: 8,
  },
};
