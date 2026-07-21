import React from 'react';
import { SITE } from '@/lib/siteConfig';

function Footer() {
  return (
    <footer className="clean-footer crev">
      <div className="container pb-40 pt-40 ontop">
        <div className="row justify-content-between">
          <div className="col-lg-2">
            <div className="logo icon-img-100 md-mb80">
              <img src="/assets/imgs/logo-light.png" alt="" />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="column md-mb50">
              <h6 className="sub-title mb-30">Contact</h6>
              <h6 className="p-color fw-400">{SITE.address}</h6>
              <h6 className="mt-30 mb-15">
                <a href={SITE.emailHref}>{SITE.email}</a>
              </h6>
              <a href={SITE.phoneTel} className="underline">
                <span className="fz-22 main-color">{SITE.phone}</span>
              </a>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="column md-mb50">
              <h6 className="sub-title mb-30">Useful Links</h6>
              <ul className="rest fz-14 opacity-7">
                <li className="mb-15"><a href="/page-about">About</a></li>
                <li className="mb-15"><a href="/page-services">Services</a></li>
                <li className="mb-15"><a href="/blog-grid-3column">Blog</a></li>
                <li className="mb-15"><a href="/page-contact">Contact</a></li>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="column subscribe-minimal">
              <h6 className="sub-title mb-30">Newsletter</h6>
              <div className="form-group mb-40">
                <input type="text" name="subscrib" placeholder="Your Email" />
                <button><span className="ti-location-arrow"></span></button>
              </div>
              <ul className="rest social-icon d-flex align-items-center">
                <li className="hover-this cursor-pointer">
                  <a href={SITE.social.facebook} className="hover-anim"><i className="fab fa-facebook-f"></i></a>
                </li>
                <li className="hover-this cursor-pointer ml-10">
                  <a href={SITE.social.dribbble} className="hover-anim"><i className="fab fa-dribbble"></i></a>
                </li>
                <li className="hover-this cursor-pointer ml-10">
                  <a href={SITE.social.linkedin} className="hover-anim"><i className="fab fa-linkedin-in"></i></a>
                </li>
                <li className="hover-this cursor-pointer ml-10">
                  <a href={SITE.social.instagram} className="hover-anim"><i className="fab fa-instagram"></i></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-30 pb-30 mt-80 bord-thin-top">
          <div className="text-center">
            <p className="fz-14">
              © 2025 {SITE.name} is Proudly Powered by{' '}
              <span className="underline main-color">
                <a href={SITE.website} target="_blank">{SITE.name}</a>
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="circle-blur">
        <img src="/assets/imgs/patterns/blur1.png" alt="" />
      </div>
    </footer>
  );
}

export default Footer;
