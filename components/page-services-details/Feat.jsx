import React from 'react';

const STEPS = [
  {
    icon: '/assets/imgs/serv-icons/3.png',
    num: '01',
    title: 'Discovery & Strategy',
    desc: 'We start by understanding your business, goals, and audience. Through structured workshops and research we define the problem space and map the right solution.',
  },
  {
    icon: '/assets/imgs/serv-icons/4.png',
    num: '02',
    title: 'Design & Prototype',
    desc: 'Our designers craft wireframes and high-fidelity prototypes in Figma. You review and approve before a single line of code is written — no surprises.',
  },
  {
    icon: '/assets/imgs/serv-icons/5.png',
    num: '03',
    title: 'Build & Develop',
    desc: 'Our developers bring the approved design to life using modern, scalable technologies. Weekly check-ins keep you updated at every milestone.',
  },
  {
    icon: '/assets/imgs/serv-icons/6.png',
    num: '04',
    title: 'Launch & Grow',
    desc: 'We deploy, test, and go live. Post-launch we track performance, run marketing campaigns, and iterate — so your product keeps improving over time.',
  },
];

const FAQS = [
  {
    q: 'How long does a typical project take?',
    a: 'A branding project takes 2–3 weeks. A website 4–6 weeks. A mobile app 8–16 weeks depending on features. We\'ll give you an accurate timeline after the discovery call.',
  },
  {
    q: 'Do you work with startups or only established businesses?',
    a: 'Both. We love helping startups find their identity and launch fast. We also help established businesses modernise their tech stack and digital presence.',
  },
  {
    q: 'What technologies do you use?',
    a: 'Next.js, React, Flutter, Firebase, Supabase, Node.js, and Tailwind CSS are our core stack. We choose the right tool for each project — not just our favourites.',
  },
  {
    q: 'Can you handle both design and development?',
    a: 'Yes — that\'s our biggest strength. One team owns strategy, design, and development end-to-end. No miscommunication between agency and dev shop.',
  },
];

function Feat() {
  return (
    <>
      {/* ── How It Works ── */}
      <section className="feat section-padding">
        <div className="container">
          <div className="sec-head mb-80">
            <div className="d-flex align-items-center mb-30">
              <h2 className="fw-600 fz-70 text-u d-rotate wow">
                <span className="rotate-text">
                  How It <span className="fw-200">Works</span>
                </span>
              </h2>
              <div className="ml-auto vi-more">
                <a href="/page-contact" className="butn butn-sm butn-bord radius-30">
                  <span>Start a Project</span>
                </a>
                <span className="icon ti-arrow-top-right"></span>
              </div>
            </div>
            <h6 className="sub-title main-color d-flex align-items-center">
              <span>Our 4-step process</span>
              <span className="thin"></span>
            </h6>
          </div>

          <div className="row">
            {STEPS.map((step) => (
              <div className="col-lg-3 col-md-6" key={step.num}>
                <div className="item-box radius-15 md-mb50">
                  <div className="icon-img-70 mb-40 opacity-3">
                    <img src={step.icon} alt={step.title} />
                  </div>
                  <span className="mb-30 p-color">{step.num} .</span>
                  <h6 className="mb-20">{step.title}</h6>
                  <p style={{ lineHeight: 1.8, fontSize: 14 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding bord-thin-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 md-mb50">
              <h6 className="sub-title main-color mb-15">Got Questions?</h6>
              <h3 className="fw-600 mb-20">
                Frequently <span className="fw-200">Asked</span>
              </h3>
              <p className="p-color" style={{ lineHeight: 1.8 }}>
                Can&apos;t find your answer here? Drop us a message and we&apos;ll get back to you within 24 hours.
              </p>
              <a href="/page-contact" className="butn-crev d-flex align-items-center mt-40">
                <span className="hover-this">
                  <span className="circle hover-anim">
                    <i className="ti-arrow-top-right"></i>
                  </span>
                </span>
                <span className="text">Contact Us</span>
              </a>
            </div>

            <div className="col-lg-7 offset-lg-1">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className={`bord-thin-top pt-30 pb-30${i < FAQS.length - 1 ? '' : ' bord-thin-bottom'}`}
                >
                  <div className="d-flex align-items-start">
                    <span className="main-color fw-700 mr-20" style={{ minWidth: 28, fontSize: 14 }}>
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <div>
                      <h6 className="mb-15">{faq.q}</h6>
                      <p className="p-color" style={{ lineHeight: 1.8, fontSize: 14 }}>{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section-padding" style={{ background: '#f05a28' }}>
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between" style={{ gap: 32 }}>
            <div>
              <h6 style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: 12, marginBottom: 12 }}>
                Ready to get started?
              </h6>
              <h2 className="fw-700" style={{ color: '#fff', fontSize: 'clamp(28px,4vw,50px)', lineHeight: 1.1, margin: 0 }}>
                Let&apos;s build something great together.
              </h2>
            </div>
            <a
              href="/page-contact"
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '16px 36px', background: '#fff',
                borderRadius: 50, color: '#f05a28',
                textDecoration: 'none', fontSize: 14, fontWeight: 700,
                letterSpacing: '0.04em', whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              Get a Free Quote
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 10 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Feat;
