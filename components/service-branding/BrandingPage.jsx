'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const CORAL  = '#f8593f';
const PINK   = '#ec4899';
const PURPLE = '#7c3aed';
const INK    = '#14142b';
const MUTE   = '#6b7280';
const LAV    = '#f3f3fd';

const gradText = (a, b) => ({
  background: `linear-gradient(95deg, ${a}, ${b})`,
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
});

/* ── Data ── */
const TAGS = ['Logo Design', 'Brand Identity', 'Brand Guideline', 'Packaging', 'Rebranding'];

const STACK = [
  { i: '🔍', l: 'Research',  c: '#fee2e2' },
  { i: '🎯', l: 'Strategy',  c: '#ede9fe' },
  { i: '🎨', l: 'Design',    c: '#e0e7ff' },
  { i: '💠', l: 'Identity',  c: '#fce7f3' },
  { i: '📦', l: 'Assets',    c: '#ffedd5' },
  { i: '🛟', l: 'Support',   c: '#e0e7ff' },
];

const METRICS = [
  { i: '🏆', n: '200+', l: 'Brands Built',        c: '#fee2e2' },
  { i: '📈', n: '3x',   l: 'Brand Recall',        c: '#ede9fe' },
  { i: '🏭', n: '15+',  l: 'Industries Served',   c: '#fce7f3' },
  { i: '⭐', n: '98%',  l: 'Client Satisfaction', c: '#e0e7ff' },
];

const WHAT_WE_DO = [
  { i: '✒️', l: 'Logo Design' },
  { i: '🎨', l: 'Colour Systems' },
  { i: '🔤', l: 'Typography' },
  { i: '📦', l: 'Packaging' },
  { i: '🗣️', l: 'Brand Voice' },
  { i: '📘', l: 'Guidelines' },
  { i: '📄', l: 'Stationery' },
  { i: '🔄', l: 'Rebranding' },
];

const PROCESS = [
  { n: '01', t: 'Discover', d: 'Understand your story, values & audience.' },
  { n: '02', t: 'Concept',  d: 'Explore directions and craft the core idea.' },
  { n: '03', t: 'Design',   d: 'Refine the logo and full identity system.' },
  { n: '04', t: 'Deliver',  d: 'All files, plus a clear brand guidelines book.' },
];

const CAPS = [
  { i: '✒️', t: 'Logo Design',      d: 'Distinctive marks built to last, in every format.' },
  { i: '💠', t: 'Brand Identity',   d: 'Colour, type and visual language as one system.' },
  { i: '📘', t: 'Brand Guidelines', d: 'A clear rulebook so your brand stays consistent.' },
];

/* ── Hero visual: stationery mockup + floating stack card ── */
function HeroArt() {
  return (
    <div style={S.artWrap}>
      {/* concentric dotted rings */}
      <svg style={S.rings} viewBox="0 0 220 220" aria-hidden>
        {[104, 84, 64, 44].map((r, i) => (
          <circle key={i} cx="110" cy="110" r={r} fill="none"
            stroke="#d8d8ea" strokeWidth="1" strokeDasharray="2 6" />
        ))}
      </svg>

      {/* small coral badge */}
      <span style={S.badgeDot} className="br-float"><span style={S.badgeInner} /></span>

      {/* dark stationery card */}
      <div style={S.folder}>
        <div style={S.folderSheen} />
        <div style={S.wordmarkWrap}>
          <svg width="46" height="30" viewBox="0 0 46 30" fill="none" aria-hidden>
            <path d="M3 27 L14 4 L23 20 L32 4 L43 27" stroke="#d9b673" strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={S.wordmark}>AURORA</div>
          <div style={S.wordmarkSub}>BRAND CLOTHING</div>
        </div>
        {/* gold pen */}
        <div style={S.pen} />
      </div>

      {/* small white card peeking */}
      <div style={S.miniCard}>
        <svg width="26" height="18" viewBox="0 0 46 30" fill="none" aria-hidden>
          <path d="M3 27 L14 4 L23 20 L32 4 L43 27" stroke="#b9925a" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* floating "Our Stack" card */}
      <div style={S.stackCard} className="br-float-slow">
        <div style={S.stackTitle}>Our Stack</div>
        <div style={S.stackGrid}>
          {STACK.map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ ...S.stackIcon, background: s.c }}>{s.i}</div>
              <div style={S.stackLabel}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Mock visuals for the four feature rows ── */
