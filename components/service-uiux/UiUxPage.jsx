'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const PURPLE = '#7c3aed';
const VIOLET = '#8b5cf6';
const BLUE   = '#3b82f6';
const CYAN   = '#22d3ee';
const PINK   = '#ec4899';
const INK    = '#14142b';
const MUTE   = '#6b7280';
const NAVY   = '#171738';

const grad = (a, b) => ({
  background: `linear-gradient(95deg, ${a}, ${b})`,
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
});

const TAGS = ['User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing'];

const METRICS = [
  { i: '🚀', n: '2x',    l: 'Higher Conversions' },
  { i: '📱', n: '120+',  l: 'Products Designed' },
  { i: '⭐', n: '4.8★',  l: 'Avg. User Rating' },
  { i: '💙', n: '40%',   l: 'Less Drop Off' },
];

const TOOLS = ['Adobe XD', 'Figma', 'Sketch', 'Framer', 'Design Systems', 'Prototyping', 'Wireframes', 'User Testing', 'Interaction Design'];

const PROCESS = [
  { n: '01', i: '🔍', t: 'Research',  d: 'Understand your users, market & competitors.' },
  { n: '02', i: '🔲', t: 'Wireframe', d: 'Map the structure and flow before visuals.' },
  { n: '03', i: '✏️', t: 'Design',    d: 'Pixel perfect, on-brand interface design.' },
  { n: '04', i: '🧪', t: 'Test',      d: 'Validate with real users and refine.' },
];

const CAPS = [
  { i: '🖥️', t: 'Web & App UI',      d: 'Interfaces designed for clarity, beauty and speed.' },
  { i: '👥', t: 'UX Research',        d: 'User flows, journey maps & usability testing.' },
  { i: '🧩', t: 'Design Systems',     d: 'Reusable component libraries that scale with you.' },
  { i: '✨', t: 'Interaction Design', d: 'Micro-interactions that make every tap delightful.' },
];

/* ── Hero art: phone + project card + rating badge ── */
function HeroArt() {
  return (
    <div style={S.artWrap}>
      {/* phone */}
      <div style={S.phone} className="ux-float">
        <div style={S.phoneNotch} />
        <div style={S.phoneScreen}>
          <div style={S.phoneTop}>
            <span style={{ fontSize: 9, opacity: 0.7 }}>‹‹</span>
            <span style={{ fontSize: 10, fontWeight: 700 }}>MyApp</span>
            <span style={{ fontSize: 9, opacity: 0.7 }}>⋯</span>
          </div>
          <div style={S.phoneHeadline}>Track.<br />Manage.<br />Grow.</div>
          <div style={S.phoneBars}>
            {[100, 70, 88].map((w, i) => (
              <div key={i} style={{ ...S.phoneBar, width: `${w}%` }} />
            ))}
          </div>
          <div style={S.phoneCta}>Get Started</div>
          <div style={S.phoneCard}>
            <div style={{ fontSize: 8, color: MUTE }}>Total Users</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: INK }}>24.6k</span>
              <span style={{ fontSize: 7.5, color: '#16a34a', fontWeight: 700 }}>↑ 12%</span>
            </div>
            <div style={S.miniBars}>
              {[38, 58, 46, 72, 60, 88].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 2,
                  background: i === 5 ? PURPLE : `rgba(124,58,237,${0.25 + i * 0.09})` }} />
              ))}
            </div>
          </div>
          <div style={S.phoneNav}>
            {['▦', '◔', '☰', '◍'].map((g, i) => (
              <span key={i} style={{ opacity: i === 0 ? 1 : 0.4, fontSize: 10 }}>{g}</span>
            ))}
          </div>
        </div>
      </div>

      {/* project overview card */}
      <div style={S.projCard} className="ux-float-slow">
        <div style={{ fontSize: 10.5, fontWeight: 800, color: INK, marginBottom: 10 }}>Project Overview</div>
        <div style={S.projBars}>
          {[40, 62, 50, 78, 66, 92, 74].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0',
              background: `linear-gradient(180deg,${VIOLET},${BLUE})`, opacity: 0.35 + i * 0.09 }} />
          ))}
        </div>
        <div style={S.avatarRow}>
          {['#c4b5fd', '#a5b4fc', '#93c5fd', '#f9a8d4'].map((c, i) => (
            <span key={i} style={{ ...S.avatar, background: c, marginLeft: i ? -8 : 0 }} />
          ))}
          <span style={S.avatarMore}>+3</span>
        </div>
        {[['UI Design', '#ede9fe'], ['Development', '#e0e7ff'], ['Marketing', '#fce7f3']].map(([l, c]) => (
          <div key={l} style={S.projRow}>
            <span style={{ ...S.projDot, background: c }} />
            <span style={{ flex: 1 }}>{l}</span>
            <span style={{ color: '#c7c7d6' }}>›</span>
          </div>
        ))}
      </div>

      {/* rating badge */}
      <div style={S.rateBadge} className="ux-float-fast">
        <div style={{ fontSize: 13, fontWeight: 900, color: INK }}>4.8★</div>
        <div style={{ fontSize: 7.5, color: MUTE }}>User Rating</div>
      </div>

      {/* soft blobs */}
      <span style={{ ...S.blob, background: VIOLET, top: 30, left: -10 }} />
      <span style={{ ...S.blob, background: BLUE, bottom: 20, right: 10 }} />
    </div>
  );
}

