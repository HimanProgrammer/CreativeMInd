import React from 'react';

// `href` points at the dedicated service page where one exists,
// otherwise at the all-services listing.
const services = [
  { icon: 'fas fa-laptop-code', title: 'Web Development', desc: 'High-performance websites built with modern technologies.', href: '/service-web-development' },
  { icon: 'fas fa-mobile-alt', title: 'Mobile App Development', desc: 'Native & cross-platform apps for iOS & Android.', href: '/service-app-development' },
  { icon: 'fas fa-search', title: 'SEO Services', desc: 'Rank higher on Google and grow organic traffic that converts.', href: '/service-seo' },
  { icon: 'fas fa-bullhorn', title: 'Social Media Marketing', desc: 'Content and campaigns that turn followers into customers.', href: '/service-social-media' },
  { icon: 'fas fa-pencil-ruler', title: 'UI/UX Design', desc: 'Beautiful, intuitive and user-centered designs.', href: '/service-ui-ux-design' },
  { icon: 'fas fa-palette', title: 'Branding & Identity', desc: 'Build a brand that stands out and connects with people.', href: '/service-branding' },
];

const delays = ['rd-delay-1','rd-delay-2','rd-delay-3','rd-delay-4','rd-delay-5','rd-delay-6'];

export default function Services() {
  return (
    <section className="rd-section rd-services">
      <div className="container">
        <div className="row align-items-end mb-50">
          <div className="col-lg-6 rd-reveal-left">
            <p className="rd-section-tag">WHAT WE DO</p>
            <h2 className="rd-section-title">Our <span>Services</span></h2>
          </div>
          <div className="col-lg-6 text-lg-end rd-reveal-right">
            <a href="/page-services" className="rd-more-btn">
              View All Services <span>→</span>
            </a>
          </div>
        </div>

        <div className="row g-4">
          {services.map((s, i) => (
            <div key={i} className={`col-lg-4 col-md-6 rd-reveal ${delays[i]}`}>
              <div className="rd-service-card">
                <div className="rd-service-icon">
                  <i className={s.icon}></i>
                </div>
                <h5>{s.title}</h5>
                <p>{s.desc}</p>
                <a href={s.href} className="rd-service-explore">
                  EXPLORE <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
