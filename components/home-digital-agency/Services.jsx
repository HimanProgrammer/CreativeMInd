'use client';
import React from 'react';
import data from '@/data/services';

function Services() {
  function handleActiveSer(event) {
    document.querySelectorAll('.serv-boxs .item').forEach((serv) => {
      serv.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
  }
  return (
    <section className="services-modern section-padding">
      <div className="container">
        <div className="sec-head mb-80">
          <div className="row">
            <div className="col-lg-4">
              <h6 className="title-bord mb-30">Our Services</h6>
            </div>
            <div className="col-lg-8">
              <div className="text">
                <h4>
                  From the inception of a project to its completion, we employ a
                  comprehensive and holistic approach that ensures all aspects
                  and stages are thoughtfully and thoroughly addressed.
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid rest">
        <div className="serv-boxs">
          {data.map((item, i) => (
            <div
              key={i}
              onClick={handleActiveSer}
              className={`item ${i == 0 && 'active'}`}
            >
              <div className="icon-img-60">
                <img src={item.img} alt="" />
              </div>
              <div>
                <div className="text mb-30">
                  <p>{item.desc} </p>
                </div>
                <div className="d-flex align-items-center">
                  <h6 className="sub-title">{item.title}</h6>
                  <span className="ml-auto fz-13">0{i + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
