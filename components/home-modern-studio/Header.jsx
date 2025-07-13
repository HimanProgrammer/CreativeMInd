'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Autoplay, EffectFade, Keyboard, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import loadBackgroudImages from '@/common/loadBackgroudImages';
function Header() {
  useLayoutEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.header', { y: 200 }, { y: 0 }, '+=2.5');
    tl.fromTo(
      '.header .container',
      { opacity: 0, translateY: 40 },
      { opacity: 1, translateY: 0 },
      '-=0'
    );

    return () => tl.kill();
  }, []);

  const [galleryImg, setGalleryImg] = useState(null);
  const [galleryText, setGalleryText] = useState(null);

  const swiperGalleryImageOptions = {
    modules: [Navigation, Autoplay, Keyboard, Pagination, EffectFade],
    onSwiper: function (swiper) {
      setGalleryImg(swiper);
    },
    spaceBetween: 0,
    slidesPerView: 1,
    effect: 'fade',
    effectfade: {
      crossFade: true,
    },
    loop: true,
    loopedSlides: 4,
    mousewheel: true,
    speed: 1500,
    navigation: {
      nextEl: ' .swiper-controls .swiper-button-next',
      prevEl: ' .swiper-controls .swiper-button-prev',
    },
    pagination: {
      el: '.modern-slider .swiper-pagination',
      clickable: true,
      renderBullet: function (index, className) {
        return (
          '<span class="' +
          className +
          '">' +
          '<svg class="fp-arc-loader" width="16" height="16" viewBox="0 0 16 16">' +
          '<circle class="path" cx="8" cy="8" r="5.5" fill="none" transform="rotate(-90 8 8)" stroke="#FFF"' +
          'stroke-opacity="1" stroke-width="1px"></circle>' +
          '<circle cx="8" cy="8" r="3" fill="#FFF"></circle>' +
          '</svg></span>'
        );
      },
    },
    keyboard: {
      enabled: true,
    },
  };

  const swiperGalleryTextOptions = {
    onSwiper: function (swiper) {
      setGalleryText(swiper);
    },
    modules: [Navigation],
    spaceBetween: 30,
    slidesPerView: 1,
    direction: 'vertical',
    loop: true,
    loopedSlides: 4,
    touchRatio: 0.2,
    slideToClickedSlide: true,
    mousewheel: true,
    speed: 1500,
    navigation: {
      nextEl: '.modern-slider .swiper-controls .swiper-button-next',
      prevEl: '.modern-slider .swiper-controls .swiper-button-prev',
    },
  };
  useEffect(() => {
    if (galleryImg && galleryText) {
      galleryImg.on('slideChangeTransitionStart', function () {
        galleryText.slideTo(galleryImg.activeIndex);
      });
      galleryText.on('transitionStart', function () {
        galleryImg.slideTo(galleryText.activeIndex);
      });
    }
  }, [galleryImg, galleryText]);
  useEffect(() => {
    loadBackgroudImages();
  }, []);
  return (
    <div className="header modern-slider valign">
      <div className="container position-re">
        <div className="row">
          <div className="col-lg-6 offset-lg-4">
            <div className="gallery-img">
              <Swiper
                {...swiperGalleryImageOptions}
                className="swiper-container"
              >
                <SwiperSlide>
                  <div
                    className="bg-img"
                    data-background="/assets/imgs/header/s1.jpg"
                    data-overlay-dark="3"
                  >
                    <a href="/project-details"></a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div
                    className="bg-img"
                    data-background="/assets/imgs/header/s2.jpg"
                    data-overlay-dark="3"
                  >
                    <a href="/project-details"></a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div
                    className="bg-img"
                    data-background="/assets/imgs/header/s3.jpg"
                    data-overlay-dark="3"
                  >
                    <a href="/project-details"></a>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
        <div className="gallery-text">
          <Swiper
            {...swiperGalleryTextOptions}
            className="swiper-container swiper-container-initialized swiper-container-vertical"
          >
            <SwiperSlide>
              <div className="text">
                <h5 className="main-color mb-15">01</h5>
                <h1>
                  Mails <br /> Mobile app
                </h1>
                <a
                  href="/project-details"
                  className="butn-crev d-flex align-items-center mt-30"
                >
                  <span className="hover-this">
                    <span className="circle hover-anim">
                      <i className="ti-arrow-top-right"></i>
                    </span>
                  </span>
                  <span className="text">View Project</span>
                </a>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="text">
                <h5 className="main-color mb-15">02</h5>
                <h1>
                  Mails <br /> Mobile app
                </h1>
                <a
                  href="/project-details"
                  className="butn-crev d-flex align-items-center mt-30"
                >
                  <span className="hover-this">
                    <span className="circle hover-anim">
                      <i className="ti-arrow-top-right"></i>
                    </span>
                  </span>
                  <span className="text">View Project</span>
                </a>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="text">
                <h5 className="main-color mb-15">03</h5>
                <h1>
                  Mails <br /> Mobile app
                </h1>
                <a
                  href="/project-details"
                  className="butn-crev d-flex align-items-center mt-30"
                >
                  <span className="hover-this">
                    <span className="circle hover-anim">
                      <i className="ti-arrow-top-right"></i>
                    </span>
                  </span>
                  <span className="text">View Project</span>
                </a>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="swiper-controls">
          <div className="swiper-button-next swiper-nav-ctrl cursor-pointer">
            <span className="ti-angle-up"></span>
          </div>
          <div className="swiper-button-prev swiper-nav-ctrl cursor-pointer">
            <span className="ti-angle-down"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
