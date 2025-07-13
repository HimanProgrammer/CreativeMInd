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

    // Cleanup function
    return () => tl.kill();
  }, []);

  useEffect(() => {
    loadBackgroudImages();
  }, []);
  return (
    <div
      className="header pre-header bg-img valign"
      data-background="/landing-preview/img/bg.jpg"
      data-overlay-dark="7"
    >
      <div className="full-width">
        <div className="container ontop">
          <div className="row mb-40">
            <div className="col-lg-8 valign">
              <div className="caption">
                <h1>
                  The Ultimate{' '}
                  <span className="fw-200">Creative Portfolio</span> Nextjs
                  Template is Here
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <h2>Webfolio</h2>
        </div>
      </div>
      <div
        className="img-header bg-img"
        data-background="/landing-preview/img/head.png"
      ></div>
    </div>
  );
}

export default Header;
