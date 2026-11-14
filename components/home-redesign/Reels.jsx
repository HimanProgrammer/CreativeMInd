'use client';
import React, { useEffect, useState } from 'react';
import { SITE } from '@/lib/siteConfig';

const ORANGE = '#f05a28';

// Homepage reels grid fed by /api/reels (every Short on the CreativeMind
// YouTube channel). Each card links to the Short on YouTube.
const FIRST = 10; // shown before "Show all"

export default function Reels() {
  const [reels, setReels] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/reels')
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setReels(d.reels || []); })
      .catch(() => { if (!cancelled) setReels([]); });
    return () => { cancelled = true; };
  }, []);

  // Hide the section entirely if the channel has nothing to show.
  if (reels && reels.length === 0) return null;
  const list = reels ? (showAll ? reels : reels.slice(0, FIRST)) : null;

  return (
    <section id="reels" className="rd-section rd-reels">
      <div className="container">
        <div className="row align-items-end mb-50">
          <div className="col-lg-7 rd-reveal-left">
            <p className="rd-section-tag">REELS</p>
            <h2 className="rd-section-title">Our Latest <span>Reels</span></h2>
          </div>
          <div className="col-lg-5 text-lg-end rd-reveal-right">
            <a href={SITE.social.youtube} target="_blank" rel="noreferrer" className="rd-more-btn">
              Watch on YouTube <span>→</span>
            </a>
          </div>
        </div>

        <div className="rl-grid">
          {list === null
            ? Array.from({ length: 5 }).map((_, i) => <span key={i} className="rl-card rl-skeleton" />)
            : list.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rl-card"
                  aria-label={`Watch on YouTube: ${r.title}`}
                >
                  <img src={r.thumb} alt={r.title} loading="lazy" decoding="async" />
                  <span className="rl-play">▶</span>
                  <span className="rl-title">{r.title}</span>
                </a>
              ))}
        </div>

        {reels && reels.length > FIRST && (
          <div className="rl-more">
            <button type="button" className="rd-more-btn" onClick={() => setShowAll((v) => !v)}>
              {showAll ? 'Show less' : `Show all ${reels.length} reels`} <span>{showAll ? '↑' : '↓'}</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .rd-reels .rl-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }
        .rd-reels .rl-card {
          position: relative; display: block;
          aspect-ratio: 9 / 16; overflow: hidden;
          border-radius: 16px; background: #14142b;
          text-decoration: none;
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
          width: 52px; height: 52px; border-radius: 50%;
          background: ${ORANGE}; color: #fff; font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 20px rgba(240,90,40,0.45);
        }
        .rd-reels .rl-title {
          position: absolute; left: 0; right: 0; bottom: 0;
          padding: 40px 12px 12px;
          color: #fff; font-size: 13px; font-weight: 600; line-height: 1.35;
          background: linear-gradient(to top, rgba(10,10,20,0.85), rgba(10,10,20,0));
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .rd-reels .rl-skeleton {
          background: linear-gradient(100deg,#f0f0f4 30%,#e6e6ee 50%,#f0f0f4 70%);
          background-size: 220% 100%;
          animation: rlShimmer 1.4s linear infinite;
        }
        .rd-reels .rl-more { text-align: center; margin-top: 30px; }
        .rd-reels .rl-more button { background: none; border: 0; cursor: pointer; }
        @keyframes rlShimmer { to { background-position: -220% 0; } }

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
