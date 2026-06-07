import React from 'react';

const brands = [
  { icon: 'fab fa-google', name: 'Google' },
  { icon: 'fab fa-meta', name: 'Meta' },
  { icon: 'fab fa-shopify', name: 'Shopify' },
  { icon: 'fab fa-aws', name: 'aws' },
  { icon: 'fab fa-wordpress', name: 'WordPress' },
  { icon: 'fab fa-react', name: 'React' },
  { icon: null, name: 'NEXT.js' },
  { icon: 'fas fa-mobile-alt', name: 'Flutter' },
];

export default function Brands() {
  const doubled = [...brands, ...brands]; // duplicate for seamless loop

  return (
    <section className="rd-brands" style={{ overflow: 'hidden' }}>
      <div className="container">
        <p className="rd-brands-label text-center">TRUSTED BY GLOBAL BRANDS</p>
      </div>
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        {/* Fade edges */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 80,
          background: 'linear-gradient(to right, #fff, transparent)',
          zIndex: 1, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 80,
          background: 'linear-gradient(to left, #fff, transparent)',
          zIndex: 1, pointerEvents: 'none',
        }} />

        <div className="rd-brands-track">
          {doubled.map((b, i) => (
            <div key={i} className="brand-item" style={{ marginRight: 60, flexShrink: 0 }}>
              {b.icon && <i className={b.icon} style={{ fontSize: 22 }}></i>}
              <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: -0.5, whiteSpace: 'nowrap' }}>
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
