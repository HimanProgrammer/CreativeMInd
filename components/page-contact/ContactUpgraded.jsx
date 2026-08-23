'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/siteConfig';
import { rtdb } from '@/lib/firebase';
import { ref, push, serverTimestamp } from 'firebase/database';

const ORANGE = '#f05a28';
const INK = '#141426';
const MUTE = '#6b7280';

// Where submissions are emailed + stored.
const FORMSUBMIT_EMAIL = 'hb.1991graphicwebsitedesign@gmail.com';
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`;

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' };

const METHODS = [
  {
    icon: '📞', label: 'Call us', accent: '#f05a28',
    value: SITE.phone, href: SITE.phoneTel, note: 'Mon–Sat, 10am–7pm IST',
  },
  {
    icon: '✉️', label: 'Email us', accent: '#8b5cf6',
    value: SITE.email, href: SITE.emailHref, note: 'We reply within 24 hours',
  },
  {
    icon: '📍', label: 'Visit us', accent: '#0ea5e9',
    value: SITE.addressShort || SITE.city, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`,
    note: SITE.address,
  },
];

const SERVICES = ['Website Development', 'App Development', 'UI/UX Design', 'Branding', 'SEO', 'Social Media', 'Other'];

export default function ContactUpgraded() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState(null); // null | 'sending' | 'ok' | 'err'
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setStatus('err'); setError('Please fill in your name, email and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('err'); setError('Please enter a valid email address.');
      return;
    }

    setStatus('sending');

    const phone = form.phone.trim();
    const service = form.subject || '';

    // 1) FormSubmit — emails the enquiry to the inbox.
    const sendEmail = () =>
      fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name, email, phone, service, message,
          _subject: `New enquiry from ${name} — CreativeMind website`,
          _template: 'table',
          _captcha: 'false',
        }),
      }).then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok || j.success === 'false') throw new Error(j.message || 'FormSubmit failed');
        return true;
      });

    // 2) Firebase Realtime Database — stores the enquiry.
    const saveRtdb = () => {
      if (!rtdb) return Promise.reject(new Error('RTDB not configured'));
      return push(ref(rtdb, 'contactMessages'), {
        name, email, phone, service, message, createdAt: serverTimestamp(),
      });
    };

    // Fire both; the message is "sent" if EITHER the email or the database
    // write succeeds, so one service being down never blocks the user.
    const results = await Promise.allSettled([sendEmail(), saveRtdb()]);
    const anyOk = results.some((r) => r.status === 'fulfilled');

    if (anyOk) {
      setStatus('ok');
      setForm(EMPTY);
    } else {
      setStatus('err');
      setError('Could not send your message right now. Please email us directly at ' + SITE.email + '.');
    }
  }

  return (
    <section style={S.page}>
      {/* soft background glows */}
      <div style={S.glowWrap} aria-hidden>
        <span style={{ ...S.glow, background: ORANGE, top: -80, left: '8%' }} />
        <span style={{ ...S.glow, background: '#8b5cf6', top: 120, right: '6%' }} />
      </div>

      {/* ── Hero ── */}
      <div style={S.hero}>
        <span style={S.eyebrow}>✦ GET IN TOUCH</span>
        <h1 style={S.h1}>
          Let&apos;s build something<br />
          <span style={S.grad}>great together.</span>
        </h1>
        <p style={S.heroSub}>
          Have a project in mind or just want to say hello? Tell us a little about it and
          we&apos;ll get back to you within one business day.
        </p>
      </div>

      {/* ── Method cards ── */}
      <div style={S.methods} className="cu-methods">
        {METHODS.map((m) => (
          <a
            key={m.label}
            href={m.href}
            target={m.href.startsWith('http') ? '_blank' : undefined}
            rel={m.href.startsWith('http') ? 'noreferrer' : undefined}
            style={S.methodCard}
            className="cu-card"
          >
            <span style={{ ...S.methodIcon, background: m.accent + '18', color: m.accent }}>{m.icon}</span>
            <span style={S.methodLabel}>{m.label}</span>
            <span style={S.methodValue}>{m.value}</span>
            <span style={S.methodNote}>{m.note}</span>
          </a>
        ))}
      </div>

      {/* ── Form + aside ── */}
      <div style={S.grid} className="cu-grid">
        {/* Left: pitch + socials */}
        <aside style={S.aside}>
          <h2 style={S.asideH}>Start the conversation</h2>
          <p style={S.asideP}>
            Fill out the form and our team will reach out to discuss your goals, timeline and
            budget — no obligation, no sales pressure.
          </p>
          <ul style={S.checkList}>
            {['Free project consultation', 'Response within 24 hours', 'Clear, upfront pricing', 'NDA available on request'].map((c) => (
              <li key={c} style={S.checkItem}>
                <span style={S.checkTick}>✓</span> {c}
              </li>
            ))}
          </ul>
          <div style={S.socialRow}>
            {[
              { i: 'fab fa-instagram', href: SITE.social.instagram },
              { i: 'fab fa-facebook-f', href: SITE.social.facebook },
              { i: 'fab fa-linkedin-in', href: SITE.social.linkedin },
              { i: 'fab fa-behance', href: SITE.social.behance },
            ].filter((s) => s.href && s.href !== '#').map((s) => (
              <a key={s.i} href={s.href} target="_blank" rel="noreferrer" style={S.socialBtn} className="cu-social">
                <i className={s.i}></i>
              </a>
            ))}
          </div>
        </aside>

        {/* Right: the form */}
        <div style={S.formCard}>
          {status === 'ok' ? (
            <div style={S.success}>
              <div style={{ fontSize: 46, marginBottom: 12 }}>✅</div>
              <h3 style={S.successH}>Message sent — thank you!</h3>
              <p style={S.successP}>We&apos;ve received your enquiry and will get back to you within 24 hours.</p>
              <button type="button" onClick={() => setStatus(null)} style={S.againBtn}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div style={S.row2} className="cu-row2">
                <Field label="Your name *" value={form.name} onChange={set('name')} placeholder="Jane Doe" disabled={status === 'sending'} />
                <Field label="Email *" type="email" value={form.email} onChange={set('email')} placeholder="jane@example.com" disabled={status === 'sending'} />
              </div>
              <div style={S.row2} className="cu-row2">
                <Field label="Phone" value={form.phone} onChange={set('phone')} placeholder="+91 …" disabled={status === 'sending'} />
                <div style={{ flex: 1 }}>
                  <label style={S.label}>Service</label>
                  <select value={form.subject} onChange={set('subject')} disabled={status === 'sending'} style={S.input}>
                    <option value="">Select a service…</option>
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 4 }}>
                <label style={S.label}>Message *</label>
                <textarea value={form.message} onChange={set('message')} rows={5}
                  placeholder="Tell us about your project…" disabled={status === 'sending'}
                  style={{ ...S.input, resize: 'vertical', minHeight: 120 }} />
              </div>

              {status === 'err' && error && <p style={S.error}>{error}</p>}

              <button type="submit" disabled={status === 'sending'} style={{ ...S.submit, opacity: status === 'sending' ? 0.65 : 1 }} className="cu-submit">
                {status === 'sending' ? 'Sending…' : 'Send Message'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 8 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <p style={S.privacy}>
                By submitting, you agree to our <Link href="/privacy-policy" style={{ color: ORANGE }}>privacy policy</Link>.
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .cu-card { transition: transform .2s, box-shadow .2s, border-color .2s; }
        .cu-card:hover { transform: translateY(-5px); box-shadow: 0 20px 44px rgba(20,20,43,0.1); border-color: rgba(240,90,40,0.35); }
        .cu-social { transition: transform .2s, background .2s, color .2s; }
        .cu-social:hover { transform: translateY(-3px); background: ${ORANGE}; color: #fff; }
        .cu-submit { transition: transform .2s, box-shadow .2s; }
        .cu-submit:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(240,90,40,0.4); }
        @media (max-width: 900px) {
          .cu-grid { grid-template-columns: 1fr !important; }
          .cu-methods { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 620px) {
          .cu-row2 { flex-direction: column !important; }
        }
      `}</style>
    </section>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder, disabled }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={S.label}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} style={S.input} />
    </div>
  );
}

const S = {
  page: { position: 'relative', background: '#fff', color: INK, fontFamily: 'Inter, system-ui, sans-serif', padding: '130px 24px 70px', overflow: 'hidden' },
  glowWrap: { position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 },
  glow: { position: 'absolute', width: 360, height: 360, borderRadius: '50%', filter: 'blur(120px)', opacity: 0.14 },

  hero: { position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto 44px', textAlign: 'center' },
  eyebrow: { display: 'inline-block', fontSize: 11.5, fontWeight: 800, letterSpacing: '0.2em', color: ORANGE, marginBottom: 16 },
  h1: { fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.025em', margin: '0 0 18px' },
  grad: { background: 'linear-gradient(95deg,#f05a28,#e040fb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  heroSub: { fontSize: 16, lineHeight: 1.75, color: MUTE, margin: 0 },

  methods: { position: 'relative', zIndex: 1, maxWidth: 1080, margin: '0 auto 40px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 },
  methodCard: { display: 'flex', flexDirection: 'column', gap: 4, padding: '24px 22px', background: '#fff', border: '1px solid #ececf3', borderRadius: 16, textDecoration: 'none', boxShadow: '0 8px 24px rgba(20,20,43,0.05)' },
  methodIcon: { width: 46, height: 46, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 10 },
  methodLabel: { fontSize: 12, fontWeight: 700, color: MUTE, letterSpacing: '0.04em', textTransform: 'uppercase' },
  methodValue: { fontSize: 16.5, fontWeight: 800, color: INK, wordBreak: 'break-word' },
  methodNote: { fontSize: 12.5, color: '#9ca3af', marginTop: 2 },

  grid: { position: 'relative', zIndex: 1, maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 30, alignItems: 'start' },
  aside: { padding: '8px 4px' },
  asideH: { fontSize: 24, fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.02em' },
  asideP: { fontSize: 14.5, lineHeight: 1.75, color: MUTE, margin: '0 0 22px' },
  checkList: { listStyle: 'none', padding: 0, margin: '0 0 26px' },
  checkItem: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#374151', padding: '7px 0' },
  checkTick: { width: 22, height: 22, borderRadius: '50%', background: '#ecfdf5', color: '#16a34a', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  socialRow: { display: 'flex', gap: 12 },
  socialBtn: { width: 42, height: 42, borderRadius: 12, background: '#f4f4f7', border: '1px solid #ececf3', color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none' },

  formCard: { background: '#fff', border: '1px solid #ececf3', borderRadius: 20, padding: 'clamp(22px,3vw,34px)', boxShadow: '0 20px 50px rgba(20,20,43,0.07)' },
  row2: { display: 'flex', gap: 16, marginBottom: 16 },
  label: { display: 'block', fontSize: 12.5, fontWeight: 600, color: '#4b5563', marginBottom: 7 },
  input: { width: '100%', padding: '12px 14px', background: '#f9f9fb', border: '1px solid #e5e5ee', borderRadius: 10, color: INK, fontSize: 14.5, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  error: { color: '#dc2626', fontSize: 13.5, margin: '16px 0 0', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10 },
  submit: { marginTop: 20, width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '15px 24px', background: `linear-gradient(95deg,${ORANGE},#ff7a4d)`, color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 26px rgba(240,90,40,0.32)' },
  privacy: { fontSize: 12, color: '#9ca3af', textAlign: 'center', margin: '14px 0 0' },

  success: { textAlign: 'center', padding: '40px 20px' },
  successH: { fontSize: 22, fontWeight: 900, margin: '0 0 10px' },
  successP: { fontSize: 14.5, color: MUTE, lineHeight: 1.7, margin: 0 },
  againBtn: { marginTop: 22, padding: '12px 26px', borderRadius: 30, background: ORANGE, color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' },
};
