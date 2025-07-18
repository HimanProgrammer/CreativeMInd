'use client';

import React, { useState } from 'react';
import data from '@/data/services';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay, Pagination  } from 'swiper';

function Services() {
  const [activeIndex, setActiveIndex] = useState(0);

  function handleActiveSer(index) {
    setActiveIndex(index);
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
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1.2}
          autoplay={{ delay: 2000 }}
          onSlideChange={(swiper) => handleActiveSer(swiper.activeIndex)}
          loop={true} // ✅ Enable looping
          navigation={true} // ✅ Navigation arrows
          pagination={{ clickable: true }} // ✅ Bullet pagination
          breakpoints={{
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
          className="serv-boxs"
        >
          {data.map((item, i) => (
            <SwiperSlide key={i}>
              <div
                onClick={() => handleActiveSer(i)}
                className={`item ${activeIndex === i ? 'active' : ''}`}
              >
                <div className="icon-img-60">
                  <img src={item.img} alt={`icon-${i}`} />
                </div>
                <div>
                  <div className="text mb-30">
                    <p>{item.desc}</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <h6 className="sub-title">{item.title}</h6>
                    <span className="ml-auto fz-13">0{i + 1}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Services;
