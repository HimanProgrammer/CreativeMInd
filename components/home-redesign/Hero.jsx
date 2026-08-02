'use client';
import React, { useEffect, useRef, useState } from 'react';
import PaperRollStage from './PaperRollStage';

const SLIDES = [
  { key: 'showcase', label: 'Studio Showcase' },
  { key: 'press', label: 'The Printing Press' },
];
const SLIDE_MS = 8000;

const TECH_ICONS = [
  { icon: '⚛', label: 'React', color: '#61dafb', x: '12%', y: '18%', delay: '0s', size: 44 },
  { icon: '▲', label: 'Next.js', color: '#fff', x: '82%', y: '14%', delay: '0.4s', size: 40 },
  { icon: '🎨', label: 'UI/UX', color: '#a78bfa', x: '88%', y: '72%', delay: '0.8s', size: 40 },
  { icon: '📱', label: 'Mobile', color: '#34d399', x: '6%', y: '75%', delay: '1.2s', size: 40 },
  { icon: '☁', label: 'Cloud', color: '#60a5fa', x: '50%', y: '6%', delay: '0.6s', size: 36 },
  { icon: '🔥', label: 'Firebase', color: '#fb923c', x: '92%', y: '44%', delay: '1s', size: 36 },
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: 3 + Math.random() * 5,
  delay: Math.random() * 4,
  opacity: 0.15 + Math.random() * 0.25,
}));

