'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import loadBackgroudImages from '@/common/loadBackgroudImages';

function Header() {
  useLayoutEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.header', { y: 200 }, { y: 0 }, '+=2.5');
    tl.fromTo(
      '.header .container',
      { opacity: 0, translateY: 40 },
      { opacity: 1, translateY: 0 },
      '-=0'
    );
    return () => tl.kill();
  }, []);

  useEffect(() => {
    loadBackgroudImages();
  }, []);

  return (
    <div
      className="header page-header bg-img section-padding valign"
      data-background="/assets/imgs/background/bg4.jpg"
      data-overlay-dark="8"
    >
      <div className="container pt-80">
        <div className="row">
          <div className="col-12">
            <div className="text-center">
              <p className="main-color sub-title mb-15 fz-14" style={{ letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                What We Offer
              </p>
              <h1 className="text-u ls1 fz-80">
                Our <span className="fw-200">Services</span>
              </h1>
              <p className="mt-30 p-color" style={{ maxWidth: 560, margin: '24px auto 0', fontSize: 16, lineHeight: 1.8 }}>
                From strategy to execution — we build digital products, brands, and experiences that grow your business.
              </p>
            </div>

            {/* Service pills */}
            <div className="d-flex flex-wrap justify-content-center mt-50" style={{ gap: 12 }}>
              {['Web Development', 'Mobile Apps', 'UI/UX Design', 'Branding', 'Digital Marketing', 'Social Media'].map((s) => (
                <span
                  key={s}
                  style={{
                    padding: '8px 20px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 50,
                    color: '#ccc',
                    fontSize: 13,
                    fontWeight: 500,
                    backdropFilter: 'blur(6px)',
                    background: 'rgba(255,255,255,0.05)',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
