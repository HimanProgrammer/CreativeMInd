'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const gradient = (a, b) => ({ background: `linear-gradient(100deg, ${a}, ${b})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' });

const BG  = '#ffffff';
const BG2 = '#f6f7f9';

/* ── Generic mock visuals (chosen per section via `mock` key) ── */
function CodeWindow({ accent }) {
  const lines = [
    [['const', accent], [' site', '#e6e6e6'], [' = ', '#888'], ['build', '#4ade80'], ['({', '#888']],
    [['  fast', '#79c0ff'], [': ', '#888'], ['true', '#f78166'], [',', '#888']],
    [['  seo', '#79c0ff'], [': ', '#888'], ['"optimized"', '#a5d6ff'], [',', '#888']],
    [['  responsive', '#79c0ff'], [': ', '#888'], ['true', '#f78166'], [',', '#888']],
    [['});', '#888']],
  ];
  return (
    <div style={M.window}>
      <div style={M.winBar}>
        <span style={{ ...M.dot, background: '#ff5f56' }} />
        <span style={{ ...M.dot, background: '#ffbd2e' }} />
        <span style={{ ...M.dot, background: '#27c93f' }} />
        <span style={M.winTitle}>index.jsx</span>
      </div>
      <pre style={M.code}>
        {lines.map((ln, i) => (
          <div key={i} style={{ display: 'flex' }}>
            <span style={M.lineNo}>{i + 1}</span>
            <span>{ln.map(([t, c], j) => <span key={j} style={{ color: c }}>{t}</span>)}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

function ChartMock({ accent }) {
  const bars = [40, 58, 47, 72, 66, 90, 100];
  return (
    <div style={M.card}>
      <div style={M.cardHead}>
        <span style={M.cardTitle}>Organic Growth</span>
        <span style={{ color: '#4ade80', fontSize: 12, fontWeight: 700 }}>↑ 218%</span>
      </div>
      <div style={M.bars}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', height: 120 }}>
            <div style={{ width: '100%', height: h + '%', background: i === bars.length - 1 ? accent : accent + '55', borderRadius: '6px 6px 0 0' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i} style={{ color: '#555', fontSize: 11 }}>{d}</span>)}
      </div>
    </div>
  );
}

function SearchMock({ accent }) {
  const rows = [
    { kw: 'best design agency', pos: '#1', up: true },
    { kw: 'web development services', pos: '#2', up: true },
    { kw: 'seo company near me', pos: '#3', up: true },
    { kw: 'app developers', pos: '#5', up: false },
  ];
  return (
    <div style={M.card}>
      <div style={M.searchBar}>
        <span style={{ color: '#666' }}>🔍</span>
        <span style={{ color: '#888', fontSize: 13 }}>ranking keywords…</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={M.searchRow}>
          <span style={{ color: '#ccc', fontSize: 13 }}>{r.kw}</span>
          <span style={{ color: r.up ? '#4ade80' : accent, fontSize: 13, fontWeight: 800 }}>{r.pos}</span>
        </div>
      ))}
    </div>
  );
}

function SpeedMock({ accent }) {
  const scores = [['Performance', 99], ['SEO', 100], ['Accessibility', 96], ['Best Practices', 98]];
  return (
    <div style={M.card}>
      <div style={M.cardHead}><span style={M.cardTitle}>Lighthouse Report</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 8 }}>
        {scores.map(([l, v]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ ...M.gauge, borderColor: accent }}>
              <span style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{v}</span>
            </div>
            <span style={{ color: '#777', fontSize: 11, marginTop: 8, display: 'block' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneMock({ accent }) {
  return (
    <div style={M.phone}>
      <div style={M.phoneNotch} />
      <div style={{ ...M.phoneHeader, background: accent }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>MyApp</span>
      </div>
      <div style={{ padding: 14 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={M.phoneCard}>
            <div style={{ ...M.phoneAvatar, background: accent + '33' }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 8, width: '70%', background: '#dcdce0', borderRadius: 4, marginBottom: 6 }} />
              <div style={{ height: 8, width: '40%', background: '#e8e8ec', borderRadius: 4 }} />
            </div>
          </div>
        ))}
        <div style={{ ...M.phoneBtn, background: accent }}>Get Started</div>
      </div>
    </div>
  );
}

function ChecklistMock({ accent }) {
  const items = ['Responsive on every device', 'Blazing-fast load times', 'SEO-ready structure', 'Secure & scalable', 'Ongoing support'];
  return (
    <div style={M.card}>
      <div style={M.cardHead}><span style={M.cardTitle}>What you get</span></div>
      <div style={{ marginTop: 8 }}>
        {items.map(it => (
          <div key={it} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ ...M.check, background: accent }}>✓</span>
            <span style={{ color: '#ccc', fontSize: 13.5 }}>{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackMock({ accent }) {
  const tech = ['React', 'Next.js', 'Node', 'Flutter', 'AWS', 'Figma'];
  return (
    <div style={M.card}>
      <div style={M.cardHead}><span style={M.cardTitle}>Our Stack</span></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
        {tech.map(t => (
          <span key={t} style={{ padding: '8px 16px', background: accent + '18', border: `1px solid ${accent}44`, borderRadius: 30, color: '#ddd', fontSize: 13, fontWeight: 600 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

const MOCKS = {
  code: CodeWindow, chart: ChartMock, search: SearchMock,
  speed: SpeedMock, phone: PhoneMock, checklist: ChecklistMock, stack: StackMock,
};

export default function ServicePage({ config }) {
  const { accent, accent2, eyebrow, title, titleAccent, sub, tags, metrics, marquee, reasons, process, capabilities, ctaHeading, ctaSub } = config;
  const [hovered, setHovered] = useState(null);

  return (
    <div style={S.page}>
      <div style={S.glowWrap} aria-hidden>
        <div style={{ ...S.glow, width: 420, height: 420, background: accent, top: -80, left: -60 }} className="sv-glow" />
        <div style={{ ...S.glow, width: 380, height: 380, background: accent2, top: 300, right: -80 }} className="sv-glow" />
        <div style={{ ...S.glow, width: 340, height: 340, background: accent, bottom: 200, left: '30%' }} className="sv-glow" />
      </div>

      {/* HERO */}
      <section style={S.hero}>
        <div style={S.heroInner} className="hero-inner">
          <div style={S.heroLeft}>
            <span style={{ ...S.eyebrow, color: accent }}>✦ {eyebrow}</span>
            <h1 style={S.heroH1}>
              {title}<br />
              <span style={gradient(accent, accent2)}>{titleAccent}</span>
            </h1>
            <p style={S.heroSub}>{sub}</p>
            <div style={S.tagsWrap}>
              {tags.map(t => <span key={t} style={S.tag}>{t}</span>)}
            </div>
            <div style={S.heroBtns}>
              <Link href="/page-contact" style={{ ...S.cta, background: accent, boxShadow: `0 8px 30px ${accent}44` }} className="sv-cta">
                ENQUIRE NOW
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 10 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="#work" style={S.ctaGhost}>See how we work</a>
            </div>
          </div>
          <div style={S.heroRight}>
            <div className="sv-float">{React.createElement(MOCKS[reasons[0].mock], { accent })}</div>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section style={S.metricsBand}>
        <div style={S.metricsInner}>
          {metrics.map((m, i) => (
            <div key={m.l} style={{ ...S.metric, borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
              <span style={S.metricN}>{m.n}</span>
              <span style={S.metricL}>{m.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <section style={S.marqueeWrap}>
        <div style={S.marqueeTrack} className="sv-marquee">
          {[...marquee, ...marquee].map((p, i) => (
            <span key={i} style={S.marqueeItem}>{p}<span style={{ ...S.marqueeDot, color: accent }}>✦</span></span>
          ))}
        </div>
      </section>

      {/* REASONS */}
      {reasons.map((r, i) => {
        const Mock = MOCKS[r.mock];
        return (
          <section key={i} style={{ ...S.altSection, background: i % 2 === 0 ? BG : BG2 }}>
            <div style={{ ...S.altInner, flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }} className="alt-inner">
              <div style={S.altText}>
                <span style={{ ...S.altKicker, color: accent }}>0{i + 1}</span>
                <h2 style={S.altH2}>{r.heading}</h2>
                <p style={S.altP}>{r.body}</p>
              </div>
              <div style={S.altMock}><Mock accent={accent} /></div>
            </div>
          </section>
        );
      })}

      {/* PROCESS */}
      <section id="work" style={S.processSection}>
        <div style={S.processHead}>
          <span style={{ ...S.eyebrow, color: accent }}>✦ HOW WE WORK</span>
          <h2 style={S.processTitle}>Our proven <span style={gradient(accent, accent2)}>process.</span></h2>
        </div>
        <div style={S.processGrid} className="caps-grid">
          {process.map(p => (
            <div key={p.step} style={S.processCard}>
              <span style={S.processStep}>{p.step}</span>
              <h3 style={S.processCardTitle}>{p.title}</h3>
              <p style={S.processCardDesc}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section style={S.capsSection}>
        <h2 style={S.capsHeading}>OUR CAPABILITIES</h2>
        <div style={S.capsGrid} className="caps-grid">
          {capabilities.map((c, i) => (
            <div
              key={c.title}
              style={{
                ...S.capCard,
                borderColor: hovered === i ? accent : 'rgba(255,255,255,0.07)',
                transform: hovered === i ? 'translateY(-8px)' : 'none',
                boxShadow: hovered === i ? `0 20px 50px ${accent}22` : 'none',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ ...S.capIcon, background: accent + '22', color: accent }}>{c.icon}</div>
              <h3 style={S.capTitle}>{c.title}</h3>
              <p style={S.capDesc}>{c.desc}</p>
              <div style={{ ...S.capArrow, color: accent }}>→</div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes svFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        @keyframes svGlow { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-30px) scale(1.15); } }
        @keyframes svMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .sv-float { animation: svFloat 5s ease-in-out infinite; }
        .sv-glow { animation: svGlow 14s ease-in-out infinite; opacity: .16; filter: blur(90px); }
        .sv-marquee { animation: svMarquee 30s linear infinite; }
        .sv-cta { transition: transform .2s, box-shadow .2s; }
        .sv-cta:hover { transform: translateY(-3px); }
        @media (max-width: 900px) {
          .caps-grid { grid-template-columns: 1fr 1fr !important; }
          .alt-inner { flex-direction: column !important; }
        }
        @media (max-width: 600px) {
          .hero-inner { flex-direction: column !important; }
          .caps-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sv-float, .sv-glow, .sv-marquee { animation: none !important; }
        }
      `}</style>

      {/* CTA */}
      <section style={{ ...S.ctaBanner, background: `linear-gradient(135deg, ${accent}22 0%, ${accent2}22 100%)` }}>
        <div style={S.ctaBannerInner}>
          <h2 style={S.ctaBannerH}>{ctaHeading}</h2>
          <p style={S.ctaBannerP}>{ctaSub}</p>
          <Link href="/page-contact" style={{ ...S.ctaBannerBtn, background: accent, boxShadow: `0 8px 30px ${accent}44` }} className="sv-cta">
            Start a Project →
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ── Styles (light theme) ── */
const S = {
  page: { position: 'relative', background: BG, color: '#141414', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' },
  glowWrap: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 },
  glow: { position: 'absolute', borderRadius: '50%' },

  hero: { position: 'relative', zIndex: 1, padding: '130px 0 70px' },
  heroInner: { maxWidth: 1300, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' },
  heroLeft: { flex: 1, minWidth: 300 },
  heroRight: { flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center', position: 'relative' },
  eyebrow: { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', marginBottom: 18, textTransform: 'uppercase' },
  heroH1: { fontSize: 'clamp(38px,5vw,68px)', fontWeight: 900, lineHeight: 1.08, margin: '0 0 20px', letterSpacing: '-0.02em', color: '#141414' },
  heroSub: { color: '#666', fontSize: 16, lineHeight: 1.7, margin: '0 0 26px', maxWidth: 460 },
  tagsWrap: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 30 },
  tag: { padding: '6px 14px', background: '#f2f3f5', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, fontSize: 12, color: '#555' },
  heroBtns: { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' },
  cta: { display: 'inline-flex', alignItems: 'center', padding: '15px 34px', borderRadius: 50, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 800, letterSpacing: '0.06em' },
  ctaGhost: { color: '#333', textDecoration: 'none', fontSize: 14, fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.25)', paddingBottom: 2 },

  metricsBand: { position: 'relative', zIndex: 1, padding: '48px 0', borderTop: '1px solid rgba(0,0,0,0.07)', borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#fafafa' },
  metricsInner: { maxWidth: 1200, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 },
  metric: { textAlign: 'center', padding: '0 16px' },
  metricN: { display: 'block', fontSize: 'clamp(28px,3.4vw,44px)', fontWeight: 900, letterSpacing: '-0.02em', background: 'linear-gradient(120deg,#141414,#555)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  metricL: { display: 'block', color: '#888', fontSize: 13, marginTop: 6, fontWeight: 500 },

  marqueeWrap: { position: 'relative', zIndex: 1, overflow: 'hidden', padding: '26px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)' },
  marqueeTrack: { display: 'flex', width: 'max-content' },
  marqueeItem: { display: 'inline-flex', alignItems: 'center', fontSize: 22, fontWeight: 800, color: 'rgba(0,0,0,0.18)', whiteSpace: 'nowrap' },
  marqueeDot: { margin: '0 28px', fontSize: 12 },

  altSection: { position: 'relative', zIndex: 1, padding: '90px 0' },
  altInner: { maxWidth: 1300, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: 80, flexWrap: 'wrap' },
  altText: { flex: 1, minWidth: 260 },
  altKicker: { display: 'inline-block', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', marginBottom: 12, opacity: 0.8 },
  altH2: { fontSize: 'clamp(26px,3vw,42px)', fontWeight: 800, margin: '0 0 20px', lineHeight: 1.2, letterSpacing: '-0.02em', color: '#141414' },
  altP: { color: '#666', fontSize: 15, lineHeight: 1.8, margin: 0, maxWidth: 440 },
  altMock: { flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' },

  processSection: { position: 'relative', zIndex: 1, padding: '100px 48px', background: '#f6f7f9', textAlign: 'center' },
  processHead: { maxWidth: 700, margin: '0 auto 56px' },
  processTitle: { fontSize: 'clamp(28px,3.4vw,46px)', fontWeight: 900, margin: '8px 0 0', letterSpacing: '-0.02em', color: '#141414' },
  processGrid: { maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 },
  processCard: { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '32px 24px', textAlign: 'left', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' },
  processStep: { fontSize: 44, fontWeight: 900, color: 'rgba(0,0,0,0.08)', lineHeight: 1 },
  processCardTitle: { color: '#141414', fontSize: 19, fontWeight: 800, margin: '14px 0 10px' },
  processCardDesc: { color: '#777', fontSize: 13.5, lineHeight: 1.7, margin: 0 },

  capsSection: { position: 'relative', zIndex: 1, padding: '100px 0', textAlign: 'center' },
  capsHeading: { fontSize: 13, fontWeight: 800, letterSpacing: '0.24em', color: '#bbb', textTransform: 'uppercase', marginBottom: 48 },
  capsGrid: { maxWidth: 1100, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 },
  capCard: { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '36px 28px', textAlign: 'left', transition: 'all 0.25s', cursor: 'default', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' },
  capIcon: { width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 },
  capTitle: { color: '#141414', fontSize: 18, fontWeight: 700, margin: '0 0 12px' },
  capDesc: { color: '#777', fontSize: 14, lineHeight: 1.7, margin: '0 0 24px' },
  capArrow: { fontSize: 22, fontWeight: 700 },

  ctaBanner: { position: 'relative', zIndex: 1, padding: '110px 48px', borderTop: '1px solid rgba(0,0,0,0.07)' },
  ctaBannerInner: { maxWidth: 720, margin: '0 auto', textAlign: 'center' },
  ctaBannerH: { fontSize: 'clamp(30px,4vw,54px)', fontWeight: 900, margin: '0 0 16px', letterSpacing: '-0.02em', color: '#141414' },
  ctaBannerP: { color: '#666', fontSize: 16, lineHeight: 1.7, margin: '0 0 36px' },
  ctaBannerBtn: { display: 'inline-flex', alignItems: 'center', padding: '16px 42px', borderRadius: 50, color: '#fff', textDecoration: 'none', fontSize: 15, fontWeight: 800 },
};

const M = {
  window: { background: '#0d1117', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 16, overflow: 'hidden', minWidth: 300, maxWidth: 360, boxShadow: '0 30px 60px rgba(0,0,0,0.18)' },
  winBar: { display: 'flex', alignItems: 'center', gap: 7, padding: '12px 16px', background: '#161b22', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  dot: { width: 11, height: 11, borderRadius: '50%' },
  winTitle: { marginLeft: 10, color: '#888', fontSize: 12 },
  code: { margin: 0, padding: '18px 16px', fontSize: 13, fontFamily: 'Menlo, Consolas, monospace', lineHeight: 1.9 },
  lineNo: { color: '#30363d', width: 24, display: 'inline-block', userSelect: 'none' },

  card: { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: 24, minWidth: 280, maxWidth: 340, boxShadow: '0 30px 60px rgba(0,0,0,0.1)' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { color: '#141414', fontSize: 14, fontWeight: 700 },
  bars: { display: 'flex', gap: 8, alignItems: 'flex-end' },

  searchBar: { display: 'flex', alignItems: 'center', gap: 10, background: '#f2f3f5', borderRadius: 10, padding: '10px 14px', marginBottom: 14 },
  searchRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' },

  gauge: { width: 64, height: 64, borderRadius: '50%', border: '4px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', background: '#fafafa' },

  phone: { width: 220, background: '#fff', border: '8px solid #1a1a1a', borderRadius: 34, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.25)', position: 'relative' },
  phoneNotch: { position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 70, height: 5, background: '#1a1a1a', borderRadius: 4, zIndex: 2 },
  phoneHeader: { padding: '22px 16px 14px', display: 'flex', justifyContent: 'center' },
  phoneCard: { display: 'flex', alignItems: 'center', gap: 10, background: '#f4f4f6', borderRadius: 12, padding: 10, marginBottom: 10 },
  phoneAvatar: { width: 34, height: 34, borderRadius: '50%' },
  phoneBtn: { textAlign: 'center', color: '#fff', fontWeight: 800, fontSize: 13, padding: '11px 0', borderRadius: 12, marginTop: 4 },

  check: { width: 20, height: 20, borderRadius: '50%', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
};
