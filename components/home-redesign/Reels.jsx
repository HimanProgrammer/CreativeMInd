'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/siteConfig';

const ORANGE = '#f05a28';

// Reels grid fed by /api/reels (the CreativeMind YouTube channel).
// limit: how many to show (homepage teaser) — omit for the full /reels page.
export default function Reels({ limit, showHeader = true }) {
  const [reels, setReels] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/reels')
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setReels(d.reels || []); })
      .catch(() => { if (!cancelled) setReels([]); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === 'Escape' && setActive(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  const list = reels ? (limit ? reels.slice(0, limit) : reels) : null;

  // Homepage teaser hides itself entirely if the channel has nothing yet.
  if (limit && reels && reels.length === 0) return null;

  return (
    <section className="rd-section rd-reels">
      <div className="container">
        {showHeader && (
          <div className="row align-items-end mb-50">
            <div className="col-lg-7 rd-reveal-left">
              <p className="rd-section-tag">REELS</p>
              <h2 className="rd-section-title">Our Latest <span>Reels</span></h2>
              <p className="rd-section-subtitle">
                Short videos on web, apps and digital growth — straight from our channel.
              </p>
            </div>
            <div className="col-lg-5 text-lg-end rd-reveal-right">
              {limit ? (
                <Link href="/reels" className="rd-more-btn">View All Reels <span>→</span></Link>
              ) : (
                <a href={SITE.social.youtube} target="_blank" rel="noreferrer" className="rd-more-btn">
                  Subscribe on YouTube <span>→</span>
                </a>
              )}
            </div>
          </div>
        )}

        {list === null && (
          <div className="rl-grid">
            {Array.from({ length: limit || 8 }).map((_, i) => (
              <span key={i} className="rl-card rl-skeleton" />
            ))}
          </div>
        )}

        {list && list.length === 0 && (
          <p className="rl-empty">
            New reels are on the way. Meanwhile, follow us on{' '}
            <a href={SITE.social.instagram} target="_blank" rel="noreferrer">Instagram</a>{' '}
            and <a href={SITE.social.youtube} target="_blank" rel="noreferrer">YouTube</a>.
          </p>
        )}

        {list && list.length > 0 && (
          <div className="rl-grid">
            {list.map((r) => (
              <button
                key={r.id}
                type="button"
                className="rl-card"
                onClick={() => setActive(r)}
                aria-label={`Play: ${r.title}`}
              >
                <img src={r.thumb} alt={r.title} loading="lazy" decoding="async" />
                <span className="rl-play">▶</span>
                <span className="rl-title">{r.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {active && (
        <div className="rl-modal" onClick={() => setActive(null)} role="dialog" aria-modal="true">
          <div className="rl-frame" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`${active.embedUrl}?autoplay=1&rel=0`}
              title={active.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
            <div className="rl-modal-bar">
              <a href={active.url} target="_blank" rel="noreferrer">Open on YouTube ↗</a>
              <button type="button" onClick={() => setActive(null)}>Close ✕</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .rd-reels .rl-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .rd-reels .rl-card {
          position: relative; display: block; width: 100%;
          aspect-ratio: 9 / 16; overflow: hidden;
          border: 0; padding: 0; cursor: pointer;
          border-radius: 16px; background: #14142b;
          box-shadow: 0 8px 24px rgba(20,20,43,0.10);
        }
        .rd-reels .rl-card img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform .5s ease;
        }
        .rd-reels .rl-card:hover img { transform: scale(1.06); }
        .rd-reels .rl-play {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 56px; height: 56px; border-radius: 50%;
          background: ${ORANGE}; color: #fff; font-size: 20px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 20px rgba(240,90,40,0.45);
        }
        .rd-reels .rl-title {
          position: absolute; left: 0; right: 0; bottom: 0;
          padding: 40px 14px 14px; text-align: left;
          color: #fff; font-size: 14px; font-weight: 600; line-height: 1.35;
          background: linear-gradient(to top, rgba(10,10,20,0.85), rgba(10,10,20,0));
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .rd-reels .rl-skeleton {
          background: linear-gradient(100deg,#f0f0f4 30%,#e6e6ee 50%,#f0f0f4 70%);
          background-size: 220% 100%;
          animation: rlShimmer 1.4s linear infinite; cursor: default;
        }
        @keyframes rlShimmer { to { background-position: -220% 0; } }
        .rd-reels .rl-empty { text-align: center; color: #666; font-size: 16px; }
        .rd-reels .rl-empty a { color: ${ORANGE}; font-weight: 600; }

        .rl-modal {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(5,5,15,0.85);
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .rl-frame {
          width: min(420px, 100%);
          display: flex; flex-direction: column; gap: 10px;
        }
        .rl-frame iframe {
          width: 100%; aspect-ratio: 9 / 16; max-height: 80vh;
          border: 0; border-radius: 16px; background: #000;
        }
        .rl-modal-bar { display: flex; justify-content: space-between; }
        .rl-modal-bar a, .rl-modal-bar button {
          color: #fff; background: none; border: 0; font-weight: 600;
          font-size: 14px; cursor: pointer; text-decoration: none;
        }

        @media (max-width: 992px) {
          .rd-reels .rl-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 700px) {
          .rd-reels .rl-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rd-reels .rl-card img { transition: none; }
          .rd-reels .rl-card:hover img { transform: none; }
          .rd-reels .rl-skeleton { animation: none; }
        }
      `}</style>
    </section>
  );
}
