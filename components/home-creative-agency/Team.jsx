import React from 'react';
import data from '@/data/team-t';

function Team() {
  return (
    <section className="team-crev section-padding">
      <div className="container">
        <div className="sec-head mb-80">
          <div className="d-flex align-items-center mb-30">
            <h2 className="fw-600 fz-70 text-u d-rotate wow">
              <span className="rotate-text">
                Meet our <span className="fw-200">legends</span>
              </span>
            </h2>
            <div className="ml-auto vi-more">
              <a href="/page-team" className="butn butn-sm butn-bord radius-30">
                <span>Join to us</span>
              </a>
              <span className="icon ti-arrow-top-right"></span>
            </div>
          </div>
          <h6 className="sub-title main-color d-flex align-items-center">
            <span>Our Team</span>
            <span className="thin"></span>
          </h6>
        </div>
        <div className="row">
          {data.slice(0, 4).map((item, i) => (
            <div key={i} className="col-lg-3 col-md-6">
              <div className="item md-mb50">
                <div className="cont text-center pt-30 pb-30">
                  <div className="info">
                    <h6>{item.name}</h6>
                    <span className="fz-14 p-color mt-10">{item.subName}</span>
                  </div>
                  <div className="social mt-20">
                    <div className="links">
                      <a href="#0">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#0">
                        <i className="fab fa-behance"></i>
                      </a>
                      <a href="#0">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="img">
                  <img src={item.img} alt="" />
                </div>
                <div className="circle-blur">
                  <img src="/assets/imgs/patterns/blur1.png" alt="" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;
