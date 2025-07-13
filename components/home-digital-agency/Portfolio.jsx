'use client';
import React from 'react';

function Portfolio() {
  function handleMouseEnter(event) {
    var tab_id = event.currentTarget.getAttribute('data-tab');

    document.querySelectorAll('.glry-img .tab-img').forEach((el) => {
      el.classList.remove('current');
    });
    document.querySelectorAll('.content .cluom').forEach((el) => {
      el.classList.remove('current');
    });

    document.querySelector('#' + tab_id).classList.add('current');
    console.log(document.querySelector('#' + tab_id));
    // document.querySelectorAll('.links-img .img').forEach((el) => {
    //   el.classList.remove('current');
    // });

    if (!event.currentTarget.classList.contains('current')) {
      event.currentTarget.classList.add('current');
    }
  }
  return (
    <section className="portfolio-tab crev section-padding sub-bg">
      <div className="container">
        <div className="sec-head mb-80">
          <div className="d-flex align-items-center">
            <div>
              <span className="sub-title main-color mb-5">Our Portfolio</span>
              <h3 className="fw-600 fz-50 text-u d-rotate wow">
                <span className="rotate-text">
                  Selected <span className="fw-200">Works.</span>
                </span>
              </h3>
            </div>
            <div className="ml-auto vi-more">
              <a
                href="/portfolio-creative"
                className="butn butn-sm butn-bord radius-30"
              >
                <span>View All</span>
              </a>
              <span className="icon ti-arrow-top-right"></span>
            </div>
          </div>
        </div>
        <div className="row lg-marg">
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="glry-img md-mb50">
              <div id="tab-1" className="tab-img current">
                <img src="/assets/imgs/works/1/1.jpg" alt="" />
              </div>
              <div id="tab-2" className="tab-img">
                <img src="/assets/imgs/works/1/6.jpg" alt="" />
              </div>
              <div id="tab-3" className="tab-img">
                <img src="/assets/imgs/works/1/3.jpg" alt="" />
              </div>
              <div id="tab-4" className="tab-img">
                <img src="/assets/imgs/works/1/4.jpg" alt="" />
              </div>
              <div id="tab-5" className="tab-img">
                <img src="/assets/imgs/works/1/5.jpg" alt="" />
              </div>
              <div className="circle-blur">
                <img src="/assets/imgs/patterns/blur1.png" alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-6 content valign">
            <div className="full-width">
              <div
                onMouseEnter={handleMouseEnter}
                className="cluom mb-40 current"
                data-tab="tab-1"
              >
                <div className="info d-flex align-items-end">
                  <h4>
                    <span className="mr-10 fz-16">01.</span>{' '}
                    <a href="/project-details">Iridescent Wallpapers</a>
                  </h4>
                  <h6 className="sub-title p-color ml-20">/ UI-UX Design</h6>
                </div>
                <div className="img">
                  <img src="/assets/imgs/works/1/1.jpg" alt="" />
                </div>
              </div>
              <div
                onMouseEnter={handleMouseEnter}
                className="cluom mb-40"
                data-tab="tab-2"
              >
                <div className="info d-flex align-items-end">
                  <h4>
                    <span className="mr-10 fz-16">02.</span>{' '}
                    <a href="/project-details">Proof Template</a>
                  </h4>
                  <h6 className="sub-title p-color ml-20">/ Marketing</h6>
                </div>
                <div className="img">
                  <img src="/assets/imgs/works/1/2.jpeg" alt="" />
                </div>
              </div>
              <div
                onMouseEnter={handleMouseEnter}
                className="cluom mb-40"
                data-tab="tab-3"
              >
                <div className="info d-flex align-items-end">
                  <h4>
                    <span className="mr-10 fz-16">03.</span>{' '}
                    <a href="/project-details">Ledge Phone</a>
                  </h4>
                  <h6 className="sub-title p-color ml-20">/ Branding</h6>
                </div>
                <div className="img">
                  <img src="/assets/imgs/works/1/3.jpg" alt="" />
                </div>
              </div>
              <div
                onMouseEnter={handleMouseEnter}
                className="cluom mb-40"
                data-tab="tab-4"
              >
                <div className="info d-flex align-items-end">
                  <h4>
                    <span className="mr-10 fz-16">04.</span>{' '}
                    <a href="/project-details">Frame Sans</a>
                  </h4>
                  <h6 className="sub-title p-color ml-20">/ App Design</h6>
                </div>
                <div className="img">
                  <img src="/assets/imgs/works/1/1.jpg" alt="" />
                </div>
              </div>
              <div
                onMouseEnter={handleMouseEnter}
                className="cluom"
                data-tab="tab-5"
              >
                <div className="info d-flex align-items-end">
                  <h4>
                    <span className="mr-10 fz-16">05.</span>{' '}
                    <a href="/project-details">Modern Minimalist</a>
                  </h4>
                  <h6 className="sub-title p-color ml-20">/ Developments</h6>
                </div>
                <div className="img">
                  <img src="/assets/imgs/works/1/2.jpeg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Portfolio;
