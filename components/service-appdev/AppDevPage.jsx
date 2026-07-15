'use client';
import { useState } from 'react';
import Link from 'next/link';

const PURPLE = '#7c3aed';
const PURPLE2 = '#8b5cf6';
const PINK = '#ec4899';
const GRAD = `linear-gradient(135deg, ${PURPLE} 0%, ${PINK} 100%)`;
const INK = '#1a1a2e';
const MUTE = '#6b7280';

/* ── Data ── */
const WHY = [
  { icon: '📦', title: 'Cross Platform Development', desc: 'Build once, run everywhere. We use React Native & Flutter to deliver seamless apps.', c: '#8b5cf6' },
  { icon: '📱', title: 'Native Performance Apps', desc: 'Lightning-fast, secure & scalable native apps for iOS and Android.', c: '#ec4899' },
  { icon: '🤖', title: 'AI Integration Experts', desc: 'Smart AI features, automation & predictive analytics integrated into your app.', c: '#7c3aed' },
  { icon: '☁️', title: 'Cloud Backend & DevOps', desc: 'Scalable cloud solutions, real-time databases & DevOps-driven delivery.', c: '#3b82f6' },
];

const PROCESS = [
  { n: '01', icon: '💡', t: 'Discovery', d: 'We analyze your idea, market & competitors.' },
  { n: '02', icon: '🔍', t: 'UX Research', d: 'Understand users & create user flows.' },
  { n: '03', icon: '✏️', t: 'UI Design', d: 'Stunning, intuitive & conversion-focused UI.' },
  { n: '04', icon: '⌨️', t: 'Development', d: 'Clean, scalable & efficient code.' },
  { n: '05', icon: '🛡️', t: 'Testing', d: 'Rigorous testing for bug-free performance.' },
  { n: '06', icon: '🚀', t: 'Deployment', d: 'Launching to stores with confidence.' },
  { n: '07', icon: '⚙️', t: 'Maintenance', d: 'Ongoing support & feature updates.' },
];

const TECH = [
  { n: 'React Native', e: '⚛️' }, { n: 'Flutter', e: '💙' }, { n: 'Swift', e: '🍎' },
  { n: 'Kotlin', e: '🟪' }, { n: 'Node.js', e: '🟩' }, { n: 'Next.js', e: '▲' },
  { n: 'Firebase', e: '🔥' }, { n: 'AWS', e: '☁️' }, { n: 'MongoDB', e: '🍃' },
  { n: 'Docker', e: '🐳' }, { n: 'AI APIs', e: '🧠' },
];

const APPS = [
  { t: 'Food Delivery App', g: 'linear-gradient(160deg,#fde68a,#fca5a5)' },
  { t: 'Fintech App', g: 'linear-gradient(160deg,#c4b5fd,#a5b4fc)' },
  { t: 'Fitness App', g: 'linear-gradient(160deg,#f9a8d4,#c4b5fd)' },
  { t: 'Healthcare App', g: 'linear-gradient(160deg,#a5f3fc,#bfdbfe)' },
  { t: 'Ecommerce App', g: 'linear-gradient(160deg,#fdba74,#fca5a5)' },
  { t: 'Travel App', g: 'linear-gradient(160deg,#7dd3fc,#a5f3fc)' },
];

const REVIEWS = [
  { name: 'Rajesh Kothari', role: 'Owner, Kothari Hyundai', text: 'CreativeMind delivered an amazing app that scaled our business. Super professional team!', img: '/assets/imgs/testim/t1.jpg' },
  { name: 'Priya Nair', role: 'Founder, House Of Gulab', text: 'Their app development is top-notch. Clean code, excellent UI & great support throughout.', img: '/assets/imgs/testim/t2.jpg' },
  { name: 'Amit Deshmukh', role: 'Director, Deshmukh Enterprises', text: 'The app they built for us is fast, secure & loved by our users.', img: '/assets/imgs/testim/t3.jpg' },
];

