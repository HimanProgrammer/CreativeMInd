'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const ORANGE = '#f05a28';
const HOW_MANY = 8;

// Shown while loading or if Supabase is unreachable, so the section is never empty.
const PLACEHOLDERS = Array.from({ length: HOW_MANY }, (_, i) => ({
  id: `ph-${i}`,
  title: '',
  category: '',
  src: null,
}));

// Fisher–Yates. Runs inside useEffect (client-only) so there's no SSR
// hydration mismatch from the randomness.
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickSrc(item) {
  // Full-size first: thumbnails are only 400x300, which visibly upscales in
  // these tiles (and doubles again on retina). image_url is already a
  // compressed WebP, so quality wins here.
  if (item.image_url && item.image_url.startsWith('http')) return item.image_url;
  if (item.thumbnail_url && item.thumbnail_url.startsWith('http')) return item.thumbnail_url;
  const m = (item.video_url || '').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

export default function BestWork() {
  const [items, setItems] = useState(PLACEHOLDERS);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Pull a wide pool, then pick at random — so the homepage shows a
        // different slice of the portfolio on every visit.
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('id,title,category,image_url,thumbnail_url,video_url,website_url')
          .limit(300);
        if (cancelled || error || !data) return;

        // Website entries are link cards, not artwork — skip them here.
        const pool = data
          .filter((i) => !i.website_url)
          .map((i) => ({ id: i.id, title: i.title, category: i.category, src: pickSrc(i) }))
          .filter((i) => i.src);

        const graphics = shuffle(pool).slice(0, HOW_MANY);

        if (graphics.length) setItems(graphics);
      } catch { /* keep placeholders */ }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="rd-section rd-bestwork">
      <div className="container">
        <div className="row align-items-end mb-50">
          <div className="col-lg-6 rd-reveal-left">
            <p className="rd-section-tag">OUR PORTFOLIO</p>
            <h2 className="rd-section-title">Our Best <span>Work</span></h2>
          </div>
          <div className="col-lg-6 text-lg-end rd-reveal-right">
            <Link href="/portfolio-masonry" className="rd-more-btn">
              View All Projects <span>→</span>
            </Link>
          </div>
        </div>

        <div className="bw-grid">
          {items.map((item, i) => (
            <Link
              key={item.id}
              href="/portfolio-masonry"
              className={`bw-tile bw-tile-${i % 6}`}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              aria-label={item.title || 'View portfolio'}
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.title || item.category || 'CreativeMind work'}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="bw-skeleton" />
              )}

              {item.src && (
                <span
                  className="bw-overlay"
                  style={{ opacity: hovered === item.id ? 1 : 0 }}
                >
                  {item.category && <span className="bw-cat">{item.category}</span>}
                  <span className="bw-arrow">↗</span>
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .rd-bestwork .bw-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 180px;
          gap: 16px;
        }
        .rd-bestwork .bw-tile {
          position: relative;
          display: block;
          overflow: hidden;
          border-radius: 14px;
          background: #f2f2f5;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(20,20,43,0.06);
        }
        /* a couple of tiles span two rows for a varied, editorial layout */
        .rd-bestwork .bw-tile-0,
        .rd-bestwork .bw-tile-5 { grid-row: span 2; }

        .rd-bestwork .bw-tile img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform .5s ease;
        }
        .rd-bestwork .bw-tile:hover img { transform: scale(1.07); }

        .rd-bestwork .bw-skeleton {
          display: block; width: 100%; height: 100%;
          background: linear-gradient(100deg,#f0f0f4 30%,#e6e6ee 50%,#f0f0f4 70%);
          background-size: 220% 100%;
          animation: bwShimmer 1.4s linear infinite;
        }
        @keyframes bwShimmer { to { background-position: -220% 0; } }

        .rd-bestwork .bw-overlay {
          position: absolute; inset: 0;
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 10; padding: 14px;
          background: linear-gradient(to top, rgba(10,10,20,0.78), rgba(10,10,20,0) 60%);
          transition: opacity .25s ease;
        }
        .rd-bestwork .bw-cat {
          color: #fff; font-size: 11px; font-weight: 700;
          letter-spacing: .06em; text-transform: uppercase;
          background: ${ORANGE}; padding: 4px 10px; border-radius: 20px;
        }
        .rd-bestwork .bw-arrow {
          color: #fff; font-size: 18px; font-weight: 700; line-height: 1;
          margin-left: auto;
        }

        @media (max-width: 992px) {
          .rd-bestwork .bw-grid { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 160px; }
        }
        @media (max-width: 700px) {
          .rd-bestwork .bw-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 140px; gap: 12px; }
          .rd-bestwork .bw-tile-0,
          .rd-bestwork .bw-tile-5 { grid-row: span 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rd-bestwork .bw-tile img { transition: none; }
          .rd-bestwork .bw-tile:hover img { transform: none; }
          .rd-bestwork .bw-skeleton { animation: none; }
        }
      `}</style>
    </section>
  );
}
