import React from 'react';
import { SITE } from '@/lib/siteConfig';

const ORANGE = '#f05a28';

function Map() {
  // Driven by SITE.address so the map always matches the address shown above it.
  const query = encodeURIComponent(SITE.address);
  const embedSrc = `https://maps.google.com/maps?q=${query}&t=&z=16&ie=UTF8&iwloc=near&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  const larger = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="google-map" style={st.wrap}>
      <iframe
        id="gmap_canvas"
        title={`Map of ${SITE.name} — ${SITE.address}`}
        src={embedSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={st.frame}
      ></iframe>

      {/* Highlighted location card */}
      <div style={st.card} className="map-card">
        <div style={st.head}>
          <span style={st.pin}>📍</span>
          <div style={{ minWidth: 0 }}>
            <div style={st.name}>{SITE.name}</div>
            <div style={st.city}>{SITE.addressShort}</div>
          </div>
        </div>

        <p style={st.addr}>{SITE.address}</p>

        <div style={st.row}>
          <a href={SITE.phoneTel} style={st.metaLink}>📞 {SITE.phone}</a>
        </div>

        <div style={st.btnRow}>
          <a href={directions} target="_blank" rel="noreferrer" style={st.btnPrimary}>
            Get Directions
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 6 }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href={larger} target="_blank" rel="noreferrer" style={st.btnGhost}>View larger map</a>
        </div>
      </div>

      {/* Pulsing highlight ring over the map centre */}
      <div style={st.pulseWrap} className="map-pulse-wrap" aria-hidden>
        <span style={st.pulse} className="map-pulse" />
        <span style={st.pulseDot} />
      </div>

      <style>{`
        @keyframes mapPulse {
          0%   { transform: scale(0.6); opacity: 0.85; }
          70%  { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        .map-pulse { animation: mapPulse 2.4s ease-out infinite; }
        @media (max-width: 768px) {
          .google-map .map-card { position: static !important; width: auto !important; margin: 16px; }
          .google-map .map-pulse-wrap { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) { .map-pulse { animation: none !important; } }
      `}</style>
    </div>
  );
}

const st = {
  wrap: { position: 'relative' },
  frame: { width: '100%', display: 'block', border: 0 },

  card: {
    position: 'absolute', top: 28, left: 28, zIndex: 2, width: 320, maxWidth: 'calc(100% - 56px)',
    background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)',
    borderRadius: 16, padding: '20px 22px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  head: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  pin: {
    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
    background: `${ORANGE}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
  },
  name: { fontWeight: 800, fontSize: 15, color: '#141414', lineHeight: 1.25 },
  city: { fontSize: 12, color: '#777', marginTop: 2 },
  addr: { fontSize: 13, lineHeight: 1.65, color: '#555', margin: '0 0 12px' },
  row: { marginBottom: 16 },
  metaLink: { fontSize: 13, color: ORANGE, textDecoration: 'none', fontWeight: 600 },
  btnRow: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', padding: '10px 20px', borderRadius: 30,
    background: ORANGE, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700,
    boxShadow: `0 8px 20px ${ORANGE}44`,
  },
  btnGhost: { fontSize: 12.5, color: '#666', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.2)' },

  pulseWrap: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
    width: 0, height: 0, pointerEvents: 'none', zIndex: 1,
  },
  pulse: {
    position: 'absolute', top: -18, left: -18, width: 36, height: 36,
    borderRadius: '50%', background: `${ORANGE}55`, border: `2px solid ${ORANGE}`,
    display: 'block',
  },
  pulseDot: {
    position: 'absolute', top: -5, left: -5, width: 10, height: 10,
    borderRadius: '50%', background: ORANGE, display: 'block',
    boxShadow: `0 0 0 3px rgba(255,255,255,0.9)`,
  },
};

export default Map;
