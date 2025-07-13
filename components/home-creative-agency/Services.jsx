import React from 'react';
import data from '@/data/services';

function Services() {
  return (
    <section className="services-crev section-padding">
      <div className="container">
        <div className="sec-head mb-80">
          <div className="mb-30">
            <h2 className="fw-600 fz-70 text-u d-rotate wow">
              <span className="rotate-text">
                Featured <span className="fw-200">Services.</span>
              </span>
            </h2>
          </div>
          <h6 className="sub-title main-color d-flex align-items-center">
            <span>Our Specialize</span>
            <span className="thin"></span>
          </h6>
        </div>
        <div className="row sm-marg">
          {data.map((item, i) => (
            <div key={i} className="col-lg-3 col-md-6">
              <div className="item-box radius-15 md-mb30">
                <h5 className="mb-80 text-u">
                  <span className="mr-40 fz-14 main-color">01</span>
                  {item.title}
                </h5>
                <div className="icon mb-20 opacity-5">
                  <img src={item.img} alt="" />
                </div>
                <p>{item.desc.slice(0, 50)} </p>
              </div>
            </div>
          ))}
        </div>
        <div className="sec-bottom mt-100">
          <div className="main-bg d-flex align-items-center">
            <p>Here are some select projects that showcase.</p>
            <a
              href="/page-services"
              className="butn main-color ml-40 underline"
            >
              <span>View All</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
