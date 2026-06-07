import React from 'react';

export default function CTABanner() {
  return (
    <section className="rd-cta">
      <div className="container">
        <div className="rd-cta-content d-flex align-items-center justify-content-between flex-wrap gap-4">
          <div>
            <h2>Ready to Grow Your Business?</h2>
            <p>Let&apos;s build something amazing together.</p>
          </div>
          <a href="/page-contact" className="rd-btn-cta">
            BOOK FREE CONSULTATION
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
