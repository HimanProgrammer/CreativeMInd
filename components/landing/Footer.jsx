'use client';
import loadBackgroudImages from '@/common/loadBackgroudImages';
import React, { useEffect } from 'react';

function Footer() {
  useEffect(() => {
    loadBackgroudImages();
  }, []);
  return (
    <footer
      className="section-padding bg-img valign"
      data-background="/landing-preview/img/bg.jpg"
      data-overlay-dark="7"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center">
              <h6 className="sub-title main-color">We Have Offer For You!</h6>
              <h2>Download Your Copy of Webfolio Now!</h2>
              <div className="text mt-15">
                <p className="fz-22">
                  One-time payment & get free lifetime license and update
                  <br />
                  Get all Features, options, templates & Demos!
                </p>
              </div>
              <a
                href="#0"
                className="butn butn-md butn-bg radius-30 main-colorbg mt-40"
              >
                <span className="text">Purchase Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        className="img-footer bg-img"
        data-background="/landing-preview/img/bg-f.png"
      ></div>
    </footer>
  );
}

export default Footer;
