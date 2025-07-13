import React from 'react';

function Numbers() {
  return (
    <section className="numbers-crev section-padding pt-0">
      <div className="container">
        <div className="row lg-marg justify-content-center">
          <div className="col-lg-4 col-md-6">
            <div className="item text-center md-mb50">
              <div className="o-hidden">
                <h3 className="stroke">100%</h3>
              </div>
              <h6 className="p-color sub-title">Clients Satisfaction</h6>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="item text-center md-mb50">
              <div className="o-hidden">
                <h3 className="stroke">6700</h3>
              </div>
              <h6 className="p-color sub-title">Projects Completed</h6>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="item text-center">
              <div className="o-hidden">
                <h3 className="stroke">34 +</h3>
              </div>
              <h6 className="p-color sub-title">Awards achievement</h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Numbers;