const LOGOS = [
  { n: 'urban eat', e: '🍔', c: '#ef4444' }, { n: 'FinPay', e: '💳', c: '#8b5cf6' },
  { n: 'HealthPlus', e: '➕', c: '#3b82f6' }, { n: 'travelio', e: '✈️', c: '#ec4899' },
  { n: 'Shopmax', e: '🛍️', c: '#6366f1' }, { n: 'FitLife', e: '💪', c: '#14b8a6' },
];

const STATS = [
  { e: '🚀', n: '250+', l: 'Apps Delivered' },
  { e: '😊', n: '98%', l: 'Client Satisfaction' },
  { e: '👨‍💻', n: '50+', l: 'Developers' },
  { e: '🌍', n: '12+', l: 'Countries Served' },
];

/* ── Hero phone mock ── */
function HeroPhone() {
  return (
    <div style={S.heroArt}>
      <div style={S.phone} className="ad-float">
        <div style={S.phoneNotch} />
        <div style={S.phoneScreen}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: '#fff', opacity: 0.9 }}>Hey, Michael 👋</span>
            <span style={{ fontSize: 12 }}>🔔</span>
          </div>
          <div style={S.balanceCard}>
            <span style={{ fontSize: 11, opacity: 0.85 }}>Total Balance</span>
            <div style={{ fontSize: 22, fontWeight: 800, margin: '2px 0 10px' }}>$18,420.50</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Send', 'Receive', 'History', 'Add'].map(a => (
                <div key={a} style={S.balBtn}>{a[0]}</div>
              ))}
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 14, padding: 12, marginTop: 12 }}>
            <span style={{ fontSize: 11, color: MUTE }}>Spending Chart</span>
            <div style={{ fontSize: 16, fontWeight: 800, color: INK }}>$6,420</div>
            <svg viewBox="0 0 200 60" style={{ width: '100%', height: 46, marginTop: 4 }}>
              <path d="M0,50 C30,45 40,20 70,28 C100,36 120,10 150,18 C175,24 185,12 200,8" fill="none" stroke={PURPLE} strokeWidth="2.5" />
              <path d="M0,50 C30,45 40,20 70,28 C100,36 120,10 150,18 C175,24 185,12 200,8 L200,60 L0,60 Z" fill="url(#g1)" opacity="0.25" />
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={PURPLE} /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
            </svg>
          </div>
          <div style={{ marginTop: 12 }}>
            {[['Dribble Pro', '-$250', '🎨'], ['Salary', '+$3,650', '💰']].map(([t, v, e]) => (
              <div key={t} style={S.txnRow}>
                <span style={{ fontSize: 16 }}>{e}</span>
                <span style={{ flex: 1, fontSize: 12, color: INK, fontWeight: 600 }}>{t}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: String(v).startsWith('+') ? '#16a34a' : '#ef4444' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* floating cards */}
      <div style={{ ...S.floatCard, top: 60, right: -10 }} className="ad-float-slow">
        <span style={{ fontSize: 20 }}>🍕</span>
        <div><div style={S.fcTitle}>Food Delivery</div><div style={S.fcSub}>Your order is on the way</div></div>
      </div>
      <div style={{ ...S.floatCard, top: 210, right: -20, flexDirection: 'column', alignItems: 'flex-start' }} className="ad-float-fast">
        <div style={S.fcSub}>Daily Revenue</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: INK }}>$2,420</div>
        <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>↑ 12.5%</div>
      </div>
      <div style={{ ...S.floatCard, bottom: 70, right: 10 }} className="ad-float-slow">
        <span style={{ fontSize: 18 }}>✅</span>
        <div><div style={S.fcTitle}>Payment Received</div><div style={S.fcSub}>$250.00 from John Doe</div></div>
      </div>
      {/* floating tech badges */}
      {[['⚛️', 20, 120, 'ad-float'], ['💙', 260, 60, 'ad-float-fast'], ['🍎', 320, 40, 'ad-float-slow'], ['🧠', 380, 150, 'ad-float']].map(([e, top, left, cls], i) => (
        <div key={i} style={{ ...S.techBadge, top, left }} className={cls}>{e}</div>
      ))}
    </div>
  );
}

