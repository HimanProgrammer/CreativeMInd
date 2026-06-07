import React from 'react';

const testimonials = [
  {
    text: 'Creative Mind IT Solutions delivered a stunning website that exceeded our expectations. Highly professional and reliable team!',
    name: 'David Smith',
    role: 'CEO, TechNova',
    initials: 'DS',
    color: '#f05a28',
  },
  {
    text: 'Their mobile app development skills are top notch. The app they built for us is fast, secure and user-friendly.',
    name: 'Jessica Brown',
    role: 'Marketing Head, ShopMax',
    initials: 'JB',
    color: '#5b21b6',
  },
  {
    text: 'Excellent communication, on-time delivery and amazing support. Highly recommended!',
    name: 'Michael Johnson',
    role: 'Founder, HitLife',
    initials: 'MJ',
    color: '#0ea5e9',
  },
];

export default function Testimonials() {
  return (
    <section className="rd-section rd-testimonials">
      <div className="container">
        <div className="text-center mb-50 rd-reveal">
          <p className="rd-section-tag">TESTIMONIALS</p>
          <h2 className="rd-section-title">What Our Clients <span>Say</span></h2>
        </div>

        <div className="row g-4">
          {testimonials.map((t, i) => (
            <div key={i} className={`col-lg-4 col-md-6 rd-reveal rd-delay-${i + 1}`}>
              <div className="rd-testimonial-card">
                <div className="rd-stars">★★★★★</div>
                <div className="rd-quote-icon">&ldquo;</div>
                <p>{t.text}</p>
                <div className="rd-testimonial-info">
                  <div className="rd-avatar-fallback" style={{ background: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="rd-testimonial-name">{t.name}</div>
                    <div className="rd-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
