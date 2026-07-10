'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const ORANGE = '#f05a28';

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function VideoSection() {
  const [videos, setVideos]   = useState([]);
  const [playing, setPlaying] = useState(null);
  const [loaded, setLoaded]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('portfolio_items')
          .select('id,title,category,image_url,thumbnail_url,video_url')
          .not('video_url', 'is', null)
          .neq('video_url', '')
          .order('created_at', { ascending: false });
        if (data?.length) setVideos(data);
      } catch {}
      finally { setLoaded(true); }
    })();
  }, []);

  if (loaded && videos.length === 0) return null;

  return (
    <section style={S.section}>

      {/* ── Header ── */}
      <div style={S.header}>
        <span style={S.eyebrow}>✦ VIDEO SHOWCASE</span>
        <div style={S.headRow}>
          <h2 style={S.heading}>
            Our <span style={S.outline}>Videos</span>
          </h2>
          <span style={S.badge}>
            <span style={S.redDot} />
            LIVE
          </span>
        </div>
        <p style={S.sub}>Watch our work in motion — branding, UI/UX, reels &amp; more.</p>
      </div>

      {/* ── Grid ── */}
      {!loaded ? (
        <div style={S.loading}>
          <div style={S.spinner} />
        </div>
      ) : (
        <div className="vid-grid" style={S.grid}>
          {videos.map((item, idx) => {
            const ytId      = getYouTubeId(item.video_url);
            const thumb     = ytId
              ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
              : item.thumbnail_url || item.image_url;
            const isPlaying = playing === item.id;

            return (
              <div
                key={item.id}
                style={{ ...S.card, animationDelay: `${(idx % 8) * 60}ms` }}
              >
                {isPlaying && ytId ? (
                  <iframe
                    style={S.iframe}
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                    title={item.title || 'Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    style={S.thumb}
                    onClick={() => ytId ? setPlaying(item.id) : window.open(item.video_url, '_blank')}
                  >
                    {thumb && (
                      <img
                        src={thumb}
                        alt={item.title || item.category}
                        style={S.thumbImg}
                        onError={e => { e.target.style.background = '#1a1a1a'; e.target.style.display = 'none'; }}
                      />
                    )}
                    <div style={S.overlay}>
                      <div style={S.playRing}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill={ORANGE}>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      {item.category && (
                        <span style={S.catTag}>— {item.category}</span>
                      )}
                    </div>
                    <div style={S.duration}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4 }}>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      YouTube
                    </div>
                  </div>
                )}

                <div style={S.foot}>
                  <div style={S.footTop}>
                    <span style={S.footTitle}>{item.title || item.category || 'Video'}</span>
                    {item.file_size && (
                      <span style={S.footSize}>
                        {item.file_size > 1048576
                          ? (item.file_size / 1048576).toFixed(1) + ' MB'
                          : Math.round(item.file_size / 1024) + ' KB'}
                      </span>
                    )}
                  </div>
                  <div style={S.actions}>
                    {ytId && (
                      <button
                        onClick={() => setPlaying(isPlaying ? null : item.id)}
                        style={{ ...S.actionBtn, ...(isPlaying ? S.actionActive : {}) }}
                      >
                        {isPlaying ? (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                            Pause
                          </>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Play
                          </>
                        )}
                      </button>
                    )}
                    <a
                      href={item.video_url}
                      target="_blank"
                      rel="noreferrer"
                      style={S.watchBtn}
                    >
                      Watch on YouTube
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 5 }}>
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) { .vid-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px)  { .vid-grid { grid-template-columns: 1fr !important; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes pulse  { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </section>
  );
}

const S = {
  section: {
    background: '#0d0d0d',
    padding: '90px 0 80px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },

  /* Header */
  header: {
    maxWidth: 1400, margin: '0 auto 48px', padding: '0 48px',
  },
  eyebrow: {
    display: 'block', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.22em', color: ORANGE, marginBottom: 14,
    textTransform: 'uppercase',
  },
  headRow: { display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16 },
  heading: {
    fontSize: 'clamp(36px, 4.5vw, 64px)', fontWeight: 800,
    color: '#fff', lineHeight: 1.0, margin: 0,
    letterSpacing: '-0.02em',
  },
  outline: { WebkitTextStroke: `2px ${ORANGE}`, color: 'transparent' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    background: 'rgba(240,90,40,0.12)', border: `1px solid ${ORANGE}55`,
    borderRadius: 50, padding: '5px 14px',
    color: ORANGE, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
  },
  redDot: {
    width: 7, height: 7, borderRadius: '50%',
    background: ORANGE, animation: 'pulse 1.5s ease-in-out infinite',
    display: 'inline-block',
  },
  sub: { color: '#555', fontSize: 15, lineHeight: 1.7, maxWidth: 420, margin: 0 },

  /* Grid */
  grid: {
    maxWidth: 1400, margin: '0 auto', padding: '0 48px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 28,
  },
  loading: {
    display: 'flex', justifyContent: 'center', padding: '60px 0',
  },
  spinner: {
    width: 36, height: 36,
    border: '3px solid #222', borderTopColor: ORANGE,
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  },

  /* Card */
  card: {
    background: '#111',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 18,
    overflow: 'hidden',
    animation: 'fadeUp 0.5s ease both',
  },

  /* Thumbnail */
  thumb: {
    position: 'relative', aspectRatio: '16/10',
    background: '#1a1a1a', overflow: 'hidden', cursor: 'pointer',
  },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 14,
    transition: 'background 0.2s',
  },
  playRing: {
    width: 68, height: 68, borderRadius: '50%',
    background: 'rgba(255,255,255,0.95)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: `0 0 0 0 ${ORANGE}66`,
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  catTag: {
    color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 600,
    letterSpacing: '0.12em', textTransform: 'uppercase',
  },
  duration: {
    position: 'absolute', top: 12, right: 14,
    background: 'rgba(0,0,0,0.75)', color: '#fff',
    fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
    padding: '4px 10px', borderRadius: 20,
    display: 'flex', alignItems: 'center',
  },

  /* Embed */
  iframe: {
    width: '100%', aspectRatio: '16/10',
    border: 'none', display: 'block',
  },

  /* Footer */
  foot: { padding: '12px 16px 14px' },
  footTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 10,
  },
  footTitle: {
    color: '#ccc', fontSize: 12, fontWeight: 600,
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1,
  },
  footSize: {
    color: '#444', fontSize: 10, fontWeight: 500,
    marginLeft: 8, flexShrink: 0,
    background: 'rgba(255,255,255,0.04)',
    padding: '2px 7px', borderRadius: 10,
  },
  actions: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  actionBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 16px',
    background: 'rgba(240,90,40,0.12)',
    border: `1px solid ${ORANGE}44`,
    borderRadius: 50, color: ORANGE,
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.15s',
  },
  actionActive: {
    background: ORANGE, borderColor: ORANGE, color: '#fff',
  },
  watchBtn: {
    display: 'inline-flex', alignItems: 'center',
    padding: '7px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 50, color: '#888',
    fontSize: 12, fontWeight: 600, textDecoration: 'none',
    transition: 'all 0.15s',
  },
};