/* ── Row 01 art: research cards + satisfaction donut ── */
function ResearchArt() {
  const R = 34, C = 2 * Math.PI * R;
  return (
    <div style={S.researchWrap}>
      <div style={S.researchCards}>
        {[['User Research', '#c4b5fd'], ['Personas', '#a5b4fc'], ['Journey Mapping', '#93c5fd']].map(([l, c], i) => (
          <div key={l} style={{ ...S.researchCard, marginLeft: i * 16 }} className={i === 1 ? 'ux-float-slow' : 'ux-float'}>
            <span style={{ ...S.avatar, background: c, width: 26, height: 26 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: INK }}>{l}</span>
          </div>
        ))}
      </div>
      <div style={S.satCard}>
        <div style={{ fontSize: 11, fontWeight: 800, color: INK, marginBottom: 12 }}>User Satisfaction</div>
        <svg width="96" height="96" viewBox="0 0 96 96" style={{ display: 'block', margin: '0 auto' }}>
          <defs>
            <linearGradient id="ux-donut" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={PURPLE} /><stop offset="1" stopColor={BLUE} />
            </linearGradient>
          </defs>
          <circle cx="48" cy="48" r={R} fill="none" stroke="#eeeef6" strokeWidth="10" />
          <circle cx="48" cy="48" r={R} fill="none" stroke="url(#ux-donut)" strokeWidth="10"
            strokeLinecap="round" strokeDasharray={`${C * 0.98} ${C}`} transform="rotate(-90 48 48)" />
          <text x="48" y="46" textAnchor="middle" fontSize="17" fontWeight="800" fill={INK}>98%</text>
          <text x="48" y="60" textAnchor="middle" fontSize="7" fill={MUTE}>Happy Users</text>
        </svg>
        <div style={S.satBars}>
          {[30, 42, 36, 54, 48, 70, 100].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 2,
              background: i === 6 ? `linear-gradient(180deg,${PURPLE},${BLUE})` : '#e6e6f2' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Row 02 art: three phones ── */
function PhonesArt() {
  return (
    <div style={S.phonesWrap}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ ...S.miniPhone, ...(i === 1 ? S.miniPhoneFront : {}) }}>
          <div style={S.miniNotch} />
          <div style={{ fontSize: 8, fontWeight: 700, color: INK, textAlign: 'center', marginBottom: 8 }}>MyApp</div>
          {[0, 1, 2, 3].map(j => (
            <div key={j} style={{ ...S.miniLine, width: j === 0 ? '85%' : j === 3 ? '55%' : '70%' }} />
          ))}
          {i === 1 && <div style={S.miniBtn}>Get Started</div>}
        </div>
      ))}
    </div>
  );
}