function MiniPhone({ app }) {
  return (
    <div style={S.appCard}>
      <div style={{ ...S.miniPhone, background: app.g }}>
        <div style={S.miniNotch} />
        <div style={S.miniHeader} />
        {[0, 1, 2].map(i => <div key={i} style={S.miniRow} />)}
      </div>
      <div style={S.appLabel}>{app.t}</div>
    </div>
  );
}

export default function AppDevPage() {
  const [hw, setHw] = useState(null);

  return (
    <div style={S.page}>
      {/* glows */}
      <div style={S.glowWrap} aria-hidden>
        <div style={{ ...S.glow, background: PURPLE2, top: -60, right: 100, width: 380, height: 380 }} className="ad-glow" />
        <div style={{ ...S.glow, background: PINK, top: 200, left: -60, width: 340, height: 340 }} className="ad-glow" />
      </div>

      {/* HERO */}
      <section style={S.hero}>
        <div style={S.heroInner} className="ad-hero">
          <div style={S.heroLeft}>
            <span style={S.pill}>✦ Mobile App Development Agency</span>
            <h1 style={S.h1}>
              Building<br />
              <span style={S.gradText}>Mobile Apps</span><br />
              That <span style={{ color: PINK }}>People Love</span>
            </h1>
            <p style={S.heroSub}>We design &amp; develop high-performance mobile apps that delight users and grow your business.</p>
            <div style={S.heroBtns}>
              <Link href="/page-contact" style={S.btnPrimary} className="ad-btn">
                Start Your Project
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 8 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/portfolio-masonry" style={S.btnGhost}>
                <span style={S.playDot}>▶</span> View Portfolio
              </Link>
            </div>
            <div style={S.heroStats}>
              <div>
                <div style={{ color: '#f59e0b', fontSize: 15 }}>★★★★★</div>
                <div style={S.hsLabel}>5.0 Rating on Clutch</div>
              </div>
              <div style={S.hsDiv} />
              <div><div style={S.hsNum}>250+</div><div style={S.hsLabel}>Apps Delivered</div></div>
              <div style={S.hsDiv} />
              <div><div style={S.hsNum}>50+</div><div style={S.hsLabel}>Happy Clients</div></div>
              <div style={{ display: 'flex', gap: 8, marginLeft: 8 }}>
                <span style={S.storeBadge}> App Store</span>
                <span style={S.storeBadge}>▶ Google Play</span>
              </div>
            </div>
          </div>
          <div style={S.heroRight}><HeroPhone /></div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={S.section}>
        <h2 style={S.secH}>Why Choose <span style={S.gradText}>Us</span></h2>
        <div style={S.whyGrid} className="ad-grid4">
          {WHY.map((w, i) => (
            <div key={w.title} style={{ ...S.whyCard, transform: hw === i ? 'translateY(-8px)' : 'none', boxShadow: hw === i ? `0 20px 40px ${w.c}22` : '0 8px 24px rgba(20,20,46,0.05)' }}
              onMouseEnter={() => setHw(i)} onMouseLeave={() => setHw(null)}>
              <div style={{ ...S.whyIcon, background: w.c + '18' }}>{w.icon}</div>
              <h3 style={S.whyTitle}>{w.title}</h3>
              <p style={S.whyDesc}>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ ...S.section, background: '#faf9ff' }}>
        <h2 style={S.secH}>Our Development <span style={S.gradText}>Process</span></h2>
        <div style={S.processWrap} className="ad-process">
          <div style={S.processLine} />
          {PROCESS.map(p => (
            <div key={p.n} style={S.pStep}>
              <div style={S.pCircle}>{p.icon}</div>
              <div style={S.pNum}>{p.n}</div>
              <div style={S.pTitle}>{p.t}</div>
              <div style={S.pDesc}>{p.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section style={S.section}>
        <h2 style={S.secH}>Technology <span style={S.gradText}>Stack</span></h2>
        <div style={S.techRow} className="ad-tech">
          {TECH.map(t => (
            <div key={t.n} style={S.techCard}>
              <div style={S.techEmoji}>{t.e}</div>
              <span style={S.techName}>{t.n}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED APPS */}
      <section style={{ ...S.section, background: '#faf9ff' }}>
        <div style={S.secHeadRow}>
          <h2 style={{ ...S.secH, textAlign: 'left', margin: 0 }}>Featured <span style={S.gradText}>Mobile Apps</span></h2>
          <Link href="/portfolio-masonry" style={S.viewAll}>View All Projects →</Link>
        </div>
        <div style={S.appsGrid} className="ad-apps">
          {APPS.map(a => <MiniPhone key={a.t} app={a} />)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={S.section}>
        <h2 style={{ ...S.secH, textAlign: 'left' }}>What Our Clients <span style={S.gradText}>Say</span></h2>
        <div style={S.revGrid} className="ad-grid3">
          {REVIEWS.map(r => (
            <div key={r.name} style={S.revCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <img src={r.img} alt={r.name} style={S.revImg} onError={e => { e.target.style.visibility = 'hidden'; }} />
                <div>
                  <div style={{ fontWeight: 700, color: INK, fontSize: 15 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: MUTE }}>{r.role}</div>
                  <div style={{ color: '#f59e0b', fontSize: 12 }}>★★★★★</div>
                </div>
              </div>
              <p style={S.revText}>&ldquo;{r.text}&rdquo;</p>
            </div>
          ))}
        </div>
        <div style={S.logoRow} className="ad-logos">
          {LOGOS.map(l => (
            <span key={l.n} style={{ ...S.logo, color: l.c }}><span style={{ fontSize: 18 }}>{l.e}</span> {l.n}</span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ ...S.section, paddingTop: 20 }}>
        <div style={S.statGrid} className="ad-grid4">
          {STATS.map(s => (
            <div key={s.l} style={S.statCard}>
              <div style={S.statIcon}>{s.e}</div>
              <div><div style={S.statNum}>{s.n}</div><div style={S.statLabel}>{s.l}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={S.cta}>
          <div style={S.ctaGlow} />
          <div style={S.ctaLeft}>
            <span style={S.ctaPill}>✦ Let&apos;s Turn Your Idea Into Reality</span>
            <h2 style={S.ctaH}>Let&apos;s Build Your Next<br /><span style={{ color: '#ffd6f0' }}>Million-User</span> Mobile App</h2>
            <p style={S.ctaSub}>From idea to launch — we build apps that users love and businesses grow with.</p>
            <Link href="/page-contact" style={S.ctaBtn} className="ad-btn">
              Start Your Project
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 8 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div style={S.ctaRobot}>🤖</div>
        </div>
      </section>

      <style>{`
        @keyframes adFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes adFloatSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes adFloatFast { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes adGlow { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,20px) scale(1.1)} }
        .ad-float{animation:adFloat 5s ease-in-out infinite}
        .ad-float-slow{animation:adFloatSlow 7s ease-in-out infinite}
        .ad-float-fast{animation:adFloatFast 4s ease-in-out infinite}
        .ad-glow{animation:adGlow 16s ease-in-out infinite}
        .ad-btn{transition:transform .2s, box-shadow .2s}
        .ad-btn:hover{transform:translateY(-3px)}
        @media(max-width:980px){
          .ad-hero{flex-direction:column}
          .ad-grid4{grid-template-columns:1fr 1fr !important}
          .ad-grid3{grid-template-columns:1fr !important}
          .ad-process{flex-wrap:wrap;justify-content:center}
          .ad-process>div{width:45% !important}
          .ad-apps{grid-template-columns:1fr 1fr 1fr !important}
        }
        @media(max-width:560px){
          .ad-grid4,.ad-apps{grid-template-columns:1fr 1fr !important}
          .ad-process>div{width:100% !important}
        }
        @media(prefers-reduced-motion:reduce){
          .ad-float,.ad-float-slow,.ad-float-fast,.ad-glow{animation:none !important}
        }
      `}</style>
    </div>
  );
}

/* ── Styles ── */
const S = {
  page: { position: 'relative', background: '#fff', color: INK, fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' },
  glowWrap: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 },
  glow: { position: 'absolute', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.13 },

  hero: { position: 'relative', zIndex: 1, padding: '120px 24px 60px', maxWidth: 1280, margin: '0 auto' },
  heroInner: { display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' },
  heroLeft: { flex: 1, minWidth: 320 },
  heroRight: { flex: 1, minWidth: 320, display: 'flex', justifyContent: 'center' },
  pill: { display: 'inline-block', padding: '7px 16px', background: '#f3ecff', color: PURPLE, borderRadius: 30, fontSize: 12, fontWeight: 700, marginBottom: 22 },
  h1: { fontSize: 'clamp(38px,5vw,62px)', fontWeight: 900, lineHeight: 1.06, margin: '0 0 20px', letterSpacing: '-0.02em' },
  gradText: { background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  heroSub: { color: MUTE, fontSize: 16, lineHeight: 1.7, margin: '0 0 28px', maxWidth: 420 },
  heroBtns: { display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 34 },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', padding: '14px 28px', background: GRAD, color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 700, boxShadow: `0 10px 30px ${PURPLE}44` },
  btnGhost: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 26px', background: '#fff', color: INK, border: '1px solid #e5e5f0', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 700 },
  playDot: { width: 22, height: 22, borderRadius: '50%', background: GRAD, color: '#fff', fontSize: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  heroStats: { display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' },
  hsNum: { fontSize: 20, fontWeight: 900, color: INK },
  hsLabel: { fontSize: 11, color: MUTE, marginTop: 2 },
  hsDiv: { width: 1, height: 30, background: '#e5e5f0' },
  storeBadge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 12px', background: INK, color: '#fff', borderRadius: 8, fontSize: 11, fontWeight: 600 },

  /* hero art */
  heroArt: { position: 'relative', width: 340, height: 560 },
  phone: { position: 'absolute', left: 40, top: 20, width: 260, height: 520, background: '#111', border: '10px solid #1a1a2e', borderRadius: 40, overflow: 'hidden', boxShadow: '0 40px 80px rgba(124,58,237,0.28)' },
  phoneNotch: { position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 90, height: 20, background: '#1a1a2e', borderRadius: 12, zIndex: 3 },
  phoneScreen: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#6d28d9,#4c1d95)', padding: '30px 14px 14px', overflow: 'hidden' },
  balanceCard: { background: GRAD, borderRadius: 16, padding: 14, color: '#fff' },
  balBtn: { width: 30, height: 30, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 },
  txnRow: { display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 10, padding: '8px 10px', marginBottom: 8 },

  floatCard: { position: 'absolute', display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 14, padding: '10px 14px', boxShadow: '0 16px 40px rgba(20,20,46,0.14)', zIndex: 4 },
  fcTitle: { fontSize: 12, fontWeight: 700, color: INK },
  fcSub: { fontSize: 10, color: MUTE },
  techBadge: { position: 'absolute', width: 44, height: 44, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 10px 24px rgba(20,20,46,0.12)', zIndex: 5 },

  section: { position: 'relative', zIndex: 1, padding: '70px 24px', maxWidth: 1280, margin: '0 auto' },
  secH: { fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 900, textAlign: 'center', margin: '0 0 44px', letterSpacing: '-0.02em' },
  secHeadRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36, flexWrap: 'wrap', gap: 12 },
  viewAll: { color: PURPLE, fontWeight: 700, fontSize: 14, textDecoration: 'none' },

  whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 },
  whyCard: { background: '#fff', border: '1px solid #eee', borderRadius: 18, padding: '28px 22px', transition: 'all .25s' },
  whyIcon: { width: 60, height: 60, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 18 },
  whyTitle: { fontSize: 17, fontWeight: 800, color: INK, margin: '0 0 10px' },
  whyDesc: { fontSize: 13.5, color: MUTE, lineHeight: 1.7, margin: 0 },

  processWrap: { display: 'flex', justifyContent: 'space-between', gap: 8, position: 'relative' },
  processLine: { position: 'absolute', top: 32, left: '7%', right: '7%', height: 2, background: `linear-gradient(90deg,${PURPLE},${PINK})`, opacity: 0.4, zIndex: 0 },
  pStep: { flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 },
  pCircle: { width: 64, height: 64, borderRadius: '50%', background: '#fff', border: `2px solid ${PURPLE2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px', boxShadow: '0 8px 20px rgba(124,58,237,0.15)' },
  pNum: { fontSize: 13, fontWeight: 900, color: PURPLE, marginBottom: 4 },
  pTitle: { fontSize: 15, fontWeight: 800, color: INK, marginBottom: 6 },
  pDesc: { fontSize: 12, color: MUTE, lineHeight: 1.6, padding: '0 4px' },

  techRow: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14 },
  techCard: { width: 110, background: '#fff', border: '1px solid #eee', borderRadius: 16, padding: '20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, boxShadow: '0 6px 18px rgba(20,20,46,0.04)' },
  techEmoji: { fontSize: 30 },
  techName: { fontSize: 12.5, fontWeight: 700, color: INK },

  appsGrid: { display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16 },
  appCard: { background: '#fff', border: '1px solid #eee', borderRadius: 18, padding: 14, textAlign: 'center', boxShadow: '0 6px 18px rgba(20,20,46,0.04)' },
  miniPhone: { position: 'relative', height: 200, borderRadius: 22, overflow: 'hidden', marginBottom: 12, padding: 12 },
  miniNotch: { position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 40, height: 5, background: 'rgba(255,255,255,0.6)', borderRadius: 4 },
  miniHeader: { marginTop: 18, height: 40, background: 'rgba(255,255,255,0.55)', borderRadius: 10, marginBottom: 10 },
  miniRow: { height: 26, background: 'rgba(255,255,255,0.4)', borderRadius: 8, marginBottom: 8 },
  appLabel: { fontSize: 13.5, fontWeight: 800, color: INK },

  revGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22, marginBottom: 40 },
  revCard: { background: '#fff', border: '1px solid #eee', borderRadius: 18, padding: 24, boxShadow: '0 8px 24px rgba(20,20,46,0.05)' },
  revImg: { width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', background: '#eee' },
  revText: { fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0, fontStyle: 'italic' },
  logoRow: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20, borderTop: '1px solid #eee', paddingTop: 30 },
  logo: { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 800 },

  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 },
  statCard: { display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1px solid #eee', borderRadius: 16, padding: '20px 22px', boxShadow: '0 6px 18px rgba(20,20,46,0.04)' },
  statIcon: { width: 48, height: 48, borderRadius: 12, background: '#f3ecff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 },
  statNum: { fontSize: 26, fontWeight: 900, background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  statLabel: { fontSize: 12.5, color: MUTE, marginTop: 2 },

  cta: { position: 'relative', maxWidth: 1232, margin: '0 auto', borderRadius: 28, padding: '56px 48px', background: 'linear-gradient(120deg,#7c3aed,#a855f7 45%,#ec4899)', display: 'flex', alignItems: 'center', gap: 30, overflow: 'hidden', flexWrap: 'wrap' },
  ctaGlow: { position: 'absolute', top: -60, right: -40, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', filter: 'blur(60px)' },
  ctaLeft: { flex: 1, minWidth: 300, position: 'relative', zIndex: 1 },
  ctaPill: { display: 'inline-block', padding: '6px 14px', background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 16 },
  ctaH: { fontSize: 'clamp(26px,3.4vw,42px)', fontWeight: 900, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1.15 },
  ctaSub: { color: 'rgba(255,255,255,0.9)', fontSize: 15, lineHeight: 1.7, margin: '0 0 26px', maxWidth: 440 },
  ctaBtn: { display: 'inline-flex', alignItems: 'center', padding: '14px 30px', background: '#fff', color: PURPLE, borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 800, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  ctaRobot: { fontSize: 160, lineHeight: 1, position: 'relative', zIndex: 1, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.25))' },
};
