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
    <div className="header crev-header bg-img">
      <div className="container ontop">
        <div className="row justify-content-end">
          <div className="col-lg-12">
            <div className="caption mb-100">
              <div className="row">
                <div className="col-lg-8">
                  <h1 className="text-u">Webfolio</h1>
                  <h1 className="text-u">Full services</h1>
                </div>
                <div className="col-lg-4 d-flex justify-content-end">
                  <div className="circle-button md-hide">
                    <a href="https://youtu.be/AzwC6umvd1s" className="vid">
                      <div className="rotate-circle fz-30 text-u">
                        <svg className="textcircle" viewBox="0 0 500 500">
                          <defs>
                            <path
                              id="textcircle"
                              d="M250,400 a150,150 0 0,1 0,-300a150,150 0 0,1 0,300Z"
                            ></path>
                          </defs>
                          <text>
                            <textPath xlinkHref="#textcircle" textLength="900">
                              Explore More - Explore More -
                            </textPath>
                          </text>
                        </svg>
                      </div>
                      <div className="icon">
                        <i className="fas fa-play"></i>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="row text-left align-items-center">
                <div className="col-lg-3 order-md-2">
                  <p>
                    We back the founders of new forms of network, digital
                    organisations that harness the talents.
                  </p>
                </div>
                <div className="col-lg-9 order-md-1 md-mb30">
                  <h1 className="text-u">Digital agency</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div
              className="full-img bg-img"
              data-background="/assets/imgs/header/2.jpg"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
