'use client';
import React, { useEffect, useRef, useState } from 'react';

const STATS = [
  { end: 100,  suffix: '%',  label: 'Client Satisfaction',  icon: '🤝', desc: 'Happy clients across every project' },
  { end: 6700, suffix: '+',  label: 'Projects Completed',   icon: '🚀', desc: 'Delivered on time, every time' },
  { end: 34,   suffix: '+',  label: 'Awards & Recognition', icon: '🏆', desc: 'Industry-leading design awards' },
  { end: 12,   suffix: '+',  label: 'Years of Excellence',  icon: '📅', desc: 'Building brands since 2012' },
];

function useCountUp(end, duration = 2000, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, started]);
  return count;
}

function StatCard({ stat, started, index }) {
  const count = useCountUp(stat.end, 1800 + index * 200, started);
  const colors = ['#f05a28', '#6c63ff', '#f59e0b', '#00bfa5'];
  const color = colors[index];

  return (
    <div style={{
      position: 'relative',
      background: '#fff',
      borderRadius: 24,
      padding: '40px 32px',
      boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.06)',
      overflow: 'hidden',
      transition: 'transform 0.3s, box-shadow 0.3s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = `0 20px 50px ${color}22`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)';
    }}
    >
      {/* Gradient corner blob */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 100, height: 100, borderRadius: '50%',
        background: `${color}18`,
        pointerEvents: 'none',
      }} />

      {/* Bottom accent bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, ${color}, transparent)`,
        borderRadius: '0 0 24px 24px',
      }} />

      {/* Icon */}
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `${color}12`,
        border: `1.5px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, marginBottom: 24,
      }}>
        {stat.icon}
      </div>

      {/* Number */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, marginBottom: 6 }}>
        <span style={{
          fontSize: 54, fontWeight: 900, lineHeight: 1,
          color: '#111', letterSpacing: '-2px',
        }}>
          {started ? count.toLocaleString() : 0}
        </span>
        <span style={{
          fontSize: 28, fontWeight: 800, color: color,
          lineHeight: 1.4, marginBottom: 4,
        }}>
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <div style={{ fontSize: 15, fontWeight: 700, color: '#222', marginBottom: 6 }}>
        {stat.label}
      </div>

      {/* Desc */}
      <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>
        {stat.desc}
      </div>
    </div>
  );
}

function Numbers() {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{
      padding: '100px 0',
      background: 'linear-gradient(180deg, #f8f8fb 0%, #fff 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle bg pattern */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 60, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(240,90,40,0.08)', border: '1px solid rgba(240,90,40,0.18)',
              borderRadius: 50, padding: '5px 16px',
              color: '#f05a28', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f05a28' }} />
              Our Impact
            </div>
            <h2 style={{ color: '#111', fontSize: 40, fontWeight: 800, margin: 0, letterSpacing: '-0.5px', lineHeight: 1.15 }}>
              Numbers that <span style={{
                background: 'linear-gradient(135deg, #f05a28, #e040fb)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>define us</span>
            </h2>
          </div>
          <p style={{ color: '#999', fontSize: 15, maxWidth: 320, margin: 0, lineHeight: 1.7 }}>
            Over a decade of creating digital experiences that drive real business growth.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {STATS.map((s, i) => (
            <StatCard key={i} stat={s} started={started} index={i} />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div style={{
          marginTop: 48,
          background: 'linear-gradient(135deg, #111 0%, #1a1a2e 100%)',
          borderRadius: 20, padding: '32px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
        }}>
          <div>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
              Ready to be our next success story?
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
              Let&apos;s build something extraordinary together.
            </div>
          </div>
          <a href="/page-contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, #f05a28, #e040fb)',
            color: '#fff', padding: '14px 32px', borderRadius: 50,
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(240,90,40,0.35)',
            whiteSpace: 'nowrap',
          }}>
            Start a Project <span style={{ fontSize: 18 }}>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default Numbers;
