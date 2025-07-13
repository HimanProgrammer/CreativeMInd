import React from 'react';

function Services() {
  return (
    <section className="services-inline2 section-padding">
      <div className="container ontop">
        <div className="sec-head mb-80">
          <div className="d-flex align-items-center">
            <div>
              <span className="sub-title main-color mb-5">Our Specialize</span>
              <h3 className="fw-600 fz-50 text-u d-rotate wow">
                <span className="rotate-text">
                  Featured <span className="fw-200">Services.</span>
                </span>
              </h3>
            </div>
            <div className="ml-auto vi-more">
              <a
                href="/page-services"
                className="butn butn-sm butn-bord radius-30"
              >
                <span>View All</span>
              </a>
              <span className="icon ti-arrow-top-right"></span>
            </div>
          </div>
        </div>
        <div className="item">
          <div className="row md-marg align-items-end">
            <div className="col-lg-2">
              <span className="num md-mb10">01</span>
            </div>
            <div className="col-lg-4">
              <div className="md-mb30">
                <div>
                  <span className="sub-title main-color mb-10">Web Design</span>
                  <h2>
                    UI / UX <span className="fw-200">Design</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-lg-4 md-mb30">
              <ul className="rest dot-list">
                <li className="fz-20 p-color mb-5">Modern Strategy</li>
                <li className="fz-20 p-color mb-5">UX & Design</li>
                <li className="fz-20 p-color">Content Writing</li>
              </ul>
            </div>
            <div className="col-lg-2 d-flex justify-content-center">
              <div className="icon-img-80 opacity-7">
                <img src="/assets/imgs/serv-icons/5.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="item">
          <div className="row md-marg align-items-end">
            <div className="col-lg-2">
              <span className="num md-mb10">02</span>
            </div>
            <div className="col-lg-4">
              <div className="md-mb30">
                <div>
                  <span className="sub-title main-color mb-10">Web Design</span>
                  <h2>
                    Brand <span className="fw-200">Strategy</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-lg-4 md-mb30">
              <ul className="rest dot-list">
                <li className="fz-20 p-color mb-5">Modern Strategy</li>
                <li className="fz-20 p-color mb-5">UX & Design</li>
                <li className="fz-20 p-color">Content Writing</li>
              </ul>
            </div>
            <div className="col-lg-2 d-flex justify-content-center">
              <div className="icon-img-80 opacity-7">
                <img src="/assets/imgs/serv-icons/4.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="item bord-thin-bottom">
          <div className="row md-marg align-items-end">
            <div className="col-lg-2">
              <span className="num md-mb10">03</span>
            </div>
            <div className="col-lg-4">
              <div className="md-mb30">
                <div>
                  <span className="sub-title main-color mb-10">Web Design</span>
                  <h2>
                    SEO / <span className="fw-200">Marketing</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-lg-4 md-mb30">
              <ul className="rest dot-list">
                <li className="fz-20 p-color mb-5">Modern Strategy</li>
                <li className="fz-20 p-color mb-5">UX & Design</li>
                <li className="fz-20 p-color">Content Writing</li>
              </ul>
            </div>
            <div className="col-lg-2 d-flex justify-content-center">
              <div className="icon-img-80 opacity-7">
                <img src="/assets/imgs/serv-icons/3.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
