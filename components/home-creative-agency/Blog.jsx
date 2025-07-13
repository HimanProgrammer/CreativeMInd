import React from 'react';

function Blog() {
  return (
    <section className="blog">
      <div className="container">
        <div className="sec-head mb-80">
          <div className="d-flex align-items-center mb-30">
            <h2 className="fw-600 fz-70 text-u d-rotate wow">
              <span className="rotate-text">
                Latest <span className="fw-200">News</span>
              </span>
            </h2>
            <div className="ml-auto vi-more">
              <a
                href="/blog-classic"
                className="butn butn-sm butn-bord radius-30"
              >
                <span>View All</span>
              </a>
              <span className="icon ti-arrow-top-right"></span>
            </div>
          </div>
          <h6 className="sub-title main-color d-flex align-items-center">
            <span>Our Blogs</span>
            <span className="thin"></span>
          </h6>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="item md-mb50">
              <div className="img fit-img">
                <img src="/assets/imgs/blog/1.jpg" alt="" />
              </div>
              <div className="cont pt-40">
                <div className="info sub-title p-color d-flex align-items-center mb-15">
                  <div>
                    <a href="/blog-classic">By : Admin</a>
                  </div>
                  <div className="ml-30">
                    <a href="/blog-classic">August 14, 2023</a>
                  </div>
                </div>
                <h4>Design Inspiration: Where to Find Creative Ideas</h4>
                <a
                  href="/blog-details"
                  className="butn-crev d-flex align-items-center mt-40"
                >
                  <span className="hover-this">
                    <span className="circle hover-anim">
                      <i className="ti-arrow-top-right"></i>
                    </span>
                  </span>
                  <span className="text">Read more</span>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="item">
              <div className="img fit-img">
                <img src="/assets/imgs/blog/2.jpg" alt="" />
              </div>
              <div className="cont pt-40">
                <div className="info sub-title p-color d-flex align-items-center mb-15">
                  <div>
                    <a href="/blog-classic">By : Admin</a>
                  </div>
                  <div className="ml-30">
                    <a href="/blog-classic">August 14, 2023</a>
                  </div>
                </div>
                <h4>Typography: Choosing Fonts for Maximum Impact</h4>
                <a
                  href="/blog-details"
                  className="butn-crev d-flex align-items-center mt-40"
                >
                  <span className="hover-this">
                    <span className="circle hover-anim">
                      <i className="ti-arrow-top-right"></i>
                    </span>
                  </span>
                  <span className="text">Read more</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Blog;