function GrowthChart() {
  const bars = [36, 48, 42, 62, 78, 100];
  return (
    <div style={S.growthCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: INK }}>Organic Growth</span>
        <span style={{ fontSize: 10, fontWeight: 800, color: '#16a34a' }}>+ 215%</span>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 82, marginTop: 12 }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0',
            background: i === 5 ? `linear-gradient(180deg,${PURPLE},${VIOLET})` : `rgba(139,92,246,${0.2 + i * 0.11})` }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {['Jan','Feb','Mar','Apr','May','Jun'].map(m => (
          <span key={m} style={{ fontSize: 8, color: '#a3a3b8' }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

const Check = ({ children, light }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}>
    <span style={{ ...S.tick, background: light ? 'rgba(255,255,255,0.15)' : '#ede9fe', color: light ? '#c4b5fd' : PURPLE }}>✓</span>
    <span style={{ fontSize: 12.5, color: light ? 'rgba(255,255,255,0.85)' : '#4b5563' }}>{children}</span>
  </div>
);

export default function UiUxPage() {
  const [hov, setHov] = useState(null);

  return (
    <div style={S.page}>
      {/* ── HERO ── */}
      <section style={S.hero}>
        <div style={S.heroInner} className="ux-hero">
          <div style={S.heroLeft}>
            <span style={S.pill}>UI / UX DESIGN</span>
            <h1 style={S.h1}>
              Designs People<br />
              <span style={grad(PURPLE, PINK)}>Actually Enjoy</span><br />
              <span style={grad(BLUE, PURPLE)}>Using</span>
            </h1>
            <p style={S.sub}>
              We design interfaces that feel effortless — beautiful to look at, obvious to use,
              and built to turn visitors into customers.
            </p>
            <div style={S.tagRow}>
              {TAGS.map(t => <span key={t} style={S.tag}>{t}</span>)}
            </div>
            <div style={S.btnRow}>
              <Link href="/page-contact" style={S.btnPrimary} className="ux-btn">
                Enquire Now <span style={S.btnArrow}>→</span>
              </Link>
              <a href="#process" style={S.btnGhost}>
                <span style={S.playDot}>▶</span> See how we work
              </a>
            </div>
          </div>
          <div style={S.heroRight}><HeroArt /></div>
        </div>

        {/* metrics card */}
        <div style={S.metricsCard} className="ux-metrics">
          {METRICS.map(m => (
            <div key={m.l} style={S.metric}>
              <div style={S.metricIcon}>{m.i}</div>
              <div style={S.metricN}>{m.n}</div>
              <div style={S.metricL}>{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOOLS STRIP ── */}
      <section style={S.strip}>
        <div style={S.stripInner} className="ux-strip">
          {TOOLS.map((t, i) => (
            <React.Fragment key={t}>
              <span style={S.stripItem}>
                <span style={S.stripIcon}>◈</span> {t}
              </span>
              {i < TOOLS.length - 1 && <span style={S.stripDot} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── 01 USER-CENTRIC ── */}
      <section style={S.rowSection}>
        <div style={S.rowInner} className="ux-row">
          <div style={S.rowText}>
            <div style={S.kicker}><b style={{ color: PURPLE }}>01</b> USER-CENTRIC APPROACH</div>
            <h2 style={S.rowH}>Design that starts<br />with your <span style={grad(BLUE, CYAN)}>users</span></h2>
            <p style={S.rowP}>
              We research who your users are and what they actually need before a single pixel is
              drawn — so the final design solves real problems, not assumed ones.
            </p>
            <div style={{ marginTop: 14 }}>
              <Check>User Research &amp; Insights</Check>
              <Check>Persona &amp; Journey Mapping</Check>
              <Check>Data-driven Design Decisions</Check>
            </div>
          </div>
          <div style={S.rowArt}><ResearchArt /></div>
        </div>
      </section>

      {/* ── 02 PROTOTYPE PANEL ── */}
      <section style={S.panelSection}>
        <div style={S.panel} className="ux-row">
          <div style={S.panelArt}>
            <PhonesArt />
            <div style={S.fidelityRow}>
              {['Low Fidelity', 'Interactive Prototype', 'Pixel Perfect'].map((f, i) => (
                <span key={f} style={{ ...S.fidelity, ...(i === 1 ? S.fidelityActive : {}) }}>{f}</span>
              ))}
            </div>
          </div>
          <div style={S.panelText}>
            <div style={S.kicker}><b style={{ color: PURPLE }}>02</b> PROTOTYPE &amp; VISUALIZE</div>
            <h2 style={S.rowH}>Prototypes you can <span style={grad(PINK, '#f97316')}>feel</span></h2>
            <p style={S.rowP}>
              Interactive prototypes let you click through the product before development begins.
              Fix problems in design, where changes cost minutes instead of weeks.
            </p>
            <Link href="/portfolio-masonry" style={{ ...S.btnPrimary, marginTop: 22 }} className="ux-btn">
              View Case Studies <span style={S.btnArrow}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 03 + 04 TWO-UP ── */}
      <section style={S.twoUpSection}>
        <div style={S.twoUp} className="ux-twoup">
          {/* dark card */}
          <div style={S.darkCard}>
            <div style={{ ...S.kicker, color: 'rgba(255,255,255,0.6)' }}>
              <b style={{ color: VIOLET }}>03</b> CONSISTENCY AT SCALE
            </div>
            <h2 style={{ ...S.rowH, color: '#fff' }}>Consistency at <span style={grad(CYAN, BLUE)}>scale</span></h2>
            <p style={{ ...S.rowP, color: 'rgba(255,255,255,0.65)' }}>
              We build proper design systems — reusable components, typescales and UI patterns —
              so your product stays coherent as it grows.
            </p>
            <div style={{ marginTop: 14, position: 'relative', zIndex: 2 }}>
              <Check light>Design Systems</Check>
              <Check light>Component Library</Check>
              <Check light>Brand Consistency</Check>
            </div>
            {/* isometric tiles */}
            <div style={S.isoWrap} aria-hidden>
              {[[0, 40], [46, 12], [92, 44], [30, 88], [78, 96], [120, 68]].map(([x, y], i) => (
                <span key={i} style={{ ...S.isoTile, left: x, top: y, opacity: 0.25 + (i % 3) * 0.25 }} />
              ))}
            </div>
          </div>

          {/* light card */}
          <div style={S.lightCard}>
            <div style={S.kicker}><b style={{ color: PURPLE }}>04</b> DESIGNED TO CONVERT</div>
            <h2 style={S.rowH}>Designed to <span style={grad(PURPLE, VIOLET)}>convert</span></h2>
            <p style={S.rowP}>
              Clear hierarchy, effortless calls to action and frictionless flows. Great design is
              not decoration — it is measurable business results.
            </p>
            <div style={S.convertRow}>
              <div>
                <Check>Higher Engagement</Check>
                <Check>Better Retention</Check>
                <Check>More Conversions</Check>
              </div>
              <GrowthChart />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section id="process" style={S.processSection}>
        <div style={S.processEyebrow}>HOW WE WORK</div>
        <h2 style={S.processH}>Our proven <span style={grad(PURPLE, PINK)}>process.</span></h2>
        <div style={S.processRow} className="ux-process">
          {PROCESS.map((p, i) => (
            <React.Fragment key={p.n}>
              <div style={S.pCard}>
                <div style={S.pTop}>
                  <span style={S.pNum}>{p.n}</span>
                  <span style={S.pIcon}>{p.i}</span>
                </div>
                <div style={S.pTitle}>{p.t}</div>
                <div style={S.pDesc}>{p.d}</div>
              </div>
              {i < PROCESS.length - 1 && <span style={S.pArrow} className="ux-arrow">›</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section style={S.capsSection}>
        <div style={S.capsLabel}>OUR CAPABILITIES</div>
        <div style={S.capsGrid} className="ux-caps">
          {CAPS.map((c, i) => (
            <div
              key={c.t}
              style={{ ...S.capCard, transform: hov === i ? 'translateY(-6px)' : 'none' }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            >
              <div style={S.capIcon}>{c.i}</div>
              <h3 style={S.capT}>{c.t}</h3>
              <p style={S.capD}>{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={S.ctaSection}>
        <div style={S.ctaBanner} className="ux-cta">
          <div style={S.ctaText}>
            <h2 style={S.ctaH}>
              Ready to design something<br />
              <span style={grad(VIOLET, PINK)}>great?</span>
            </h2>
            <p style={S.ctaP}>Let&apos;s turn your idea into an experience your users will love.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/page-contact" style={S.ctaBtn} className="ux-btn">
                Start a Project <span style={{ marginLeft: 8 }}>→</span>
              </Link>
              <Link href="/portfolio-masonry" style={S.ctaBtnGhost}>View Portfolio</Link>
            </div>
          </div>
          <div style={S.ctaArt} aria-hidden>
            <div style={{ ...S.ctaScreen, width: 132, height: 92, background: 'linear-gradient(150deg,#6d28d9,#3b82f6)' }} />
            <div style={{ ...S.ctaScreen, width: 74, height: 118, background: 'linear-gradient(150deg,#8b5cf6,#ec4899)', marginLeft: -14, marginTop: 22 }} />
            <div style={{ ...S.ctaScreen, width: 46, height: 78, background: 'linear-gradient(150deg,#22d3ee,#3b82f6)', marginLeft: -10, marginTop: 40 }} />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes uxFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes uxFloatSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes uxFloatFast { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .ux-float{animation:uxFloat 5s ease-in-out infinite}
        .ux-float-slow{animation:uxFloatSlow 7s ease-in-out infinite}
        .ux-float-fast{animation:uxFloatFast 4s ease-in-out infinite}
        .ux-btn{transition:transform .2s, box-shadow .2s}
        .ux-btn:hover{transform:translateY(-3px)}
        @media(max-width:1024px){
          .ux-hero{flex-direction:column;gap:50px}
          .ux-row{flex-direction:column !important;gap:40px}
          .ux-twoup{grid-template-columns:1fr !important}
          .ux-caps{grid-template-columns:1fr 1fr !important}
          .ux-process{flex-wrap:wrap;justify-content:center}
          .ux-arrow{display:none}
          .ux-cta{flex-direction:column;text-align:center}
        }
        @media(max-width:760px){
          .ux-metrics{grid-template-columns:1fr 1fr !important}
          .ux-caps{grid-template-columns:1fr !important}
          .ux-strip{overflow-x:auto;justify-content:flex-start}
        }
        @media(prefers-reduced-motion:reduce){
          .ux-float,.ux-float-slow,.ux-float-fast{animation:none !important}
        }
      `}</style>
    </div>
  );
}

/* ── Styles ── */
const S = {
  page: { background: '#fff', color: INK, fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' },

  hero: { position: 'relative', padding: '110px 24px 0', background: 'linear-gradient(165deg,#f3f0ff 0%,#eef2ff 45%,#fdf2f8 100%)' },
  heroInner: { maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' },
  heroLeft: { flex: '1 1 420px', minWidth: 300 },
  heroRight: { flex: '1 1 420px', minWidth: 300, display: 'flex', justifyContent: 'center' },
  pill: { display: 'inline-block', padding: '6px 14px', background: 'rgba(124,58,237,0.1)', color: PURPLE, borderRadius: 20, fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', marginBottom: 20 },
  h1: { fontSize: 'clamp(36px,5vw,58px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.025em', margin: '0 0 20px' },
  sub: { color: MUTE, fontSize: 15, lineHeight: 1.75, margin: '0 0 22px', maxWidth: 420 },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  tag: { padding: '6px 13px', background: 'rgba(255,255,255,0.75)', border: '1px solid #e6e3f5', borderRadius: 20, fontSize: 11.5, color: '#555', fontWeight: 500 },
  btnRow: { display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', paddingBottom: 40 },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: 9, padding: '13px 24px', borderRadius: 28, color: '#fff', textDecoration: 'none', fontSize: 13.5, fontWeight: 700, background: `linear-gradient(95deg,${PURPLE},${VIOLET})`, boxShadow: `0 10px 26px ${PURPLE}44` },
  btnArrow: { width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 },
  btnGhost: { display: 'inline-flex', alignItems: 'center', gap: 10, color: INK, textDecoration: 'none', fontSize: 13.5, fontWeight: 700 },
  playDot: { width: 30, height: 30, borderRadius: '50%', background: PURPLE, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 },

  /* hero art */
  artWrap: { position: 'relative', width: 420, maxWidth: '100%', height: 400 },
  blob: { position: 'absolute', width: 130, height: 130, borderRadius: '50%', filter: 'blur(60px)', opacity: 0.22 },
  phone: { position: 'absolute', top: 10, left: 60, width: 178, height: 350, borderRadius: 26, background: '#12122b', padding: 7, boxShadow: '0 30px 60px rgba(20,20,43,0.3)', zIndex: 3 },
  phoneNotch: { position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 54, height: 5, borderRadius: 4, background: 'rgba(255,255,255,0.25)', zIndex: 2 },
  phoneScreen: { width: '100%', height: '100%', borderRadius: 20, background: 'linear-gradient(170deg,#3b2a80,#1e1b4b)', padding: '22px 12px 10px', color: '#fff', position: 'relative', overflow: 'hidden' },
  phoneTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  phoneHeadline: { fontSize: 19, fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.02em' },
  phoneBars: { marginTop: 10, marginBottom: 12 },
  phoneBar: { height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.22)', marginBottom: 5 },
  phoneCta: { background: VIOLET, borderRadius: 20, textAlign: 'center', fontSize: 9.5, fontWeight: 800, padding: '7px 0', marginBottom: 12 },
  phoneCard: { background: '#fff', borderRadius: 12, padding: 10 },
  miniBars: { display: 'flex', gap: 3, alignItems: 'flex-end', height: 40, marginTop: 8 },
  phoneNav: { position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'space-around' },

  projCard: { position: 'absolute', top: 34, right: -10, width: 172, background: '#fff', borderRadius: 14, padding: 14, boxShadow: '0 22px 50px rgba(20,20,43,0.16)', zIndex: 4 },
  projBars: { display: 'flex', gap: 4, alignItems: 'flex-end', height: 58, marginBottom: 12 },
  avatarRow: { display: 'flex', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 22, height: 22, borderRadius: '50%', border: '2px solid #fff', display: 'inline-block' },
  avatarMore: { fontSize: 8, color: MUTE, marginLeft: 6, fontWeight: 700 },
  projRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 9.5, color: '#4b5563', padding: '5px 0', fontWeight: 600 },
  projDot: { width: 16, height: 16, borderRadius: 5, display: 'inline-block' },
  rateBadge: { position: 'absolute', top: 168, right: -34, background: '#fff', borderRadius: 12, padding: '8px 12px', textAlign: 'center', boxShadow: '0 14px 32px rgba(20,20,43,0.16)', zIndex: 5 },

  /* metrics */
  metricsCard: { position: 'relative', zIndex: 6, maxWidth: 900, margin: '0 auto', transform: 'translateY(40px)', background: '#fff', borderRadius: 16, padding: '24px 20px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, boxShadow: '0 22px 50px rgba(20,20,43,0.1)' },
  metric: { textAlign: 'center' },
  metricIcon: { fontSize: 20, marginBottom: 7 },
  metricN: { fontSize: 23, fontWeight: 900, color: INK, letterSpacing: '-0.02em' },
  metricL: { fontSize: 11.5, color: MUTE, marginTop: 3 },

  /* tools strip */
  strip: { padding: '62px 24px 18px', borderBottom: '1px solid #eeeef4' },
  stripInner: { maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  stripItem: { display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: '#4b5563', whiteSpace: 'nowrap' },
  stripIcon: { color: PURPLE, fontSize: 11 },
  stripDot: { width: 3, height: 3, borderRadius: '50%', background: '#d7d7e2', flexShrink: 0 },

  /* rows */
  rowSection: { padding: '62px 24px' },
  rowInner: { maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60 },
  rowText: { flex: '1 1 400px', minWidth: 280 },
  rowArt: { flex: '1 1 400px', minWidth: 300, display: 'flex', justifyContent: 'center' },
  kicker: { fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em', color: '#9ca3af', marginBottom: 12, display: 'flex', gap: 8 },
  rowH: { fontSize: 'clamp(23px,2.8vw,32px)', fontWeight: 900, letterSpacing: '-0.025em', margin: '0 0 12px', lineHeight: 1.18, color: INK },
  rowP: { fontSize: 13.5, lineHeight: 1.8, color: MUTE, margin: 0, maxWidth: 400 },
  tick: { width: 18, height: 18, borderRadius: '50%', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },

  /* research art */
  researchWrap: { position: 'relative', width: 400, maxWidth: '100%', height: 250 },
  researchCards: { position: 'absolute', left: 0, top: 30 },
  researchCard: { display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 12, padding: '9px 14px', marginBottom: 12, width: 160, boxShadow: '0 12px 30px rgba(20,20,43,0.1)' },
  satCard: { position: 'absolute', right: 0, top: 0, width: 180, background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 20px 46px rgba(20,20,43,0.12)' },
  satBars: { display: 'flex', gap: 4, alignItems: 'flex-end', height: 36, marginTop: 12 },

  /* panel 02 */
  panelSection: { padding: '20px 24px 62px' },
  panel: { maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 50, background: 'linear-gradient(120deg,#efeaff,#e8eeff)', borderRadius: 20, padding: '44px 46px' },
  panelArt: { flex: '1 1 400px', minWidth: 280 },
  panelText: { flex: '1 1 380px', minWidth: 280 },
  phonesWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  miniPhone: { width: 92, height: 168, background: '#fff', borderRadius: 14, padding: '16px 10px 10px', boxShadow: '0 14px 32px rgba(20,20,43,0.12)', position: 'relative', opacity: 0.75 },
  miniPhoneFront: { width: 108, height: 196, opacity: 1, zIndex: 2, boxShadow: '0 22px 46px rgba(20,20,43,0.2)' },
  miniNotch: { position: 'absolute', top: 7, left: '50%', transform: 'translateX(-50%)', width: 26, height: 3.5, borderRadius: 3, background: '#dcdcea' },
  miniLine: { height: 7, borderRadius: 4, background: '#edecf7', marginBottom: 7 },
  miniBtn: { marginTop: 10, background: VIOLET, color: '#fff', fontSize: 8, fontWeight: 800, textAlign: 'center', borderRadius: 14, padding: '6px 0' },
  fidelityRow: { display: 'flex', justifyContent: 'center', gap: 8, marginTop: 22, flexWrap: 'wrap' },
  fidelity: { padding: '7px 14px', background: '#fff', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#6b7280', boxShadow: '0 4px 14px rgba(20,20,43,0.06)' },
  fidelityActive: { background: '#dcd6f7', color: PURPLE },

  /* two-up */
  twoUpSection: { padding: '0 24px 62px' },
  twoUp: { maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, alignItems: 'stretch' },
  darkCard: { position: 'relative', overflow: 'hidden', background: `linear-gradient(150deg,${NAVY},#241f52)`, borderRadius: 18, padding: '30px 30px 34px' },
  lightCard: { background: '#fff', border: '1px solid #eeeef4', borderRadius: 18, padding: '30px', boxShadow: '0 12px 34px rgba(20,20,43,0.06)' },
  isoWrap: { position: 'absolute', right: 18, bottom: 10, width: 170, height: 150, opacity: 0.9 },
  isoTile: { position: 'absolute', width: 38, height: 38, borderRadius: 9, background: `linear-gradient(150deg,${VIOLET},${PURPLE})`, transform: 'rotate(45deg)', boxShadow: '0 8px 18px rgba(0,0,0,0.25)' },
  convertRow: { display: 'flex', gap: 18, alignItems: 'center', marginTop: 14, flexWrap: 'wrap' },
  growthCard: { flex: '1 1 190px', minWidth: 175, background: '#faf9ff', border: '1px solid #eeeef4', borderRadius: 12, padding: 14 },

  /* process */
  processSection: { padding: '10px 24px 56px', textAlign: 'center' },
  processEyebrow: { fontSize: 10.5, fontWeight: 800, letterSpacing: '0.18em', color: '#9ca3af', marginBottom: 10 },
  processH: { fontSize: 'clamp(24px,3vw,34px)', fontWeight: 900, letterSpacing: '-0.025em', margin: '0 0 40px', color: INK },
  processRow: { maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: 8 },
  pCard: { flex: 1, minWidth: 180, background: '#fff', border: '1px solid #eeeef4', borderRadius: 14, padding: '18px 18px 20px', textAlign: 'left', boxShadow: '0 8px 24px rgba(20,20,43,0.05)' },
  pTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  pNum: { fontSize: 21, fontWeight: 900, color: PURPLE, letterSpacing: '-0.02em' },
  pIcon: { width: 30, height: 30, borderRadius: 9, background: '#f1eefe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 },
  pTitle: { fontSize: 14.5, fontWeight: 800, color: INK, marginBottom: 6 },
  pDesc: { fontSize: 11.5, lineHeight: 1.6, color: MUTE },
  pArrow: { display: 'flex', alignItems: 'center', color: PURPLE, fontSize: 20, fontWeight: 700 },

  /* capabilities */
  capsSection: { padding: '0 24px 62px', textAlign: 'center' },
  capsLabel: { fontSize: 10.5, fontWeight: 800, letterSpacing: '0.2em', color: '#9ca3af', marginBottom: 26 },
  capsGrid: { maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 },
  capCard: { padding: '10px 12px', transition: 'transform .25s' },
  capIcon: { fontSize: 24, marginBottom: 12 },
  capT: { fontSize: 14, fontWeight: 800, color: INK, margin: '0 0 7px' },
  capD: { fontSize: 11.5, lineHeight: 1.65, color: MUTE, margin: 0 },

  /* CTA */
  ctaSection: { padding: '0 24px 60px' },
  ctaBanner: { maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 30, borderRadius: 18, padding: '40px 46px', background: `linear-gradient(115deg,#12122b 0%,#241f52 55%,#3b2a80 100%)`, overflow: 'hidden' },
  ctaText: { flex: '1 1 420px', minWidth: 280 },
  ctaH: { fontSize: 'clamp(23px,3vw,32px)', fontWeight: 900, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.025em', lineHeight: 1.2 },
  ctaP: { fontSize: 13.5, color: 'rgba(255,255,255,0.72)', margin: '0 0 22px' },
  ctaBtn: { display: 'inline-flex', alignItems: 'center', padding: '12px 26px', borderRadius: 28, background: `linear-gradient(95deg,${VIOLET},${PINK})`, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 800 },
  ctaBtnGhost: { display: 'inline-flex', alignItems: 'center', padding: '12px 26px', borderRadius: 28, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 },
  ctaArt: { display: 'flex', alignItems: 'flex-end', flexShrink: 0 },
  ctaScreen: { borderRadius: 10, boxShadow: '0 18px 40px rgba(0,0,0,0.35)' },
};
