import React from 'react';

const SERVICES = [
  {
    icon: '/assets/imgs/serv-icons/1.png',
    title: 'Web Development',
    desc: 'Custom websites and web apps built with Next.js, React, and modern backend stacks. Fast, SEO-ready, and fully responsive — engineered to convert visitors into clients.',
    points: ['Next.js / React', 'E-Commerce & CMS', 'REST & GraphQL APIs', 'Core Web Vitals Optimised'],
  },
  {
    icon: '/assets/imgs/serv-icons/2.png',
    title: 'Mobile App Development',
    desc: 'Cross-platform mobile apps built with Flutter — a single codebase delivering native performance on iOS and Android. From MVP to production-ready in record time.',
    points: ['Flutter (iOS & Android)', 'Firebase Integration', 'Push Notifications', 'App Store Deployment'],
  },
  {
    icon: '/assets/imgs/serv-icons/3.png',
    title: 'UI/UX Design',
    desc: 'User interfaces that look stunning and work intuitively. We research, wireframe, prototype, and test every design decision so your product delights users from day one.',
    points: ['User Research & Personas', 'Wireframes & Prototypes', 'Figma Design Systems', 'Usability Testing'],
  },
  {
    icon: '/assets/imgs/serv-icons/4.png',
    title: 'Branding & Visual Identity',
    desc: 'A brand is more than a logo. We craft complete visual identities — strategy, logo, colour palette, typography, and brand guidelines — that make your business unforgettable.',
    points: ['Logo Design', 'Brand Strategy', 'Style Guide & Guidelines', 'Print & Digital Assets'],
  },
  {
    icon: '/assets/imgs/serv-icons/5.png',
    title: 'Digital Marketing',
    desc: 'Data-driven marketing strategies that put your business in front of the right people at the right moment. From SEO to paid campaigns, we grow your traffic and revenue.',
    points: ['SEO & Content Strategy', 'Google Ads (PPC)', 'Email Marketing', 'Analytics & Reporting'],
  },
  {
    icon: '/assets/imgs/serv-icons/6.png',
    title: 'Social Media Marketing',
    desc: 'Consistent, on-brand content across Instagram, Facebook, LinkedIn, and beyond. We manage your presence end-to-end so you can focus on running your business.',
    points: ['Content Creation', 'Meta & LinkedIn Ads', 'Community Management', 'Monthly Performance Reports'],
  },
];

function Intro() {
  return (
    <>
      {/* ── Description + Stats ── */}
      <section className="intro section-padding">
        <div className="container">
          <div className="row lg-marg">
            <div className="col-lg-8">
              <div className="row lg-marg">
                <div className="col-md-5">
                  <h6 className="sub-title main-color mb-15">Who We Are</h6>
                  <h3 className="mb-30">
                    A full-service digital agency built for{' '}
                    <span className="fw-200">results.</span>
                  </h3>
                </div>
                <div className="col-md-7">
                  <div className="text">
                    <p className="mb-15">
                      CreativeMind IT Solutions is a team of designers, developers, and marketers who combine technical precision with creative thinking. We don&apos;t just deliver projects — we deliver growth.
                    </p>
                    <p>
                      Whether you&apos;re a startup launching your first product or an established brand looking to scale, we build the digital infrastructure that takes you there.
                    </p>
                    <div className="mt-30">
                      <ul className="rest dot-list">
                        <li className="mb-10">Custom Web & Mobile Development</li>
                        <li className="mb-10">UI/UX Design & Prototyping</li>
                        <li className="mb-10">Brand Identity & Visual Design</li>
                        <li className="mb-10">SEO & Digital Marketing</li>
                        <li>Social Media & Content Strategy</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="numbers mt-80 md-mb50">
                <div className="row lg-marg">
                  {[
                    { n: '150+', l: 'Projects Delivered' },
                    { n: '98%', l: 'Client Satisfaction' },
                    { n: '6+', l: 'Years Experience' },
                    { n: '40+', l: 'Happy Clients' },
                  ].map((s) => (
                    <div className="col-md-3 col-6" key={s.l}>
                      <div className="item bord-thin-top pt-30 d-flex align-items-end mt-20 sm-mb30">
                        <div>
                          <h3 className="fw-300 mb-10">{s.n}</h3>
                          <h6 className="p-color sub-title">{s.l}</h6>
                        </div>
                        <div className="ml-auto">
                          <div className="icon-img-40">
                            <img src="/assets/imgs/arw0.png" alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="img-full fit-img">
                <img src="/assets/imgs/intro/2.jpg" alt="CreativeMind Team" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── All Services Grid ── */}
      <section className="section-padding" style={{ background: 'var(--darkbg, #0d0d0d)' }}>
        <div className="container">
          <div className="sec-head mb-80">
            <div className="d-flex align-items-center mb-30">
              <h2 className="fw-600 fz-70 text-u d-rotate wow">
                <span className="rotate-text">
                  What We <span className="fw-200">Do</span>
                </span>
              </h2>
            </div>
            <h6 className="sub-title main-color d-flex align-items-center">
              <span>Our full service offering</span>
              <span className="thin"></span>
            </h6>
          </div>

          <div className="row">
            {SERVICES.map((svc, i) => (
              <div className="col-lg-4 col-md-6 mb-50" key={i}>
                <div className="item-box radius-15" style={{ height: '100%' }}>
                  <div className="icon-img-70 mb-30 opacity-3">
                    <img src={svc.icon} alt={svc.title} />
                  </div>
                  <span className="mb-20 p-color d-block">{String(i + 1).padStart(2, '0')} .</span>
                  <h5 className="mb-20">{svc.title}</h5>
                  <p className="mb-25" style={{ lineHeight: 1.8 }}>{svc.desc}</p>
                  <ul className="rest dot-list">
                    {svc.points.map((p) => (
                      <li className="mb-8" key={p} style={{ fontSize: 13, color: '#aaa' }}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Intro;