export default function Hero() {
  const canvasRef = useRef(null);

  // ─── Hero visual slider ───
  const [slide, setSlide] = useState(0);
  const [held, setHeld] = useState(false); // paused while the pointer is on it

  useEffect(() => {
    if (held) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [held, slide]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    let raf;

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      dots.forEach((d) => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = w; if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(240,90,40,0.18)';
        ctx.fill();
      });
      dots.forEach((a, i) => {
        dots.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(240,90,40,${0.07 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <>
      {/* Floating LET'S TALK tab */}
      <a href="/page-contact" className="rd-lets-talk">
        <i className="fas fa-headset" style={{ transform: 'rotate(-90deg)', marginRight: 6 }}></i>
        LET&apos;S TALK
      </a>

      <section className="rd-hero" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>

        {/* Canvas particle network */}
        <canvas ref={canvasRef} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          zIndex: 0, pointerEvents: 'none',
        }} />

        {/* Gradient mesh background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse 70% 60% at 80% 30%, rgba(240,90,40,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 70%, rgba(91,33,182,0.05) 0%, transparent 60%)',
        }} />

        {/* Decorative blobs */}
        <div className="rd-blob rd-blob-1" />
        <div className="rd-blob rd-blob-2" />

        {/* Large decorative ring */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 700, height: 700,
          border: '1px solid rgba(240,90,40,0.04)',
          borderRadius: '50%', transform: 'translate(-50%,-50%)',
          zIndex: 0, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 900, height: 900,
          border: '1px solid rgba(91,33,182,0.03)',
          borderRadius: '50%', transform: 'translate(-50%,-50%)',
          zIndex: 0, pointerEvents: 'none',
        }} />

        {/* Floating tech icons */}
        {TECH_ICONS.map((t) => (
          <div key={t.label} style={{
            position: 'absolute', left: t.x, top: t.y,
            zIndex: 1, pointerEvents: 'none',
            animation: `rd-float ${3.5 + parseFloat(t.delay) + 1.5}s ${t.delay} ease-in-out infinite`,
          }}>
            <div style={{
              width: t.size, height: t.size,
              background: `rgba(255,255,255,0.9)`,
              border: `1.5px solid ${t.color}22`,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: t.size * 0.5,
              boxShadow: `0 4px 20px ${t.color}20`,
              backdropFilter: 'blur(8px)',
            }}>
              {t.icon}
            </div>
          </div>
        ))}

        {/* Geometric accents */}
        <div style={{
          position: 'absolute', bottom: '15%', left: '3%',
          width: 56, height: 56, border: '2px solid rgba(240,90,40,0.12)',
          borderRadius: 14, transform: 'rotate(20deg)',
          animation: 'rd-float 5s ease-in-out infinite', zIndex: 1,
        }} />
        <div style={{
          position: 'absolute', top: '25%', right: '3%',
          width: 36, height: 36,
          background: 'rgba(91,33,182,0.07)',
          borderRadius: '50%', animation: 'rd-float 4s 1s ease-in-out infinite', zIndex: 1,
        }} />

        {/* ─── THE HERO IS THE SLIDER ─── */}
        <div
          className="rd-hero-slider"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          aria-roledescription="carousel"
        >
          <div className="rd-hero-track" style={{ transform: `translateX(-${slide * 100}%)` }}>

            {/* ══ SLIDE 1 — the pitch ══ */}
            <div className="rd-hero-slide" aria-hidden={slide !== 0}>
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 120 }}>
          <div className="row align-items-center" style={{ minHeight: '80vh' }}>

            {/* ─── LEFT CONTENT ─── */}
            <div className="col-lg-6 col-md-12" style={{ paddingBottom: 60 }}>

              {/* Badge */}
              <div className="rd-hero-badge" style={{ marginBottom: 28 }}>
                <span style={{
                  width: 8, height: 8, background: '#f05a28',
                  borderRadius: '50%', display: 'inline-block',
                  boxShadow: '0 0 0 3px rgba(240,90,40,0.2)',
                  marginRight: 8, flexShrink: 0,
                }}></span>
                ✦ WE BUILD BRANDS &amp; DIGITAL FUTURES ✦
              </div>

              {/* Headline */}
              <h1 style={{ lineHeight: 1.08, marginBottom: 20, fontWeight: 800 }}>
                {[
                  { text: 'Transforming', color: false, delay: '0.1s' },
                  { text: 'Ideas', color: false, delay: '0.22s' },
                  { text: 'Into', color: false, delay: '0.34s', br: true },
                  { text: 'Digital', color: true, delay: '0.46s' },
                  { text: 'Experiences', color: true, delay: '0.58s' },
                ].map((w, i) => (
                  <React.Fragment key={i}>
                    <span
                      className="rd-hero-word"
                      style={{
                        animationDelay: w.delay,
                        marginRight: '0.22em',
                        background: w.color
                          ? 'linear-gradient(135deg, #f05a28, #e040fb)'
                          : 'none',
                        WebkitBackgroundClip: w.color ? 'text' : 'initial',
                        WebkitTextFillColor: w.color ? 'transparent' : 'inherit',
                        backgroundClip: w.color ? 'text' : 'initial',
                      }}
                    >
                      {w.text}
                    </span>
                    {w.br && <br />}
                  </React.Fragment>
                ))}
              </h1>

              {/* Service tags */}
              <div className="rd-hero-services" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                {['Web Dev', 'Mobile Apps', 'UI/UX Design', 'Branding', 'Digital Marketing'].map((s) => (
                  <span key={s} style={{
                    padding: '5px 14px', borderRadius: 20,
                    border: '1px solid rgba(240,90,40,0.2)',
                    background: 'rgba(240,90,40,0.05)',
                    fontSize: 12, fontWeight: 600, color: '#f05a28',
                    letterSpacing: '0.03em',
                  }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="rd-hero-btns" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
                <a href="/page-contact" className="rd-btn-primary" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '15px 32px', background: 'linear-gradient(135deg, #f05a28, #e8421a)',
                  color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 13,
                  textDecoration: 'none', letterSpacing: '0.06em',
                  boxShadow: '0 8px 30px rgba(240,90,40,0.35)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}>
                  GET FREE CONSULTATION
                  <i className="fas fa-arrow-right"></i>
                </a>
                <a href="/portfolio-masonry" className="rd-btn-outline" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '15px 28px', border: '1.5px solid rgba(240,90,40,0.3)',
                  color: '#f05a28', borderRadius: 12, fontWeight: 700, fontSize: 13,
                  textDecoration: 'none', letterSpacing: '0.06em',
                  background: 'transparent',
                  transition: 'background 0.2s, border-color 0.2s',
                }}>
                  <span style={{
                    width: 30, height: 30,
                    background: 'rgba(240,90,40,0.1)', borderRadius: '50%',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className="fas fa-play" style={{ fontSize: 9, marginLeft: 2 }}></i>
                  </span>
                  VIEW OUR WORK
                </a>
              </div>

              {/* Trust row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
                animation: 'rd-fade-up 0.7s 1s ease both',
              }}>
                {/* Avatars */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {['#f05a28','#5b21b6','#0ea5e9','#10b981','#f59e0b'].map((c, i) => (
                    <div key={i} style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${c}, ${c}99)`,
                      border: '2.5px solid #fff',
                      marginLeft: i > 0 ? -10 : 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, color: '#fff', fontWeight: 700,
                    }}>
                      {['J','M','A','R','S'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: '#6c757d', fontWeight: 600 }}>
                    50+ Happy Clients · 99% Satisfaction
                  </span>
                </div>
                <div style={{ width: 1, height: 36, background: '#e0e0e0' }} />
                <div style={{ fontSize: 12, color: '#6c757d' }}>
                  <span style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 18 }}>5+</span> yrs experience
                </div>
              </div>
            </div>

            {/* ─── RIGHT VISUAL ─── */}
            <div className="col-lg-6 col-md-12">
              <div className="rd-hero-img-wrap" style={{ position: 'relative', textAlign: 'center' }}>

                {/* Outer decorative ring (spinning) */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: 380, height: 380,
                  border: '1.5px dashed rgba(240,90,40,0.18)',
                  borderRadius: '50%',
                  transform: 'translate(-50%,-50%)',
                  animation: 'rd-spin-slow 22s linear infinite',
                  zIndex: 0,
                }}>
                  {/* Orbit dot 1 */}
                  <div style={{
                    position: 'absolute', top: -7, left: '50%',
                    width: 14, height: 14, background: '#f05a28',
                    borderRadius: '50%', transform: 'translateX(-50%)',
                    boxShadow: '0 0 0 4px rgba(240,90,40,0.2)',
                  }} />
                </div>

                {/* Inner ring */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: 260, height: 260,
                  border: '1px solid rgba(91,33,182,0.12)',
                  borderRadius: '50%',
                  transform: 'translate(-50%,-50%)',
                  animation: 'rd-spin-slow 16s linear infinite reverse',
                  zIndex: 0,
                }}>
                  <div style={{
                    position: 'absolute', bottom: -5, left: '50%',
                    width: 10, height: 10, background: '#5b21b6',
                    borderRadius: '50%', transform: 'translateX(-50%)',
                  }} />
                </div>

                {/* Outer ring 2 */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: 500, height: 500,
                  border: '1px solid rgba(91,33,182,0.05)',
                  borderRadius: '50%',
                  transform: 'translate(-50%,-50%)',
                  animation: 'rd-spin-slow 35s linear infinite',
                  zIndex: 0,
                }}>
                  <div style={{
                    position: 'absolute', top: '10%', right: -5,
                    width: 10, height: 10,
                    background: 'linear-gradient(135deg,#f05a28,#e040fb)',
                    borderRadius: '50%',
                  }} />
                </div>

                {/* Glow behind image */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: 280, height: 280,
                  background: 'radial-gradient(circle, rgba(240,90,40,0.12) 0%, transparent 70%)',
                  transform: 'translate(-50%,-50%)',
                  zIndex: 0,
                }} />

                {/* Main hero image */}
                <img
                  src="/assets/imgs/header/2.jpg"
                  alt="Digital Solutions"
                  style={{
                    width: '88%', maxWidth: 540,
                    borderRadius: 28,
                    boxShadow: '0 40px 100px rgba(0,0,0,0.14), 0 0 0 1px rgba(240,90,40,0.06)',
                    position: 'relative', zIndex: 1,
                    animation: 'rd-float 6s ease-in-out infinite',
                  }}
                />

                {/* Badge: Projects Delivered */}
                <div style={{
                  position: 'absolute', bottom: 40, left: -10,
                  background: 'linear-gradient(135deg, #f05a28, #e8421a)',
                  color: '#fff', borderRadius: 16,
                  padding: '16px 22px',
                  boxShadow: '0 12px 40px rgba(240,90,40,0.4)',
                  zIndex: 2,
                  animation: 'rd-float 4.5s ease-in-out infinite',
                  minWidth: 120,
                }}>
                  <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>50+</div>
                  <div style={{ fontSize: 11, opacity: 0.9, marginTop: 3, fontWeight: 600 }}>Projects Delivered</div>
                </div>

                {/* Badge: Years Experience */}
                <div style={{
                  position: 'absolute', top: 24, right: -10,
                  background: '#fff', color: '#1a1a2e',
                  borderRadius: 16, padding: '16px 22px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                  zIndex: 2,
                  animation: 'rd-float 5.5s 0.8s ease-in-out infinite',
                  minWidth: 110,
                }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#f05a28', lineHeight: 1 }}>5+</div>
                  <div style={{ fontSize: 11, color: '#6c757d', marginTop: 3, fontWeight: 600 }}>Years Experience</div>
                </div>

                {/* Badge: Rating */}
                <div style={{
                  position: 'absolute', top: '48%', right: -20,
                  background: '#fff', borderRadius: 14,
                  padding: '12px 18px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)', zIndex: 2,
                  animation: 'rd-float 3.8s 1.2s ease-in-out infinite',
                }}>
                  <div style={{ color: '#fbbf24', fontSize: 13, marginBottom: 3 }}>★★★★★</div>
                  <div style={{ fontSize: 11, color: '#6c757d', fontWeight: 600 }}>99% Satisfaction</div>
                </div>

                {/* Badge: Live badge */}
                <div style={{
                  position: 'absolute', top: '72%', left: 10,
                  background: '#fff', borderRadius: 12,
                  padding: '10px 14px',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.08)', zIndex: 2,
                  animation: 'rd-float 4s 2s ease-in-out infinite',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{
                    width: 8, height: 8, background: '#10b981',
                    borderRadius: '50%', display: 'inline-block',
                    boxShadow: '0 0 0 3px rgba(16,185,129,0.2)',
                  }} />
                  <span style={{ fontSize: 11, color: '#1a1a2e', fontWeight: 700 }}>Available Now</span>
                </div>
              </div>
            </div>

          </div>
        </div>
            </div>

            {/* ══ SLIDE 2 — the printing press, full bleed ══ */}
            <div className="rd-hero-slide rd-hero-slide-press" aria-hidden={slide !== 1}>
              {/* only the slide on show animates */}
              <PaperRollStage active={slide === 1} />

              <div className="rd-hero-press-copy">
                <p className="rd-hero-press-tag">✦ THE PRESS ✦</p>
                <h2>Our Work,<br /><span>Printed Live</span></h2>
                <p className="rd-hero-press-lead">
                  Every pass of the roll lays down another piece from our portfolio.
                  Move your cursor to steer it.
                </p>
                <a href="/portfolio-masonry" className="rd-hero-press-cta">
                  SEE THE FULL PORTFOLIO <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── controls ── */}
          <button
            type="button"
            className="rd-hero-arrow rd-hero-prev"
            onClick={() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)}
            aria-label="Previous slide"
          >‹</button>
          <button
            type="button"
            className="rd-hero-arrow rd-hero-next"
            onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
            aria-label="Next slide"
          >›</button>

          <div className="rd-hero-dots">
            {SLIDES.map((s, i) => (
              <button
                key={s.key}
                type="button"
                className={'rd-hero-dot' + (i === slide ? ' is-on' : '')}
                onClick={() => setSlide(i)}
                aria-label={s.label}
                aria-current={i === slide}
              />
            ))}
          </div>
        </div>

        {/* ─── SCROLL INDICATOR ─── */}
        <div className="rd-hero-scroll" style={{
          textAlign: 'center',
          animation: 'rd-fade-up 0.7s 1.4s ease both',
        }}>
          <div style={{
            display: 'inline-flex', flexDirection: 'column',
            alignItems: 'center', gap: 6,
            color: '#aaa', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <span>Scroll to explore</span>
            <div style={{
              width: 22, height: 36, border: '1.5px solid rgba(0,0,0,0.15)',
              borderRadius: 12, display: 'flex', justifyContent: 'center',
              paddingTop: 6,
            }}>
              <div style={{
                width: 3, height: 8, background: '#f05a28',
                borderRadius: 3,
                animation: 'rd-scroll-dot 1.6s ease infinite',
              }} />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes rd-scroll-dot {
          0%   { transform: translateY(0); opacity: 1; }
          80%  { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .rd-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(240,90,40,0.45) !important;
        }
        .rd-btn-outline:hover {
          background: rgba(240,90,40,0.06) !important;
          border-color: #f05a28 !important;
        }

        /* ─── the hero IS the slider: full-bleed, full-viewport slides ─── */
        .rd-hero-slider {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          z-index: 2;
        }
        .rd-hero-track {
          display: flex;
          width: 100%;
          min-height: 100vh;
          transition: transform 0.85s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .rd-hero-slide {
          flex: 0 0 100%;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* descendant, not child: a raw child-combinator character inside a JSX
           style tag is HTML-escaped on the server only, which trips hydration */
        .rd-hero-slide .container { width: 100%; }

        /* the press slide: the roll fills the whole hero, copy sits on top */
        .rd-hero-slide-press { position: relative; padding: 0; }
        .rd-hero-slide-press .pr-stage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border-radius: 0;
        }
        .rd-hero-press-copy {
          position: relative;
          z-index: 3;
          max-width: 620px;
          margin-left: 6vw;
          margin-right: auto;
          padding: 34px 38px;
          background: rgba(250,250,251,0.82);
          backdrop-filter: blur(10px);
          border-radius: 22px;
          box-shadow: 0 24px 70px rgba(20,20,43,0.12);
          pointer-events: none; /* the roll still tracks the cursor underneath */
        }
        .rd-hero-press-tag {
          font-size: 11px; font-weight: 700; letter-spacing: 0.28em;
          color: #f05a28; margin: 0 0 14px;
        }
        .rd-hero-press-copy h2 {
          font-size: clamp(38px, 5vw, 68px);
          font-weight: 800; line-height: 1.05; letter-spacing: -0.03em;
          margin: 0 0 18px; color: #14141c;
        }
        .rd-hero-press-copy h2 span {
          background: linear-gradient(135deg, #f05a28, #e040fb);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .rd-hero-press-lead {
          font-size: 15px; line-height: 1.7; color: #5a5a68;
          margin: 0 0 26px; max-width: 440px;
        }
        .rd-hero-press-cta {
          pointer-events: auto;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #f05a28, #e8421a);
          border-radius: 12px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.06em;
          color: #fff; text-decoration: none;
          box-shadow: 0 10px 32px rgba(240,90,40,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .rd-hero-press-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 42px rgba(240,90,40,0.45);
          color: #fff;
        }

        .rd-hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 46px; height: 46px;
          border: 1px solid rgba(240,90,40,0.25);
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(6px);
          border-radius: 50%;
          color: #f05a28;
          font-size: 24px; line-height: 1;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.25s, background 0.2s, color 0.2s;
          z-index: 5;
        }
        .rd-hero-slider:hover .rd-hero-arrow { opacity: 1; }
        .rd-hero-arrow:hover { background: #f05a28; color: #fff; }
        .rd-hero-prev { left: 18px; }
        .rd-hero-next { right: 18px; }

        .rd-hero-dots {
          position: absolute;
          left: 50%; bottom: 96px;
          transform: translateX(-50%);
          display: flex; gap: 9px;
          z-index: 5;
        }
        .rd-hero-dot {
          width: 9px; height: 9px; padding: 0;
          border: none; border-radius: 50%;
          background: rgba(26,26,46,0.2);
          cursor: pointer;
          transition: width 0.3s, background 0.3s;
        }
        .rd-hero-dot.is-on { width: 28px; border-radius: 5px; background: #f05a28; }

        /* the indicator sits over the last slice of the hero */
        .rd-hero-scroll {
          position: absolute;
          left: 0; right: 0; bottom: 26px;
          z-index: 5;
          pointer-events: none;
        }

        @media (max-width: 991px) {
          .rd-hero-press-copy { margin: 0 24px; padding: 26px 24px; }
          .rd-hero-dots { bottom: 84px; }
        }
        @media (max-width: 767px) {
          .rd-hero-arrow { opacity: 1; width: 36px; height: 36px; font-size: 19px; }
          .rd-hero-prev { left: 8px; }
          .rd-hero-next { right: 8px; }
          .rd-hero-press-lead { font-size: 14px; }
        }
      `}</style>
    </>
  );
}
