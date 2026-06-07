'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function toSlug(cat) {
  return (cat || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

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
    (async () => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('id,title,category,image_url,thumbnail_url')
        .order('created_at', { ascending: false })
        .limit(24);
      if (!error && data?.length) {
        const isHash = (s) => /^[0-9a-f]{20,}$/i.test((s || '').trim());
        const clean = data.filter(i => !isHash(i.title) && !isHash(i.image_url));
        setItems(clean.length ? clean : STATIC);
        setCategories([...new Set(clean.map(i => i.category).filter(Boolean))]);
      }
    })();
  }, []);

  const filtered = active === 'All' ? items : items.filter(i => i.category === active);
  const allCats = ['All', ...categories];

  return (
    <section style={S.section}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <span style={S.eyebrow}>OUR WORK</span>
          <h2 style={S.heading}>
            Selected <span style={S.headingAccent}>Projects</span>
          </h2>
        </div>
        {/* Filter Pills */}
        <div style={S.filters}>
          {allCats.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                ...S.pill,
                ...(active === cat ? S.pillActive : {}),
              }}
            >
              {cat}
              {active === cat && <span style={S.pillDot} />}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={S.grid}>
        {filtered.map((item, i) => (
          <div
            key={item.id}
            style={{
              ...S.card,
              ...(i % 5 === 0 ? S.cardWide : {}),
            }}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={S.imgWrap}>
              <img
                src={item.thumbnail_url || item.image_url}
                alt={item.title}
                style={{
                  ...S.img,
                  transform: hovered === item.id ? 'scale(1.08)' : 'scale(1)',
                }}
                onError={e => { e.target.src = '/assets/imgs/works/2/1.jpg'; }}
                loading="lazy"
              />
              {/* Overlay */}
              <div style={{
                ...S.overlay,
                opacity: hovered === item.id ? 1 : 0,
              }}>
                <div style={S.overlayContent}>
                  <span style={S.overlayCat}>{item.category || 'Design'}</span>
                  <h4 style={S.overlayTitle}>{item.title || 'Project'}</h4>
                  <a href="/project-details" style={S.overlayBtn}>
                    View Project <span style={{ marginLeft: 6 }}>→</span>
                  </a>
                </div>
              </div>
              {/* Number badge */}
              <div style={S.numBadge}>
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
            {/* Card Footer */}
            <div style={S.cardFoot}>
              <div>
                <p style={S.cardCat}>{item.category || 'Design'}</p>
                <h5 style={S.cardTitle}>{item.title || 'Project'}</h5>
              </div>
              <a href="/project-details" style={S.arrowBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={S.cta}>
        <p style={S.ctaText}>Want to see more of our work?</p>
        <a href="/page-contact" style={S.ctaBtn}>Start a Project</a>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

const S = {
  section: {
    background: '#0a0a0a',
    padding: '100px 0 80px',
    minHeight: '100vh',
  },
  header: {
    maxWidth: 1300,
    margin: '0 auto 64px',
    padding: '0 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 32,
  },
  headerLeft: { flex: 1, minWidth: 240 },
  eyebrow: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#f05a28',
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  heading: {
    fontSize: 'clamp(36px, 4vw, 56px)',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.1,
    margin: 0,
  },
  headingAccent: {
    color: '#f05a28',
    fontStyle: 'italic',
  },
  filters: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  pill: {
    padding: '9px 20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 50,
    color: '#888',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    position: 'relative',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  pillActive: {
    background: '#f05a28',
    border: '1px solid #f05a28',
    color: '#fff',
  },
  pillDot: {
    width: 6, height: 6,
    background: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
  },
  grid: {
    maxWidth: 1300,
    margin: '0 auto',
    padding: '0 40px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
  },
  card: {
    cursor: 'pointer',
    background: '#111',
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  cardWide: {
    gridColumn: 'span 2',
  },
  imgWrap: {
    position: 'relative',
    overflow: 'hidden',
    aspectRatio: '16/10',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(160deg, rgba(240,90,40,0.92) 0%, rgba(10,10,10,0.85) 100%)',
    display: 'flex',
    alignItems: 'flex-end',
    padding: 28,
    transition: 'opacity 0.35s',
  },
  overlayContent: { width: '100%' },
  overlayCat: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    marginBottom: 8,
    display: 'block',
  },
  overlayTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 700,
    margin: '0 0 16px',
    lineHeight: 1.2,
  },
  overlayBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 20px',
    background: '#fff',
    borderRadius: 50,
    color: '#0a0a0a',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 700,
  },
  numBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    background: 'rgba(10,10,10,0.7)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  cardFoot: {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  cardCat: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#f05a28',
    textTransform: 'uppercase',
    margin: '0 0 4px',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    margin: 0,
    lineHeight: 1.3,
  },
  arrowBtn: {
    width: 38,
    height: 38,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textDecoration: 'none',
    flexShrink: 0,
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'background 0.2s',
  },
  cta: {
    maxWidth: 1300,
    margin: '64px auto 0',
    padding: '0 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    paddingTop: 40,
    flexWrap: 'wrap',
    gap: 20,
  },
  ctaText: {
    color: '#666',
    fontSize: 16,
    margin: 0,
  },
  ctaBtn: {
    padding: '14px 36px',
    background: '#f05a28',
    borderRadius: 50,
    color: '#fff',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.03em',
    transition: 'background 0.2s',
  },
};