function ProductMock() {
  return (
    <div style={S.prodWrap}>
      <div style={S.prodBottle}>
        <div style={S.prodPump} />
        <div style={S.prodLabel}>Olivia</div>
        <div style={S.prodSub}>BOTANICAL SKINCARE</div>
      </div>
      <div style={S.prodBox}>
        <svg width="30" height="20" viewBox="0 0 46 30" fill="none" aria-hidden>
          <path d="M3 27 L14 4 L23 20 L32 4 L43 27" stroke="#9a8straight" strokeWidth="3" />
        </svg>
        <div style={S.prodBoxMark}>ᛜ</div>
      </div>
    </div>
  );
}

function ChartMock() {
  const bars = [34, 46, 40, 58, 52, 70, 64, 86, 100];
  return (
    <div style={S.card}>
      <div style={S.cardHead}>
        <span style={S.cardTitle}>Organic Growth</span>
        <span style={{ color: '#16a34a', fontSize: 12, fontWeight: 800 }}>+ 215%</span>
      </div>
      <div style={{ display: 'flex', gap: 7, alignItems: 'flex-end', height: 120, marginTop: 14 }}>
        {bars.map((h, i) => (
          <div key={i} style={{
            flex: 1, height: `${h}%`, borderRadius: '5px 5px 0 0',
            background: i === bars.length - 1
              ? `linear-gradient(180deg,${PURPLE},${PINK})`
              : `rgba(124,58,237,${0.22 + i * 0.06})`,
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        {['J','F','M','A','M','J','J','A','S'].map((m, i) => (
          <span key={i} style={{ color: '#a3a3b8', fontSize: 10 }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function ChecklistMock() {
  const items = ['Responsive on every device', 'Strong first impression', 'SEO-ready structure', 'Scalable & editable', 'Ongoing support'];
  return (
    <div style={S.card}>
      <div style={S.cardTitle}>What you get</div>
      <div style={{ marginTop: 12 }}>
        {items.map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 0' }}>
            <span style={S.check}>✓</span>
            <span style={{ color: '#4b5563', fontSize: 13 }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GaugeMock() {
  const g = [['Performance', 98, PURPLE], ['SEO', 96, PINK], ['Accessibility', 110, PURPLE], ['Best Practices', 100, PINK]];
  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Lighthouse Report</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 16 }}>
        {g.map(([l, v, c]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ ...S.gauge, borderColor: c }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: INK }}>{v}</span>
            </div>
            <div style={{ fontSize: 10.5, color: MUTE, marginTop: 7 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ROWS = [
  { n: '01', t: 'More than just a logo',  d: 'Your brand is your colour, typography, voice and the feeling people get when they meet you. We design the whole system, not just a mark.', M: ProductMock,  right: true,  bg: '#fff' },
  { n: '02', t: 'Built to be recognised', d: 'A distinctive identity makes you instantly recognisable and separates you from competitors who all look the same.',                        M: ChartMock,    right: false, bg: LAV   },
  { n: '03', t: 'Consistent everywhere',  d: 'Website, social media, packaging, print — we deliver clear guidelines so every touchpoint feels unmistakably you.',                        M: ChecklistMock, right: true,  bg: '#fff' },
  { n: '04', t: 'Ready for every format', d: 'Every logo ships in full vector with light, dark and single-colour variants, sized for everything from a favicon to a hoarding.',           M: GaugeMock,    right: false, bg: LAV   },
];

export default function BrandingPage() {
  const [hov, setHov] = useState(null);

  return (
    <div style={S.page}>
      {/* ── HERO ── */}
      <section style={S.hero}>
        <div style={S.heroInner} className="br-hero">
          <div style={S.heroLeft}>
            <span style={S.eyebrow}><span style={S.eyeDot} /> BRANDING &amp; IDENTITY</span>
            <h1 style={S.h1}>
              Brands People<br />
              <span style={gradText(CORAL, PINK)}>Remember</span> <span style={{ color: INK }}>&amp;</span><br />
              <span style={gradText(PINK, PURPLE)}>Trust</span>
            </h1>
            <p style={S.sub}>
              From logo to full identity system — we craft brands that stand out in a crowded
              market and turn first-time buyers into loyal customers.
            </p>
            <div style={S.tagRow}>
              {TAGS.map(t => <span key={t} style={S.tag}>{t}</span>)}
            </div>
            <div style={S.btnRow}>
              <Link href="/page-contact" style={S.btnPrimary} className="br-btn">
                Enquire Now
                <span style={S.btnArrow}>→</span>
              </Link>
              <a href="#process" style={S.btnGhost}>
                <span style={S.playDot}>▶</span> See how we work
              </a>
            </div>
          </div>
          <div style={S.heroRight}><HeroArt /></div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section style={S.metricsBand}>
        <div style={S.metricsInner} className="br-metrics">
          {METRICS.map((m, i) => (
            <React.Fragment key={m.l}>
              <div style={S.metric}>
                <div style={{ ...S.metricIcon, background: m.c }}>{m.i}</div>
                <div>
                  <div style={S.metricN}>{m.n}</div>
                  <div style={S.metricL}>{m.l}</div>
                </div>
              </div>
              {i < METRICS.length - 1 && <span style={S.metricDot} className="br-dot" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── WHAT WE DO strip ── */}
      <section style={S.stripSection}>
        <div style={S.stripInner}>
          <div style={S.stripLabel}>WHAT WE DO</div>
          <div style={S.strip} className="br-strip">
            {WHAT_WE_DO.map((w, i) => (
              <div key={w.l} style={{ ...S.stripItem, ...(i === 0 ? S.stripItemActive : {}) }}>
                <span style={{ ...S.stripIcon, ...(i === 0 ? { background: '#ffe4de' } : {}) }}>{w.i}</span>
                <span>{w.l}</span>
              </div>
            ))}
            <div style={{ ...S.stripItem, color: '#9ca3af' }}>⋯ &amp; More</div>
          </div>
        </div>
      </section>

      {/* ── FEATURE ROWS ── */}
      {ROWS.map(r => {
        const M = r.M;
        return (
          <section key={r.n} style={{ ...S.rowSection, background: r.bg }}>
            <div style={{ ...S.rowInner, flexDirection: r.right ? 'row' : 'row-reverse' }} className="br-row">
              <div style={S.rowText}>
                <div style={S.rowNum}>{r.n}</div>
                <h2 style={S.rowH}>{r.t}</h2>
                <p style={S.rowP}>{r.d}</p>
              </div>
              <div style={S.rowArt}><M /></div>
            </div>
          </section>
        );
      })}

      {/* ── PROCESS ── */}
      <section id="process" style={S.processSection}>
        <div style={S.processEyebrow}>HOW WE WORK</div>
        <h2 style={S.processH}>
          Our proven <span style={gradText(CORAL, PURPLE)}>process.</span>
        </h2>
        <div style={S.processRow} className="br-process">
          {PROCESS.map((p, i) => (
            <React.Fragment key={p.n}>
              <div style={S.pCard}>
                <div style={S.pNum}>{p.n}</div>
                <div style={S.pTitle}>{p.t}</div>
                <div style={S.pDesc}>{p.d}</div>
              </div>
              {i < PROCESS.length - 1 && <span style={S.pArrow} className="br-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section style={S.capsSection}>
        <div style={S.dotsLeft} aria-hidden />
        <div style={S.dotsRight} aria-hidden />
        <div style={S.capsLabel}>OUR CAPABILITIES</div>
        <div style={S.capsGrid} className="br-caps">
          {CAPS.map((c, i) => (
            <div
              key={c.t}
              style={{
                ...S.capCard,
                transform: hov === i ? 'translateY(-6px)' : 'none',
                boxShadow: hov === i ? '0 20px 44px rgba(124,58,237,0.14)' : '0 6px 20px rgba(20,20,43,0.05)',
              }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            >
              <div style={S.capIcon}>{c.i}</div>
              <div>
                <h3 style={S.capT}>{c.t}</h3>
                <p style={S.capD}>{c.d}</p>
                <Link href="/page-contact" style={S.capLink}>Explore <span>→</span></Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={S.ctaSection}>
        <div style={S.ctaBanner} className="br-cta">
          <div style={S.ctaArt} aria-hidden>
            <div style={S.ctaSketch}>
              <svg viewBox="0 0 120 90" style={{ width: '70%', opacity: 0.85 }}>
                <path d="M18 74 L40 20 L60 56 L80 20 L102 74" fill="none" stroke="#6b6b80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="60" cy="46" r="30" fill="none" stroke="#9a9ab0" strokeWidth="1" strokeDasharray="3 5" />
              </svg>
              <span style={S.ctaPencil} />
            </div>
          </div>
          <div style={S.ctaText}>
            <h2 style={S.ctaH}>Ready to build your brand?</h2>
            <p style={S.ctaP}>Let&apos;s create an identity your customers won&apos;t forget.</p>
            <Link href="/page-contact" style={S.ctaBtn} className="br-btn">
              Start a Project <span style={{ marginLeft: 8 }}>→</span>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes brFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes brFloatSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        .br-float{animation:brFloat 5s ease-in-out infinite}
        .br-float-slow{animation:brFloatSlow 7s ease-in-out infinite}
        .br-btn{transition:transform .2s, box-shadow .2s}
        .br-btn:hover{transform:translateY(-3px)}
        @media(max-width:1024px){
          .br-hero{flex-direction:column;gap:48px}
          .br-row{flex-direction:column !important;gap:40px}
          .br-caps{grid-template-columns:1fr !important}
          .br-process{flex-wrap:wrap;justify-content:center}
          .br-arrow{display:none}
          .br-cta{flex-direction:column}
        }
        @media(max-width:760px){
          .br-metrics{flex-wrap:wrap;gap:22px;justify-content:flex-start}
          .br-dot{display:none}
          .br-strip{overflow-x:auto}
        }
        @media(prefers-reduced-motion:reduce){
          .br-float,.br-float-slow{animation:none !important}
        }
      `}</style>
    </div>
  );
}

/* ── Styles ── */
const S = {
  page: { background: '#fff', color: INK, fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' },

  /* Hero */
  hero: { padding: '120px 24px 40px', maxWidth: 1240, margin: '0 auto' },
  heroInner: { display: 'flex', alignItems: 'center', gap: 50, flexWrap: 'wrap' },
  heroLeft: { flex: '1 1 420px', minWidth: 300 },
  heroRight: { flex: '1 1 420px', minWidth: 300, display: 'flex', justifyContent: 'center' },
  eyebrow: { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 800, letterSpacing: '0.14em', color: CORAL, marginBottom: 20 },
  eyeDot: { width: 7, height: 7, borderRadius: '50%', background: CORAL, display: 'inline-block' },
  h1: { fontSize: 'clamp(38px,5.2vw,62px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.025em', margin: '0 0 22px' },
  sub: { color: MUTE, fontSize: 15.5, lineHeight: 1.75, margin: '0 0 24px', maxWidth: 430 },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 30 },
  tag: { padding: '7px 14px', background: '#f4f4f7', border: '1px solid #e8e8ef', borderRadius: 20, fontSize: 12, color: '#555', fontWeight: 500 },
  btnRow: { display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 26px', borderRadius: 30, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, background: `linear-gradient(95deg, ${CORAL}, ${PINK})`, boxShadow: `0 10px 26px ${CORAL}44` },
  btnArrow: { width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 },
  btnGhost: { display: 'inline-flex', alignItems: 'center', gap: 10, color: INK, textDecoration: 'none', fontSize: 14, fontWeight: 700 },
  playDot: { width: 30, height: 30, borderRadius: '50%', border: '1px solid #e2e2ea', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: INK },

  /* Hero art */
  artWrap: { position: 'relative', width: 440, maxWidth: '100%', height: 380 },
  rings: { position: 'absolute', top: -30, right: -40, width: 220, height: 220, opacity: 0.85 },
  badgeDot: { position: 'absolute', top: -8, left: '46%', width: 34, height: 34, borderRadius: '50%', background: '#fff', boxShadow: '0 8px 20px rgba(20,20,43,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4 },
  badgeInner: { width: 13, height: 13, borderRadius: '50%', background: CORAL, display: 'block' },
  folder: { position: 'absolute', top: 40, left: 30, width: 330, height: 250, borderRadius: 14, background: 'linear-gradient(140deg,#20203a 0%,#101024 100%)', boxShadow: '0 30px 60px rgba(20,20,43,0.32)', overflow: 'hidden' },
  folderSheen: { position: 'absolute', inset: 0, background: 'linear-gradient(115deg,rgba(255,255,255,0.09) 0%,transparent 45%)' },
  wordmarkWrap: { position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' },
  wordmark: { color: '#d9b673', fontSize: 21, fontWeight: 500, letterSpacing: '0.34em', marginTop: 8, fontFamily: 'Georgia, serif' },
  wordmarkSub: { color: 'rgba(217,182,115,0.6)', fontSize: 7.5, letterSpacing: '0.32em', marginTop: 6 },
  pen: { position: 'absolute', top: 26, right: 26, width: 96, height: 5, borderRadius: 4, background: 'linear-gradient(90deg,#d9b673,#f0dcb0)', transform: 'rotate(-28deg)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' },
  miniCard: { position: 'absolute', bottom: 34, left: 0, width: 104, height: 74, background: '#f3efe6', borderRadius: 8, boxShadow: '0 14px 30px rgba(20,20,43,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  stackCard: { position: 'absolute', bottom: 8, right: -6, width: 214, background: '#fff', borderRadius: 16, padding: '15px 16px', boxShadow: '0 22px 50px rgba(20,20,43,0.16)', zIndex: 5 },
  stackTitle: { fontSize: 12.5, fontWeight: 800, color: INK, marginBottom: 12 },
  stackGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 },
  stackIcon: { width: 38, height: 38, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, margin: '0 auto 5px' },
  stackLabel: { fontSize: 8.5, color: MUTE, fontWeight: 600 },

  /* Metrics */
  metricsBand: { padding: '34px 24px', borderTop: '1px solid #eeeef4', borderBottom: '1px solid #eeeef4' },
  metricsInner: { maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 },
  metric: { display: 'flex', alignItems: 'center', gap: 14 },
  metricIcon: { width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 },
  metricN: { fontSize: 26, fontWeight: 900, color: INK, letterSpacing: '-0.02em', lineHeight: 1.1 },
  metricL: { fontSize: 12.5, color: MUTE, marginTop: 2 },
  metricDot: { width: 4, height: 4, borderRadius: '50%', background: '#d7d7e2' },

  /* What we do strip */
  stripSection: { padding: '30px 24px 6px' },
  stripInner: { maxWidth: 1180, margin: '0 auto' },
  stripLabel: { fontSize: 10.5, fontWeight: 800, letterSpacing: '0.16em', color: '#9ca3af', marginBottom: 16 },
  strip: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingBottom: 14, borderBottom: '1px solid #eeeef4' },
  stripItem: { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 600, color: '#4b5563', whiteSpace: 'nowrap', paddingBottom: 8 },
  stripItemActive: { color: CORAL, boxShadow: `inset 0 -2px 0 ${CORAL}` },
  stripIcon: { width: 26, height: 26, borderRadius: 7, background: '#f4f4f7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 },

  /* Feature rows */
  rowSection: { padding: '58px 24px' },
  rowInner: { maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 70 },
  rowText: { flex: '1 1 380px', minWidth: 260 },
  rowNum: { fontSize: 12.5, fontWeight: 900, color: CORAL, marginBottom: 10 },
  rowH: { fontSize: 'clamp(21px,2.4vw,28px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em', color: INK },
  rowP: { fontSize: 13.5, lineHeight: 1.85, color: MUTE, margin: 0, maxWidth: 380 },
  rowArt: { flex: '1 1 340px', minWidth: 280, display: 'flex', justifyContent: 'center' },

  /* Generic mock card */
  card: { background: '#fff', border: '1px solid #eeeef4', borderRadius: 16, padding: 20, width: 300, maxWidth: '100%', boxShadow: '0 16px 40px rgba(20,20,43,0.08)' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 13, fontWeight: 800, color: INK },
  check: { width: 19, height: 19, borderRadius: '50%', background: CORAL, color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  gauge: { width: 54, height: 54, borderRadius: '50%', border: '3px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', background: '#fafaff' },

  /* Product mock */
  prodWrap: { position: 'relative', width: 300, height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 18 },
  prodBottle: { width: 96, height: 172, borderRadius: '14px 14px 10px 10px', background: 'linear-gradient(160deg,#fdfcf8,#e9e4d8)', boxShadow: '0 18px 40px rgba(20,20,43,0.16)', position: 'relative', paddingTop: 54, textAlign: 'center' },
  prodPump: { position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', width: 26, height: 30, borderRadius: '5px 5px 0 0', background: '#2a2a3d' },
  prodLabel: { fontFamily: 'Georgia, serif', fontSize: 17, color: '#3a3a2f', letterSpacing: '0.04em' },
  prodSub: { fontSize: 6.5, letterSpacing: '0.24em', color: '#8a8a76', marginTop: 5 },
  prodBox: { width: 92, height: 118, borderRadius: 8, background: 'linear-gradient(160deg,#ffffff,#efece2)', boxShadow: '0 14px 34px rgba(20,20,43,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  prodBoxMark: { fontSize: 26, color: '#b9925a' },

  /* Process */
  processSection: { padding: '70px 24px 60px', textAlign: 'center' },
  processEyebrow: { fontSize: 10.5, fontWeight: 800, letterSpacing: '0.18em', color: CORAL, marginBottom: 10 },
  processH: { fontSize: 'clamp(24px,3vw,34px)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 44px', color: INK },
  processRow: { maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: 10 },
  pCard: { flex: 1, minWidth: 180, background: '#fff', border: '1px solid #eeeef4', borderRadius: 14, padding: '20px 18px', textAlign: 'left', boxShadow: '0 8px 24px rgba(20,20,43,0.05)' },
  pNum: { width: 32, height: 32, borderRadius: 9, background: '#f1eefe', color: PURPLE, fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  pTitle: { fontSize: 14.5, fontWeight: 800, color: INK, marginBottom: 6 },
  pDesc: { fontSize: 11.5, lineHeight: 1.65, color: MUTE },
  pArrow: { display: 'flex', alignItems: 'center', color: CORAL, fontSize: 16, fontWeight: 700 },

  /* Capabilities */
  capsSection: { position: 'relative', padding: '20px 24px 70px', textAlign: 'center' },
  capsLabel: { fontSize: 10.5, fontWeight: 800, letterSpacing: '0.2em', color: '#9ca3af', marginBottom: 26 },
  capsGrid: { maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 },
  capCard: { display: 'flex', gap: 14, textAlign: 'left', background: '#fff', border: '1px solid #eeeef4', borderRadius: 14, padding: '20px 18px', transition: 'all .25s' },
  capIcon: { width: 40, height: 40, borderRadius: 11, background: '#f1eefe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 },
  capT: { fontSize: 14.5, fontWeight: 800, color: INK, margin: '0 0 6px' },
  capD: { fontSize: 12, lineHeight: 1.65, color: MUTE, margin: '0 0 10px' },
  capLink: { fontSize: 11.5, fontWeight: 800, color: CORAL, textDecoration: 'none' },
  dotsLeft: { position: 'absolute', left: 18, top: 60, width: 70, height: 130, backgroundImage: 'radial-gradient(#e0e0ee 1.4px, transparent 1.4px)', backgroundSize: '13px 13px', opacity: 0.9 },
  dotsRight: { position: 'absolute', right: 18, top: 60, width: 70, height: 130, backgroundImage: 'radial-gradient(#e0e0ee 1.4px, transparent 1.4px)', backgroundSize: '13px 13px', opacity: 0.9 },

  /* CTA */
  ctaSection: { padding: '0 24px 70px' },
  ctaBanner: { maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'stretch', borderRadius: 18, overflow: 'hidden', minHeight: 230, boxShadow: '0 24px 60px rgba(20,20,43,0.14)' },
  ctaArt: { flex: '0 0 34%', background: 'linear-gradient(150deg,#e9e6e0,#d6d2ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  ctaSketch: { position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  ctaPencil: { position: 'absolute', right: '14%', bottom: '12%', width: 84, height: 7, borderRadius: 4, background: 'linear-gradient(90deg,#5a5a6e,#c9c9d6)', transform: 'rotate(38deg)' },
  ctaText: { flex: 1, background: `linear-gradient(110deg, ${CORAL} 0%, ${PINK} 48%, ${PURPLE} 100%)`, padding: '44px 46px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  ctaH: { fontSize: 'clamp(24px,3vw,34px)', fontWeight: 900, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' },
  ctaP: { fontSize: 14.5, color: 'rgba(255,255,255,0.92)', margin: '0 0 24px' },
  ctaBtn: { alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', padding: '13px 28px', borderRadius: 30, background: '#fff', color: INK, textDecoration: 'none', fontSize: 13.5, fontWeight: 800, boxShadow: '0 10px 26px rgba(0,0,0,0.18)' },
};
