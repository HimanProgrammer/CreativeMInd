import React from 'react';

function Intro() {
  return (
    <section className="page-intro section-padding pb-0">
      <div className="container">
        <div className="row md-marg">
          <div className="col-lg-6">
            <div className="img md-mb80">
              <div className="row">
                <div className="col-6">
                  <img src="/assets/imgs/intro/i1.jpg" alt="" />
                  <div className="img-icon">
                    <img src="/assets/imgs/arw0.png" alt="" />
                  </div>
                </div>
                <div className="col-6 mt-40">
                  <img src="/assets/imgs/intro/i2.jpg" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 valign">
            <div className="cont">
              <h3 className="mb-30">
                CreativeMind is a visionary {' '}
                <span className="fw-200">creative design studio</span> crafting impactful brands, 
                <span className="fw-200">stunning visuals</span> and <span className="fw-200">seamless digital experiences.</span> 

              </h3>
              <p>
                It delivers end-to-end design solutions rooted in experience strategy helping you build standout brands 
                and launch online stores your customers love to shop. From logos to full-scale websites, we blend creativity with 
                functionality to elevate your business.Lets turn your ideas into digital experiences that captivate and convert.
              </p>
              <a href="/page-services" className="underline main-color mt-40">
                <span className="text">
                  Our Services <i className="ti-arrow-top-right"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;
