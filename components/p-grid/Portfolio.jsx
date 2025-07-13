'use client';
import initIsotope from '@/common/initIsotope';
import React, { useEffect, useLayoutEffect } from 'react';

function Portfolio() {
  useEffect(() => {
    initIsotope();
  }, []);
  return (
    <section className="work-grid section-padding pb-0">
      <div className="container">
        <div className="row mb-80">
          <div className="col-lg-4">
            <div className="sec-head">
              <h6 className="sub-title main-color mb-10">DISCOVER OUR CASES</h6>
              <h3>Latest Projects</h3>
            </div>
          </div>
          <div className="filtering col-lg-8 d-flex justify-content-end align-items-end">
            <div>
              <div className="filter">
                <span data-filter="*" className="active" data-count="08">
                  All
                </span>
                <span data-filter=".design" data-count="03">
                  Design
                </span>
                <span data-filter=".development" data-count="02">
                  Development
                </span>
                <span data-filter=".marketing" data-count="03">
                  Marketing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="gallery row md-marg">
          <div className="col-lg-4 col-md-6 items design">
            <div className="item mb-50">
              <div className="img">
                <img src="/assets/imgs/works/2/1.jpg" alt="" />
              </div>
              <div className="cont d-flex align-items-end mt-30">
                <div>
                  <span className="p-color mb-5 sub-title">Web Design</span>
                  <h6>Figma Digital Agency</h6>
                </div>
                <div className="ml-auto">
                  <a href="/project-details">
                    <span className="ti-arrow-top-right"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 items marketing">
            <div className="item mb-50">
              <div className="img">
                <img src="/assets/imgs/works/2/2.jpg" alt="" />
              </div>
              <div className="cont d-flex align-items-end mt-30">
                <div>
                  <span className="p-color mb-5 sub-title">Web Design</span>
                  <h6>Figma Digital Agency</h6>
                </div>
                <div className="ml-auto">
                  <a href="/project-details">
                    <span className="ti-arrow-top-right"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 items design">
            <div className="item mb-50">
              <div className="img">
                <img src="/assets/imgs/works/2/3.jpg" alt="" />
              </div>
              <div className="cont d-flex align-items-end mt-30">
                <div>
                  <span className="p-color mb-5 sub-title">Web Design</span>
                  <h6>Figma Digital Agency</h6>
                </div>
                <div className="ml-auto">
                  <a href="/project-details">
                    <span className="ti-arrow-top-right"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 items development">
            <div className="item mb-50">
              <div className="img">
                <img src="/assets/imgs/works/2/4.jpg" alt="" />
              </div>
              <div className="cont d-flex align-items-end mt-30">
                <div>
                  <span className="p-color mb-5 sub-title">Web Design</span>
                  <h6>Figma Digital Agency</h6>
                </div>
                <div className="ml-auto">
                  <a href="/project-details">
                    <span className="ti-arrow-top-right"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 items design">
            <div className="item mb-50">
              <div className="img">
                <img src="/assets/imgs/works/2/5.jpg" alt="" />
              </div>
              <div className="cont d-flex align-items-end mt-30">
                <div>
                  <span className="p-color mb-5 sub-title">Web Design</span>
                  <h6>Figma Digital Agency</h6>
                </div>
                <div className="ml-auto">
                  <a href="/project-details">
                    <span className="ti-arrow-top-right"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 items marketing">
            <div className="item mb-50">
              <div className="img">
                <img src="/assets/imgs/works/2/6.jpg" alt="" />
              </div>
              <div className="cont d-flex align-items-end mt-30">
                <div>
                  <span className="p-color mb-5 sub-title">Web Design</span>
                  <h6>Figma Digital Agency</h6>
                </div>
                <div className="ml-auto">
                  <a href="/project-details">
                    <span className="ti-arrow-top-right"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 items marketing">
            <div className="item mb-50">
              <div className="img">
                <img src="/assets/imgs/works/2/7.jpg" alt="" />
              </div>
              <div className="cont d-flex align-items-end mt-30">
                <div>
                  <span className="p-color mb-5 sub-title">Web Design</span>
                  <h6>Figma Digital Agency</h6>
                </div>
                <div className="ml-auto">
                  <a href="/project-details">
                    <span className="ti-arrow-top-right"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 items development">
            <div className="item mb-50">
              <div className="img">
                <img src="/assets/imgs/works/2/8.jpg" alt="" />
              </div>
              <div className="cont d-flex align-items-end mt-30">
                <div>
                  <span className="p-color mb-5 sub-title">Web Design</span>
                  <h6>Figma Digital Agency</h6>
                </div>
                <div className="ml-auto">
                  <a href="/project-details">
                    <span className="ti-arrow-top-right"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 items development">
            <div className="item mb-50">
              <div className="img">
                <img src="/assets/imgs/works/2/9.jpg" alt="" />
              </div>
              <div className="cont d-flex align-items-end mt-30">
                <div>
                  <span className="p-color mb-5 sub-title">Web Design</span>
                  <h6>Figma Digital Agency</h6>
                </div>
                <div className="ml-auto">
                  <a href="/project-details">
                    <span className="ti-arrow-top-right"></span>
                  </a>
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
