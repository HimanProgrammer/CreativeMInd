import React from 'react';

function Numbers() {
  return (
    <section className="numbers section-padding pt-0">
      <div className="container">
        <div className="row lg-marg justify-content-center">
          <div className="col-lg-4 col-md-6">
            <div className="item bord-thin-top pt-30 d-flex align-items-end mt-20 md-mb30">
              <div>
                <h3 className="fw-300 mb-10">100%</h3>
                <h6 className="p-color sub-title">Clients Satisfaction</h6>
              </div>
              <div className="ml-auto">
                <div className="icon-img-40">
                  <img src="/assets/imgs/arw0.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="item bord-thin-top pt-30 d-flex align-items-end mt-20 md-mb30">
              <div>
                <h3 className="fw-300 mb-10">6800</h3>
                <h6 className="p-color sub-title">Projects Completed</h6>
              </div>
              <div className="ml-auto">
                <div className="icon-img-40">
                  <img src="/assets/imgs/arw0.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="item bord-thin-top pt-30 d-flex align-items-end mt-20">
              <div>
                <h3 className="fw-300 mb-10">34 +</h3>
                <h6 className="p-color sub-title">Awards achievement</h6>
              </div>
              <div className="ml-auto">
                <div className="icon-img-40">
                  <img src="/assets/imgs/arw0.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Numbers;
