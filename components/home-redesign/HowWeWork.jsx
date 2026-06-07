import React from 'react';

const steps = [
  { num: '01', icon: 'fas fa-search', title: 'Discovery', desc: 'Understanding your goals, audience & requirements.' },
  { num: '02', icon: 'fas fa-pencil-alt', title: 'Design', desc: 'Creating wireframes and visual designs.' },
  { num: '03', icon: 'fas fa-code', title: 'Development', desc: 'Building with clean, scalable and efficient code.' },
  { num: '04', icon: 'fas fa-vial', title: 'Testing', desc: 'Rigorous testing for performance & reliability.' },
  { num: '05', icon: 'fas fa-rocket', title: 'Launch', desc: 'Going live and ensuring smooth deployment.' },
];

export default function HowWeWork() {
  return (
    <section className="rd-section rd-process">
      <div className="container">
        <div className="text-center mb-20 rd-reveal">
          <p className="rd-section-tag">OUR PROCESS</p>
          <h2 className="rd-section-title">How We <span>Work</span></h2>
        </div>

        <div className="rd-process-steps">
          {steps.map((s, i) => (
            <div key={i} className={`rd-step rd-reveal rd-delay-${i + 1}`}>
              <div className="rd-step-circle">
                <div className="step-icon">
                  <i className={s.icon}></i>
                </div>
                <span className="step-num">{s.num}</span>
              </div>
              <h6>{s.title}</h6>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
