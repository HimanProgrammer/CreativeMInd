import React from 'react';
import { SITE } from '@/lib/siteConfig';

export default function Footer() {
  return (
    <footer className="rd-footer">
      <div className="container">
        <div className="row g-5">
          {/* About */}
          <div className="col-lg-3 col-md-6">
            <div className="rd-footer-about">
              <img src="/assets/imgs/logo-light.png" alt="CreativeMind" style={{ height: 38, filter: 'brightness(2)' }} />
              <p>We build digital products that help businesses grow and succeed online.</p>
              <div className="rd-footer-social">
                {[
                  { icon: 'fab fa-facebook-f', href: SITE.social.facebook },
                  { icon: 'fab fa-twitter', href: SITE.social.twitter },
                  { icon: 'fab fa-linkedin-in', href: SITE.social.linkedin },
                  { icon: 'fab fa-instagram', href: SITE.social.instagram },
                ].filter((s) => s.href && s.href !== '#').map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer">
                    <i className={s.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="col-lg-2 col-md-6">
            <h6>Services</h6>
            <ul className="rd-footer-links">
              {['Web Development', 'Mobile App', 'UI/UX Design', 'Digital Marketing', 'Branding & Identity', 'Cloud Solutions'].map((s, i) => (
                <li key={i}><a href="/page-services">{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6>Quick Links</h6>
            <ul className="rd-footer-links">
              <li><a href="/page-about">About Us</a></li>
              <li><a href="/portfolio-gallery">Portfolio</a></li>
              <li><a href="/blog-grid-3column">Blog</a></li>
              <li><a href="/page-contact">Career</a></li>
              <li><a href="/page-FAQ">FAQs</a></li>
              <li><a href="/page-contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-2 col-md-6">
            <h6>Contact Info</h6>
            <div className="rd-footer-contact-item">
              <i className="fas fa-phone"></i>
              <a href={SITE.phoneTel}>{SITE.phone}</a>
            </div>
            <div className="rd-footer-contact-item">
              <i className="fas fa-envelope"></i>
              <a href={SITE.emailHref}>{SITE.email}</a>
            </div>
            <div className="rd-footer-contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>{SITE.addressShort}</span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h6>Subscribe Newsletter</h6>
            <p style={{ fontSize: 14, marginBottom: 16 }}>Get the latest updates and offers.</p>
            <div className="rd-footer-newsletter">
              <input type="email" placeholder="Enter your email" />
              <button type="button">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="rd-footer-bottom">
          <span>© 2026 Creative Mind IT Solutions. All Rights Reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/page-contact">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
