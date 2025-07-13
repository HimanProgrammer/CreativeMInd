'use client';
import React from 'react';
import data from '@/data/portfolios/works1';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
function Portfolio() {
  const marquess = ['Our Portfolio']; // Replace with your actual array
  const AllMarquess = Array(10).fill(marquess).flat();
  const swiperOptions = {
    modules: [Pagination, Navigation],
    slidesPerView: 'auto',
    spaceBetween: 80,
    loop: true,
    touchRatio: 0.2,
    speed: 1500,
    pagination: {
      el: '.work-crev .swiper-pagination',
      type: 'progressbar',
    },

    navigation: {
      nextEl: '.work-crev .swiper-button-next',
      prevEl: '.work-crev .swiper-button-prev',
    },
  };
  return (
    <section className="work-fade section-padding sub-bg bord-top-grd bord-bottom-grd">
      <div className="container position-re">
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
                href="/portfolio-gallery"
                className="butn butn-sm butn-bord radius-30"
              >
                <span>View All</span>
              </a>
              <span className="icon ti-arrow-top-right"></span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-2 d-flex align-items-end">
            <div className="text pb-100">
              <p>
                We help our client suceed by creating identities, digital
                experiences, and printmaterials that communicate clearly
              </p>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="work-swiper">
              <Swiper {...swiperOptions} className="swiper-container">
                {data.map((item, i) => (
                  <SwiperSlide key={i}>
                    <div className="item">
                      <div className="img">
                        <img src={item.img} alt="" className="radius-15" />
                      </div>
                      <div className="cont">
                        <h3>
                          <span className="text sub-bg">
                            {item.title}
                            <span className="shap-left-top">
                              <svg
                                viewBox="0 0 11 11"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-11 h-11"
                              >
                                <path
                                  d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                                  fill="#141414"
                                ></path>
                              </svg>
                            </span>
                            <span className="shap-right-bottom">
                              <svg
                                viewBox="0 0 11 11"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-11 h-11"
                              >
                                <path
                                  d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                                  fill="#141414"
                                ></path>
                              </svg>
                            </span>
                          </span>
                          <span className="text sub-bg">
                            {item.subTitle}
                            <span className="shap-left-bottom">
                              <svg
                                viewBox="0 0 11 11"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-11 h-11"
                              >
                                <path
                                  d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                                  fill="#141414"
                                ></path>
                              </svg>
                            </span>
                          </span>
                        </h3>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
        <div className="swiper-pagination"></div>
      </div>
      <div className="marq-head">
        <div className="main-marq xlrg text-u o-hidden">
          <div className="slide-har st1">
            <div className="box">
              {AllMarquess.map((item, i) => (
                <div key={i} className="item">
                  <h4>{item}</h4>
                </div>
              ))}
            </div>
            <div className="box">
              {AllMarquess.map((item, i) => (
                <div key={i} className="item">
                  <h4>{item}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Portfolio;
