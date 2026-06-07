import React from 'react';

const stats = [
  { icon: 'fas fa-briefcase', number: '50+', label: 'Projects Completed' },
  { icon: 'fas fa-smile', number: '20+', label: 'Happy Clients' },
  { icon: 'fas fa-calendar-alt', number: '5+', label: 'Years Experience' },
  { icon: 'fas fa-star', number: '99%', label: 'Client Satisfaction' },
];

export default function Stats() {
  return (
    <section className="rd-section rd-stats">
      <div className="container">
        <div className="row g-4">
          {stats.map((s, i) => (
            <div key={i} className={`col-lg-3 col-md-6 rd-reveal rd-delay-${i + 1}`}>
              <div className="rd-stat-card">
                <div className="rd-stat-icon">
                  <i className={s.icon}></i>
                </div>
                <div>
                  <div className="rd-stat-number">{s.number}</div>
                  <div className="rd-stat-label">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
