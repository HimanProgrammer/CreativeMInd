'use client';
import { useState } from 'react';
import Link from 'next/link';

const ORANGE = '#f05a28';
const BG     = '#0a0a0a';
const BG2    = '#111';

const TAGS = [
  'Content Designed For Reach',
  'Hook-Led Scripting',
  'Trend-Adaptive Content Engine',
  'Custom Visual Identity',
  'High-Impact Reels, Not Just Posts',
];

const CAPABILITIES = [
  {
    title: 'Performance Content',
    desc:  'Scroll-stopping reels, carousels & posts built to convert.',
    icon:  '📈',
    color: '#f05a28',
  },
  {
    title: 'Social Media Management',
    desc:  'Full-service handling of your pages — strategy, posting, engagement.',
    icon:  '📱',
    color: '#6c63ff',
  },
  {
    title: 'Content Marketing',
    desc:  'Brand storytelling that builds authority and loyal audiences.',
    icon:  '✍️',
    color: '#e040fb',
  },
];

const REASONS = [
  {
    heading: 'Views & Followers is our KPI',
    body: "We don't just manage social — we grow it with real, trackable impact. No fluff metrics — just views, reach, and followers that move the needle.",
    mock: <DashboardMock />,
  },
  {
    heading: 'Unseen, Unkaha, Unsunna',
    body: "Our content is fresh, original, and built to stop the scroll. No templates. No repeats. Just algorithm-loving creativity with viral potential.",
    mock: <ContentMock />,
  },
  {
    heading: "Maintain Brand's Sanity",
    body: "Real people, real talk — no jargon, no ego. We're collaborators, not contractors — and we keep it fun, fast, and human.",
    mock: <BrandMock />,
  },
  {
    heading: 'You Will Enjoy Working With Our Team',
    body: "Real people, real talk — no ghosting, no jargon. We're collaborators, not contractors — and we keep it fun, fast, and human.",
    mock: <TeamMock />,
  },
];

