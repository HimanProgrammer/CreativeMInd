import React from 'react';
import data from '@/data/team-t';
function Team() {
  return (
    <section className="team-crev2 section-padding pb-90">
      <div className="container">
        <div className="sec-head mb-80">
          <div className="d-flex align-items-center">
            <div>
              <span className="sub-title main-color mb-5">Our Team</span>
              <h3 className="fw-600 fz-50 text-u d-rotate wow">
                <span className="rotate-text">
                  Meet our <span className="fw-200">legends.</span>
                </span>
              </h3>
            </div>
            <div className="ml-auto vi-more">
              <a href="/page-team" className="butn butn-sm butn-bord radius-30">
                <span>Join to us</span>
              </a>
              <span className="icon ti-arrow-top-right"></span>
            </div>
          </div>
        </div>
        <div className="row md-marg">
          {data.map((item, i) => (
            <div key={i} className="col-lg-3 col-md-6">
              <div className="item mb-50">
                <div className="bg-blur">
                  <div className="img">
                    <img src={item.img} alt="" />
                    <div className="social">
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
                  <div className="circle-blur">
                    <img src="/assets/imgs/patterns/blur1.png" alt="" />
                  </div>
                </div>
                <div className="cont pt-30">
                  <div className="info">
                    <h6>{item.name}</h6>
                    <span className="fz-14 p-color mt-10">{item.subName}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="col-lg-3 col-md-6">
            <div className="item-bord d-flex align-items-center justify-content-center mb-50">
              <div>
                <h5>
                  Become <br /> Our Member
                </h5>
                <a href="#0" className="mt-30">
                  <span className="ti-arrow-top-right fz-30"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="circle-blur">
        <img src="/assets/imgs/patterns/blur1.png" alt="" />
      </div>
    </section>
  );
}

export default Team;
