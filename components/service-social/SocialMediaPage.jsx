'use client';
import { useState } from 'react';
import Link from 'next/link';

const ORANGE = '#f05a28';
const PURPLE = '#6c63ff';
const PINK   = '#e040fb';
const BG     = '#ffffff';
const BG2    = '#f6f7f9';

const TAGS = [
  'Content Designed For Reach',
  'Hook-Led Scripting',
  'Trend-Adaptive Content Engine',
  'Custom Visual Identity',
  'High-Impact Reels, Not Just Posts',
];

const METRICS = [
  { n: '28.9M+', l: 'Views Generated' },
  { n: '200+',   l: 'Brands Served' },
  { n: '7.1K+',  l: 'New Followers / mo' },
  { n: '24%',    l: 'Avg. Monthly Growth' },
];

const PLATFORMS = ['Instagram', 'YouTube', 'Facebook', 'LinkedIn', 'Threads', 'X', 'Pinterest', 'Snapchat'];

const PROCESS = [
  { step: '01', title: 'Discover', desc: 'We audit your brand, audience & competitors to find the winning angle.' },
  { step: '02', title: 'Create',   desc: 'Hook-led scripts, scroll-stopping reels & a custom visual identity.' },
  { step: '03', title: 'Publish',  desc: 'We handle posting, timing & engagement across every platform.' },
  { step: '04', title: 'Scale',    desc: 'We double down on what works — real views, reach & followers.' },
];

const CAPABILITIES = [
  { title: 'Performance Content',       desc: 'Scroll-stopping reels, carousels & posts built to convert.',                icon: '📈', color: ORANGE },
  { title: 'Social Media Management',   desc: 'Full-service handling of your pages — strategy, posting, engagement.',      icon: '📱', color: PURPLE },
  { title: 'Content Marketing',         desc: 'Brand storytelling that builds authority and loyal audiences.',            icon: '✍️', color: PINK   },
];

const REASONS = [
  { heading: 'Views & Followers is our KPI', body: "We don't just manage social — we grow it with real, trackable impact. No fluff metrics — just views, reach, and followers that move the needle.", mock: 'dashboard' },
  { heading: 'Unseen, Unkaha, Unsunna',      body: "Our content is fresh, original, and built to stop the scroll. No templates. No repeats. Just algorithm-loving creativity with viral potential.", mock: 'content' },
  { heading: "Maintain Brand's Sanity",      body: "Real people, real talk — no jargon, no ego. We're collaborators, not contractors — and we keep it fun, fast, and human.", mock: 'brand' },
  { heading: 'You Will Enjoy Working With Our Team', body: "Real people, real talk — no ghosting, no jargon. We're collaborators, not contractors — and we keep it fun, fast, and human.", mock: 'team' },
];

function renderMock(kind) {
  if (kind === 'dashboard') return <DashboardMock />;
  if (kind === 'content')   return <ContentMock />;
  if (kind === 'brand')     return <BrandMock />;
  return <TeamMock />;
}