export default function SocialMediaPage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={S.page}>

      {/* ── HERO ── */}
      <section style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.heroLeft}>
            <span style={S.eyebrow}>✦ SOCIAL MEDIA MARKETING</span>
            <h1 style={S.heroH1}>
              Grow Your Brand<br />
              <span style={S.heroAccent}>On Social Media</span>
            </h1>

            <div style={S.tagsWrap}>
              {TAGS.map(t => (
                <span key={t} style={S.tag}>{t}</span>
              ))}
            </div>

            <div style={S.platformRow}>
              <span style={S.platformLabel}>Social Media</span>
              <span style={S.platformChip}>UGC</span>
              <span style={S.platformChip}>Social Media Management</span>
            </div>

            <Link href="/page-contact" style={S.cta}>
              ENQUIRE NOW
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 10 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div style={S.heroRight}>
            <StatCard />
          </div>
        </div>
      </section>

      {/* ── REASONS / ALTERNATING SECTIONS ── */}
      {REASONS.map((r, i) => (
        <section key={i} style={{ ...S.altSection, background: i % 2 === 0 ? BG : BG2 }}>
          <div style={{ ...S.altInner, flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
            <div style={S.altText}>
              <h2 style={S.altH2}>{r.heading}</h2>
              <p style={S.altP}>{r.body}</p>
            </div>
            <div style={S.altMock}>
              {r.mock}
            </div>
          </div>
        </section>
      ))}

      {/* ── CAPABILITIES ── */}
      <section style={S.capsSection}>
        <h2 style={S.capsHeading}>OUR CAPABILITIES</h2>
        <div style={S.capsGrid}>
          {CAPABILITIES.map((c, i) => (
            <div
              key={c.title}
              style={{
                ...S.capCard,
                borderColor: hovered === i ? c.color : 'rgba(255,255,255,0.07)',
                transform: hovered === i ? 'translateY(-6px)' : 'none',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ ...S.capIcon, background: c.color + '22', color: c.color }}>
                {c.icon}
              </div>
              <h3 style={S.capTitle}>{c.title}</h3>
              <p style={S.capDesc}>{c.desc}</p>
              <div style={{ ...S.capArrow, color: c.color }}>→</div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .caps-grid { grid-template-columns: 1fr !important; }
          .alt-inner { flex-direction: column !important; }
        }
        @media (max-width: 600px) {
          .hero-inner { flex-direction: column !important; }
        }
      `}</style>

      {/* ── CTA BANNER ── */}
      <section style={S.ctaBanner}>
        <div style={S.ctaBannerInner}>
          <h2 style={S.ctaBannerH}>Ready to blow up your social?</h2>
          <p style={S.ctaBannerP}>Let&apos;s build content that gets views, followers, and real business results.</p>
          <Link href="/page-contact" style={S.ctaBannerBtn}>
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
      <div style={M.statBar}>
        <div style={{ ...M.statFill, width: '72%' }} />
      </div>
      <p style={M.statSub}>↑ 24% growth this month</p>
    </div>
  );
}

function DashboardMock() {
  const rows = [
    { label: 'Views',         val: '28.9M' },
    { label: 'Interactions',  val: '81.2K' },
    { label: 'New Followers', val: '7107'  },
    { label: 'Content Shared',val: '60'    },
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
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {posts.map((p, i) => (
        <div key={i} style={{ ...M.postCard, background: ['#1a6ef5','#0a9a5c','#6c1ab5'][i] }}>
          <p style={{ color: '#fff', fontSize: 13, fontWeight: 800, whiteSpace: 'pre-line', margin: 0 }}>{p}</p>
          <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
            {['Performance', 'Social Media', 'Content'][i].split('').slice(0,10) && (
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: 20 }}>
                {['Performance Marketing', 'Social Media Marketing', 'Content Marketing'][i]}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function BrandMock() {
  return (
    <div style={M.brandCard}>
      <div style={M.brandLogo}>CM</div>
      <div style={M.brandMeter}>
        {['Identity', 'Voice', 'Consistency', 'Engagement'].map((l, i) => (
          <div key={l} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#aaa', fontSize: 12 }}>{l}</span>
              <span style={{ color: ORANGE, fontSize: 12, fontWeight: 700 }}>{[92, 88, 95, 79][i]}%</span>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: 4, height: 6 }}>
              <div style={{ width: [92, 88, 95, 79][i] + '%', height: '100%', background: ORANGE, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamMock() {
  const team = ['🎨', '📹', '✍️', '📊'];
  return (
    <div style={M.teamGrid}>
      {team.map((e, i) => (
        <div key={i} style={M.teamCard}>
          <div style={M.teamEmoji}>{e}</div>
          <p style={{ color: '#888', fontSize: 11, margin: '6px 0 0', textAlign: 'center' }}>
            {['Designer', 'Videographer', 'Copywriter', 'Analyst'][i]}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── Styles ── */
const S = {
  page: { background: BG, color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' },

  /* Hero */
  hero: { padding: '120px 0 80px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  heroInner: { maxWidth: 1300, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' },
  heroLeft: { flex: 1, minWidth: 300 },
  heroRight: { flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' },
  eyebrow: { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: ORANGE, marginBottom: 18, textTransform: 'uppercase' },
  heroH1: { fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 28px', letterSpacing: '-0.02em' },
  heroAccent: { color: ORANGE },
  tagsWrap: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  tag: { padding: '6px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 12, color: '#aaa' },
  platformRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 },
  platformLabel: { color: '#555', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' },
  platformChip: { padding: '4px 12px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 20, fontSize: 11, color: '#a78bfa', fontWeight: 600 },
  cta: { display: 'inline-flex', alignItems: 'center', padding: '14px 32px', background: ORANGE, borderRadius: 50, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 800, letterSpacing: '0.06em', boxShadow: `0 8px 30px ${ORANGE}44` },

  /* Alternating sections */
  altSection: { padding: '90px 0' },
  altInner: { maxWidth: 1300, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: 80, flexWrap: 'wrap' },
  altText: { flex: 1, minWidth: 260 },
  altH2: { fontSize: 'clamp(26px,3vw,42px)', fontWeight: 800, margin: '0 0 20px', lineHeight: 1.2, letterSpacing: '-0.02em' },
  altP: { color: '#666', fontSize: 15, lineHeight: 1.8, margin: 0, maxWidth: 420 },
  altMock: { flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' },

  /* Capabilities */
  capsSection: { padding: '100px 0', background: '#0d0d0d', textAlign: 'center' },
  capsHeading: { fontSize: 13, fontWeight: 800, letterSpacing: '0.24em', color: '#444', textTransform: 'uppercase', marginBottom: 48 },
  capsGrid: { maxWidth: 1100, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 },
  capCard: { background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '36px 28px', textAlign: 'left', transition: 'all 0.25s', cursor: 'default', position: 'relative' },
  capIcon: { width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 },
  capTitle: { color: '#fff', fontSize: 18, fontWeight: 700, margin: '0 0 12px' },
  capDesc: { color: '#555', fontSize: 14, lineHeight: 1.7, margin: '0 0 24px' },
  capArrow: { fontSize: 22, fontWeight: 700 },

  /* CTA Banner */
  ctaBanner: { padding: '100px 48px', background: `linear-gradient(135deg, ${ORANGE}22 0%, #6c63ff22 100%)`, borderTop: '1px solid rgba(255,255,255,0.06)' },
  ctaBannerInner: { maxWidth: 700, margin: '0 auto', textAlign: 'center' },
  ctaBannerH: { fontSize: 'clamp(30px,4vw,52px)', fontWeight: 900, margin: '0 0 16px', letterSpacing: '-0.02em' },
  ctaBannerP: { color: '#666', fontSize: 16, lineHeight: 1.7, margin: '0 0 36px' },
  ctaBannerBtn: { display: 'inline-flex', alignItems: 'center', padding: '16px 40px', background: ORANGE, borderRadius: 50, color: '#fff', textDecoration: 'none', fontSize: 15, fontWeight: 800, boxShadow: `0 8px 30px ${ORANGE}44` },
};

const M = {
  /* Stat card */
  statCard: { background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28, minWidth: 260, maxWidth: 320 },
  statTop: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 },
  statAvatar: { width: 44, height: 44, borderRadius: 12, background: ORANGE + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 },
  statBrand: { color: '#555', fontSize: 11, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' },
  statName: { color: '#fff', fontSize: 15, fontWeight: 700, margin: 0 },
  statRow: { display: 'flex', gap: 20, marginBottom: 20 },
  statBox: {},
  statLabel: { color: '#555', fontSize: 11, margin: '0 0 4px' },
  statVal: { color: '#fff', fontSize: 24, fontWeight: 800, margin: 0 },
  statBar: { background: '#1a1a1a', borderRadius: 6, height: 8, marginBottom: 10 },
  statFill: { height: '100%', background: `linear-gradient(90deg,${ORANGE},#e040fb)`, borderRadius: 6 },
  statSub: { color: '#4ade80', fontSize: 12, fontWeight: 600, margin: 0 },

  /* Dashboard */
  dashboard: { background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, minWidth: 280, maxWidth: 340 },
  dashHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  dashTitle: { color: '#fff', fontSize: 14, fontWeight: 700 },
  dashRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  dashLabel: { color: '#888', fontSize: 13 },
  dashVal: { color: '#fff', fontSize: 13, fontWeight: 600 },

  /* Post cards */
  postCard: { borderRadius: 16, padding: 20, width: 150, minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },

  /* Brand */
  brandCard: { background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28, minWidth: 280, maxWidth: 340 },
  brandLogo: { width: 48, height: 48, background: `linear-gradient(135deg,${ORANGE},#e040fb)`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18, marginBottom: 24 },
  brandMeter: {},

  /* Team */
  teamGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  teamCard: { background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  teamEmoji: { fontSize: 32 },
};
