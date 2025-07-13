import React from 'react';

function Intro() {
  return (
    <section className="intro-crev section-padding pt-0">
      <div className="container">
        <div className="sec-head">
          <div className="row">
            <div className="col-lg-7 offset-lg-5">
              <h2 className="stroke">Web</h2>
            </div>
            <div className="col-lg-10 offset-lg-2">
              <h2>Development</h2>
            </div>
            <div className="col-lg-7 offset-lg-5">
              <h2 className="stroke">Experiences</h2>
            </div>
          </div>
        </div>
        <div className="row md-marg align-items-end">
          <div className="col-lg-6">
            <div className="img md-mb50">
              <img src="/assets/imgs/intro/2.jpg" alt="" />
              <div className="exp">
                <h3>12+</h3>
                <h6>
                  Years <br /> of Experiences
                </h6>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="cont">
              <p className="fz-24">
                From the inception of a project to its completion, we employ a
                comprehensive and holistic approach that ensures all aspects and
                stages are thoughtfully and thoroughly addressed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;
