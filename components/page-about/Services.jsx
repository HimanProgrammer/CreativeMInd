import React from 'react';

function Services() {
  return (
    <section className="services-inline2 section-padding sub-bg bord-bottom-grd bord-top-grd">
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
            <div className="col-lg-4">
              <div>
                <span className="num">01</span>
                <div>
                  <span className="sub-title main-color mb-10">Web Design</span>
                  <h2>
                    UI / UX <span className="fw-200">Design</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="text md-mb80">
                <p>
                  We help our client suceed by creating identities, digital
                  experiences, and printmaterials that communicate clearly
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="img fit-img">
                <img src="/assets/imgs/serv-img/1.jpg" alt="" />
                <a href="/page-services-details">
                  <span className="ti-arrow-top-right"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="item">
          <div className="row md-marg align-items-end">
            <div className="col-lg-4">
              <div>
                <span className="num">02</span>
                <div>
                  <span className="sub-title main-color mb-10">Web Design</span>
                  <h2>
                    Brand <span className="fw-200">Strategy</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="text md-mb80">
                <p>
                  We help our client suceed by creating identities, digital
                  experiences, and printmaterials that communicate clearly
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="img fit-img">
                <img src="/assets/imgs/serv-img/2.jpg" alt="" />
                <a href="/page-services-details">
                  <span className="ti-arrow-top-right"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="item pb-0">
          <div className="row md-marg align-items-end">
            <div className="col-lg-4">
              <div>
                <span className="num">03</span>
                <div>
                  <span className="sub-title main-color mb-10">Web Design</span>
                  <h2>
                    SEO / <span className="fw-200">Marketing</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="text md-mb80">
                <p>
                  We help our client suceed by creating identities, digital
                  experiences, and printmaterials that communicate clearly
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="img fit-img">
                <img src="/assets/imgs/serv-img/3.jpg" alt="" />
                <a href="/page-services-details">
                  <span className="ti-arrow-top-right"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
