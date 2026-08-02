'use client';
import React from 'react';

const projects = [
  {
    img: '/assets/imgs/works/1/1.jpg',
    tag: 'Web Application',
    title: 'Fintech Dashboard',
  },
  {
    img: '/assets/imgs/works/1/2.jpg',
    tag: 'Mobile Application',
    title: 'E-Commerce Mobile App',
  },
  {
    img: '/assets/imgs/works/1/3.jpg',
    tag: 'Branding',
    title: 'Brand Identity Design',
  },
];

const tabs = ['ALL', 'WEBSITES', 'MOBILE APPS', 'BRANDING'];

export default function WhyUs() {
  return (
    <section className="rd-section rd-whyus">
      <div className="container">
        <div className="row g-5 align-items-center">
          {/* Left - Why Choose Us */}
          <div className="col-lg-5">
            <p className="rd-section-tag">WHY CHOOSE US</p>
            <h2 className="rd-section-title">
              We Create Solutions<br />That Drive <span>Growth</span>
            </h2>
            <p style={{ color: '#6c757d', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
              Creative Mind IT Solutions is a team of passionate designers, developers
              and strategists helping businesses thrive in the digital world.
            </p>

            <ul className="rd-why-list">
              {[
                'Custom Solutions for Every Business',
                'Agile & Transparent Process',
                'On-Time Delivery, Every Time',
                'Dedicated Support & Maintenance',
              ].map((item, i) => (
                <li key={i}>
                  <span className="rd-check"><i className="fas fa-check"></i></span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="position-relative mt-40" style={{ maxWidth: 420 }}>
              <img
                src="/assets/imgs/team/1.jpg"
                alt="Team"
                style={{ width: '100%', borderRadius: 20, height: 260, objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="rd-stats-badge badge-projects">
                <span className="badge-number">50+</span>
                <span className="badge-label">Projects Delivered</span>
              </div>
              <div className="rd-stats-badge badge-exp">
                <span className="badge-number" style={{ color: '#f05a28' }}>5+</span>
                <span className="badge-label">Years Experience</span>
              </div>
            </div>

            <a href="/page-about" className="rd-more-btn">
              MORE ABOUT US <span>→</span>
            </a>
          </div>

          {/* Right - Featured Projects */}
          <div className="col-lg-7">
            <div className="d-flex align-items-center justify-content-between mb-20">
              <div>
                <p className="rd-section-tag">OUR PORTFOLIO</p>
                <h2 className="rd-section-title" style={{ marginBottom: 0 }}>
                  Featured <span>Projects</span>
                </h2>
              </div>
              <div className="rd-portfolio-nav">
                <button><i className="fas fa-chevron-left"></i></button>
                <button><i className="fas fa-chevron-right"></i></button>
              </div>
            </div>

            <div className="rd-portfolio-tabs mb-28">
              {tabs.map((t, i) => (
                <button key={i} className={`rd-tab-btn${i === 0 ? ' active' : ''}`}>
                  {t}
                </button>
              ))}
            </div>

            <div className="row g-3">
              {projects.map((p, i) => (
                <div key={i} className="col-md-4">
                  <div className="rd-portfolio-card">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="card-img"
                    />
                    <div className="card-body">
                      <p className="card-tag">{p.tag}</p>
                      <h6>{p.title}</h6>
                      <a href="/portfolio-gallery" className="rd-view-project">
                        VIEW PROJECT →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
