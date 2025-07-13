import React from 'react';

function Marq() {
  const items = [
    'Web Design',
    'Art Director',
    'Brand Strategy',
    'UI/UX Design',
    'Digital Marketing',
    'Web Developement',
    'Seo Mackting',
    'Product Desgin',
  ];
  return (
    <section className="marq">
      <div className="main-marq lrg sub-bg pt-20 pb-20 shadow-off">
        <div className="slide-har st1">
          <div className="box">
            {items.map((item, i) => (
              <div key={i} className="item">
                <h4 className="d-flex align-items-center">
                  <span>{item}</span>
                  <span className="icon-img-50 ml-40">
                    <img src="/assets/imgs/star.png" alt="" />
                  </span>
                </h4>
              </div>
            ))}
          </div>
          <div className="box">
            {items.map((item, i) => (
              <div key={i} className="item">
                <h4 className="d-flex align-items-center">
                  <span>{item}</span>
                  <span className="icon-img-50 ml-40">
                    <img src="/assets/imgs/star.png" alt="" />
                  </span>
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Marq;