export default function SocialMediaPage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={S.page}>
      {/* animated background glows */}
      <div style={S.glowWrap} aria-hidden>
        <div style={{ ...S.glow, ...S.glowA }} className="sm-glow" />
        <div style={{ ...S.glow, ...S.glowB }} className="sm-glow" />
        <div style={{ ...S.glow, ...S.glowC }} className="sm-glow" />
      </div>

      {/* ── HERO ── */}
      <section style={S.hero}>
        <div style={S.heroInner} className="hero-inner">
          <div style={S.heroLeft}>
            <span style={S.eyebrow}>✦ SOCIAL MEDIA MARKETING</span>
            <h1 style={S.heroH1}>
              Grow Your Brand<br />
              <span style={S.heroAccent}>On Social Media</span>
            </h1>
            <p style={S.heroSub}>
              Real, trackable results — views, followers & content that actually converts.
              We don&apos;t chase vanity metrics, we build audiences.
            </p>

            <div style={S.tagsWrap}>
              {TAGS.map(t => <span key={t} style={S.tag}>{t}</span>)}
            </div>

            <div style={S.heroBtns}>
              <Link href="/page-contact" style={S.cta} className="sm-cta">
                ENQUIRE NOW
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 10 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="#work" style={S.ctaGhost}>See how we work</a>
            </div>
          </div>

          <div style={S.heroRight}>
            <div className="sm-float"><StatCard /></div>
            <div style={S.floatBadge} className="sm-float-slow">🚀 +24% this month</div>
            <div style={S.floatBadge2} className="sm-float-fast">❤️ 62.9K reach</div>
          </div>
        </div>
      </section>

      {/* ── METRICS BAND ── */}
      <section style={S.metricsBand}>
        <div style={S.metricsInner}>
          {METRICS.map((m, i) => (
            <div key={m.l} style={{ ...S.metric, borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
              <span style={S.metricN}>{m.n}</span>
              <span style={S.metricL}>{m.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLATFORM MARQUEE ── */}
      <section style={S.marqueeWrap}>
        <div style={S.marqueeTrack} className="sm-marquee">
          {[...PLATFORMS, ...PLATFORMS].map((p, i) => (
            <span key={i} style={S.marqueeItem}>{p}<span style={S.marqueeDot}>✦</span></span>
          ))}
        </div>
      </section>

      {/* ── REASONS / ALTERNATING SECTIONS ── */}
      {REASONS.map((r, i) => (
        <section key={i} style={{ ...S.altSection, background: i % 2 === 0 ? BG : BG2 }}>
          <div style={{ ...S.altInner, flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }} className="alt-inner">
            <div style={S.altText}>
              <span style={S.altKicker}>0{i + 1}</span>
              <h2 style={S.altH2}>{r.heading}</h2>
              <p style={S.altP}>{r.body}</p>
            </div>
            <div style={S.altMock}>{renderMock(r.mock)}</div>
          </div>
        </section>
      ))}

      {/* ── PROCESS ── */}
      <section id="work" style={S.processSection}>
        <div style={S.processHead}>
          <span style={S.eyebrow}>✦ HOW WE WORK</span>
          <h2 style={S.processTitle}>From zero to <span style={S.heroAccent}>viral</span>, in four steps.</h2>
        </div>
        <div style={S.processGrid} className="caps-grid">
          {PROCESS.map(p => (
            <div key={p.step} style={S.processCard}>
              <span style={S.processStep}>{p.step}</span>
              <h3 style={S.processCardTitle}>{p.title}</h3>
              <p style={S.processCardDesc}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section style={S.capsSection}>
        <h2 style={S.capsHeading}>OUR CAPABILITIES</h2>
        <div style={S.capsGrid} className="caps-grid">
          {CAPABILITIES.map((c, i) => (
            <div
              key={c.title}
              style={{
                ...S.capCard,
                borderColor: hovered === i ? c.color : 'rgba(255,255,255,0.07)',
                transform: hovered === i ? 'translateY(-8px)' : 'none',
                boxShadow: hovered === i ? `0 20px 50px ${c.color}22` : 'none',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ ...S.capIcon, background: c.color + '22', color: c.color }}>{c.icon}</div>
              <h3 style={S.capTitle}>{c.title}</h3>
              <p style={S.capDesc}>{c.desc}</p>
              <div style={{ ...S.capArrow, color: c.color }}>→</div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes smFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        @keyframes smFloatSlow { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-22px) rotate(-3deg); } }
        @keyframes smFloatFast { 0%,100% { transform: translateY(0) rotate(4deg); } 50% { transform: translateY(-12px) rotate(4deg); } }
        @keyframes smGlow { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-30px) scale(1.15); } }
        @keyframes smMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .sm-float { animation: smFloat 5s ease-in-out infinite; }
        .sm-float-slow { animation: smFloatSlow 7s ease-in-out infinite; }
        .sm-float-fast { animation: smFloatFast 4s ease-in-out infinite; }
        .sm-glow { animation: smGlow 14s ease-in-out infinite; }
        .sm-marquee { animation: smMarquee 30s linear infinite; }
        .sm-cta { transition: transform .2s, box-shadow .2s; }
        .sm-cta:hover { transform: translateY(-3px); box-shadow: 0 14px 40px ${ORANGE}66 !important; }
        @media (max-width: 900px) {
          .caps-grid { grid-template-columns: 1fr 1fr !important; }
          .alt-inner { flex-direction: column !important; }
        }
        @media (max-width: 600px) {
          .hero-inner { flex-direction: column !important; }
          .caps-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sm-float, .sm-float-slow, .sm-float-fast, .sm-glow, .sm-marquee { animation: none !important; }
        }
      `}</style>

      {/* ── CTA BANNER ── */}
      <section style={S.ctaBanner}>
        <div style={S.ctaBannerInner}>
          <h2 style={S.ctaBannerH}>Ready to blow up your social?</h2>
          <p style={S.ctaBannerP}>Let&apos;s build content that gets views, followers, and real business results.</p>
          <Link href="/page-contact" style={S.ctaBannerBtn} className="sm-cta">
            Start a Campaign →
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ── Mock Components ── */
function StatCard() {
  return (
    <div style={M.statCard}>
      <div style={M.statTop}>
        <div style={M.statAvatar}>🏠</div>
        <div>
          <p style={M.statBrand}>Brand</p>
          <p style={M.statName}>House Of Gulab</p>
        </div>
      </div>
      <div style={M.statRow}>
        <div style={M.statBox}>
          <p style={M.statLabel}>Followers</p>
          <p style={M.statVal}>62.9K</p>
        </div>
        <div style={M.statBox}>
          <p style={M.statLabel}>Views</p>
          <p style={M.statVal}>17.2K</p>
        </div>
      </div>
      <div style={M.statBar}><div style={{ ...M.statFill, width: '72%' }} /></div>
      <p style={M.statSub}>↑ 24% growth this month</p>
    </div>
  );
}

function DashboardMock() {
  const rows = [
    { label: 'Views',          val: '28.9M' },
    { label: 'Interactions',   val: '81.2K' },
    { label: 'New Followers',  val: '7107'  },
    { label: 'Content Shared', val: '60'    },
  ];
  return (
    <div style={M.dashboard}>
      <div style={M.dashHeader}>
        <span style={M.dashTitle}>Professional Dashboard</span>
        <span style={{ color: '#555', fontSize: 12 }}>16 Mar–14 Apr</span>
      </div>
      <p style={{ color: '#555', fontSize: 11, margin: '0 0 14px' }}>Insights</p>
      {rows.map(r => (
        <div key={r.label} style={M.dashRow}>
          <span style={M.dashLabel}>{r.label}</span>
          <span style={M.dashVal}>{r.val} &rsaquo;</span>
        </div>
      ))}
    </div>
  );
}

function ContentMock() {
  const posts = ['Paisa hai to\nबड़ी-बड़ी\nBaatein', 'एक दूती दो\nCONTENT\njise log dekhe', 'Bina Ug...'];
  const tags  = ['Performance Marketing', 'Social Media Marketing', 'Content Marketing'];
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {posts.map((p, i) => (
        <div key={i} style={{ ...M.postCard, background: ['#1a6ef5', '#0a9a5c', '#6c1ab5'][i] }}>
          <p style={{ color: '#fff', fontSize: 13, fontWeight: 800, whiteSpace: 'pre-line', margin: 0 }}>{p}</p>
          <div style={{ marginTop: 'auto' }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: 20 }}>
              {tags[i]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function BrandMock() {
  const rows = [['Identity', 92], ['Voice', 88], ['Consistency', 95], ['Engagement', 79]];
  return (
    <div style={M.brandCard}>
      <div style={M.brandLogo}>CM</div>
      <div>
        {rows.map(([l, v]) => (
          <div key={l} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#777', fontSize: 12 }}>{l}</span>
              <span style={{ color: ORANGE, fontSize: 12, fontWeight: 700 }}>{v}%</span>
            </div>
            <div style={{ background: '#eee', borderRadius: 4, height: 6 }}>
              <div style={{ width: v + '%', height: '100%', background: ORANGE, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamMock() {
  const team = ['🎨', '📹', '✍️', '📊'];
  const roles = ['Designer', 'Videographer', 'Copywriter', 'Analyst'];
  return (
    <div style={M.teamGrid}>
      {team.map((e, i) => (
        <div key={i} style={M.teamCard}>
          <div style={M.teamEmoji}>{e}</div>
          <p style={{ color: '#888', fontSize: 11, margin: '6px 0 0', textAlign: 'center' }}>{roles[i]}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Styles (light theme) ── */
const S = {
  page: { position: 'relative', background: BG, color: '#141414', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' },

  /* Background glows */
  glowWrap: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 },
  glow: { position: 'absolute', borderRadius: '50%', filter: 'blur(90px)', opacity: 0.16 },
  glowA: { width: 420, height: 420, background: ORANGE, top: -80, left: -60 },
  glowB: { width: 380, height: 380, background: PURPLE, top: 300, right: -80 },
  glowC: { width: 340, height: 340, background: PINK, bottom: 200, left: '30%' },

  /* Hero */
  hero: { position: 'relative', zIndex: 1, padding: '130px 0 70px' },
  heroInner: { maxWidth: 1300, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' },
  heroLeft: { flex: 1, minWidth: 300 },
  heroRight: { flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center', position: 'relative' },
  eyebrow: { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: ORANGE, marginBottom: 18, textTransform: 'uppercase' },
  heroH1: { fontSize: 'clamp(38px,5vw,68px)', fontWeight: 900, lineHeight: 1.08, margin: '0 0 20px', letterSpacing: '-0.02em', color: '#141414' },
  heroAccent: { background: `linear-gradient(100deg, ${ORANGE}, ${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  heroSub: { color: '#666', fontSize: 16, lineHeight: 1.7, margin: '0 0 26px', maxWidth: 460 },
  tagsWrap: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 30 },
  tag: { padding: '6px 14px', background: '#f2f3f5', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, fontSize: 12, color: '#555' },
  heroBtns: { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' },
  cta: { display: 'inline-flex', alignItems: 'center', padding: '15px 34px', background: ORANGE, borderRadius: 50, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 800, letterSpacing: '0.06em', boxShadow: `0 8px 30px ${ORANGE}44` },
  ctaGhost: { color: '#333', textDecoration: 'none', fontSize: 14, fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.25)', paddingBottom: 2 },

  /* Floating badges */
  floatBadge: { position: 'absolute', top: 10, left: 0, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 30, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#16a34a', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  floatBadge2: { position: 'absolute', bottom: 20, right: 0, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 30, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#e11d6b', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },

  /* Metrics band */
  metricsBand: { position: 'relative', zIndex: 1, padding: '48px 0', borderTop: '1px solid rgba(0,0,0,0.07)', borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#fafafa' },
  metricsInner: { maxWidth: 1200, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 },
  metric: { textAlign: 'center', padding: '0 16px' },
  metricN: { display: 'block', fontSize: 'clamp(28px,3.4vw,44px)', fontWeight: 900, letterSpacing: '-0.02em', background: `linear-gradient(120deg,#141414,#555)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  metricL: { display: 'block', color: '#888', fontSize: 13, marginTop: 6, fontWeight: 500 },

  /* Marquee */
  marqueeWrap: { position: 'relative', zIndex: 1, overflow: 'hidden', padding: '26px 0', borderBottom: '1px solid rgba(0,0,0,0.07)', maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)' },
  marqueeTrack: { display: 'flex', gap: 0, width: 'max-content' },
  marqueeItem: { display: 'inline-flex', alignItems: 'center', fontSize: 22, fontWeight: 800, color: 'rgba(0,0,0,0.18)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' },
  marqueeDot: { color: ORANGE, margin: '0 28px', fontSize: 12 },

  /* Alternating sections */
  altSection: { position: 'relative', zIndex: 1, padding: '90px 0' },
  altInner: { maxWidth: 1300, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: 80, flexWrap: 'wrap' },
  altText: { flex: 1, minWidth: 260 },
  altKicker: { display: 'inline-block', fontSize: 13, fontWeight: 800, color: ORANGE, letterSpacing: '0.1em', marginBottom: 12, opacity: 0.8 },
  altH2: { fontSize: 'clamp(26px,3vw,42px)', fontWeight: 800, margin: '0 0 20px', lineHeight: 1.2, letterSpacing: '-0.02em', color: '#141414' },
  altP: { color: '#666', fontSize: 15, lineHeight: 1.8, margin: 0, maxWidth: 440 },
  altMock: { flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' },

  /* Process */
  processSection: { position: 'relative', zIndex: 1, padding: '100px 48px', background: '#f6f7f9', textAlign: 'center' },
  processHead: { maxWidth: 700, margin: '0 auto 56px' },
  processTitle: { fontSize: 'clamp(28px,3.4vw,46px)', fontWeight: 900, margin: '8px 0 0', letterSpacing: '-0.02em', color: '#141414' },
  processGrid: { maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 },
  processCard: { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '32px 24px', textAlign: 'left', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' },
  processStep: { fontSize: 44, fontWeight: 900, color: 'rgba(0,0,0,0.08)', lineHeight: 1 },
  processCardTitle: { color: '#141414', fontSize: 19, fontWeight: 800, margin: '14px 0 10px' },
  processCardDesc: { color: '#777', fontSize: 13.5, lineHeight: 1.7, margin: 0 },

  /* Capabilities */
  capsSection: { position: 'relative', zIndex: 1, padding: '100px 0', textAlign: 'center' },
  capsHeading: { fontSize: 13, fontWeight: 800, letterSpacing: '0.24em', color: '#bbb', textTransform: 'uppercase', marginBottom: 48 },
  capsGrid: { maxWidth: 1100, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 },
  capCard: { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '36px 28px', textAlign: 'left', transition: 'all 0.25s', cursor: 'default', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' },
  capIcon: { width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 },
  capTitle: { color: '#141414', fontSize: 18, fontWeight: 700, margin: '0 0 12px' },
  capDesc: { color: '#777', fontSize: 14, lineHeight: 1.7, margin: '0 0 24px' },
  capArrow: { fontSize: 22, fontWeight: 700 },

  /* CTA Banner */
  ctaBanner: { position: 'relative', zIndex: 1, padding: '110px 48px', background: `linear-gradient(135deg, ${ORANGE}14 0%, ${PURPLE}14 100%)`, borderTop: '1px solid rgba(0,0,0,0.07)' },
  ctaBannerInner: { maxWidth: 720, margin: '0 auto', textAlign: 'center' },
  ctaBannerH: { fontSize: 'clamp(30px,4vw,54px)', fontWeight: 900, margin: '0 0 16px', letterSpacing: '-0.02em', color: '#141414' },
  ctaBannerP: { color: '#666', fontSize: 16, lineHeight: 1.7, margin: '0 0 36px' },
  ctaBannerBtn: { display: 'inline-flex', alignItems: 'center', padding: '16px 42px', background: ORANGE, borderRadius: 50, color: '#fff', textDecoration: 'none', fontSize: 15, fontWeight: 800, boxShadow: `0 8px 30px ${ORANGE}44` },
};

const M = {
  statCard: { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 22, padding: 28, minWidth: 260, maxWidth: 320, boxShadow: '0 30px 60px rgba(0,0,0,0.12)' },
  statTop: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 },
  statAvatar: { width: 44, height: 44, borderRadius: 12, background: ORANGE + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 },
  statBrand: { color: '#999', fontSize: 11, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' },
  statName: { color: '#141414', fontSize: 15, fontWeight: 700, margin: 0 },
  statRow: { display: 'flex', gap: 20, marginBottom: 20 },
  statBox: {},
  statLabel: { color: '#999', fontSize: 11, margin: '0 0 4px' },
  statVal: { color: '#141414', fontSize: 24, fontWeight: 800, margin: 0 },
  statBar: { background: '#eee', borderRadius: 6, height: 8, marginBottom: 10 },
  statFill: { height: '100%', background: `linear-gradient(90deg,${ORANGE},${PINK})`, borderRadius: 6 },
  statSub: { color: '#16a34a', fontSize: 12, fontWeight: 600, margin: 0 },

  dashboard: { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: 24, minWidth: 280, maxWidth: 340, boxShadow: '0 30px 60px rgba(0,0,0,0.1)' },
  dashHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  dashTitle: { color: '#141414', fontSize: 14, fontWeight: 700 },
  dashRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' },
  dashLabel: { color: '#888', fontSize: 13 },
  dashVal: { color: '#141414', fontSize: 13, fontWeight: 600 },

  postCard: { borderRadius: 16, padding: 20, width: 150, minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },

  brandCard: { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: 28, minWidth: 280, maxWidth: 340, boxShadow: '0 30px 60px rgba(0,0,0,0.1)' },
  brandLogo: { width: 48, height: 48, background: `linear-gradient(135deg,${ORANGE},${PINK})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18, marginBottom: 24 },

  teamGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  teamCard: { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' },
  teamEmoji: { fontSize: 32 },
};
