'use client';
import React, { useEffect } from 'react';
import data from '@/data/portfolios/works1';
import loadBackgroudImages from '@/common/loadBackgroudImages';

function Portfolio() {
  useEffect(() => {
    loadBackgroudImages();
  }, []);
  function handleOpenWork(event) {
    document.querySelectorAll('.work-boxs .item').forEach((el) => {
      el.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
  }
  return (
    <section className="portfolio-crev valign pt-80">
      <div className="container-fluid rest">
        <div className="work-boxs">
          {data.map((item, i) => (
            <div
              onClick={handleOpenWork}
              key={i}
              className={`item ${i == 1 && 'active'} `}
            >
              <div className="bg-img" data-background={item.img}>
                <div className="cont main-bg">
                  <div className="d-flex align-items-center">
                    <div>
                      <h5>
                        {item.title} {item.subTitle}
                      </h5>
                      <span className="p-color mt-5">Branding</span>
                    </div>
                    <div className="ml-auto">
                      <a href="/project-details" className="arrow">
                        <img
                          src="/assets/imgs/icon-img/arrow-down-big.png"
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Portfolio;
