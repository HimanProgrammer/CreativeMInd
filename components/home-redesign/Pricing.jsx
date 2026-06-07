'use client';
import React, { useState } from 'react';

const plans = [
  {
    name: 'Starter',
    desc: 'Perfect for small businesses',
    monthly: '14,999',
    yearly: '11,999',
    features: ['5 Pages Website', 'Responsive Design', 'Basic SEO', 'Support'],
    popular: false,
    cta: 'GET STARTED',
    href: '/page-contact',
  },
  {
    name: 'Business',
    desc: 'Best for growing businesses',
    monthly: '24,999',
    yearly: '19,999',
    features: ['Up to 15 Pages', 'Responsive Design', 'Advanced SEO', 'Priority Support'],
    popular: true,
    cta: 'GET STARTED',
    href: '/page-contact',
  },
  {
    name: 'Custom',
    desc: 'For complex & custom solutions',
    monthly: null,
    yearly: null,
    features: ['Unlimited Pages', 'Custom Features', 'Dedicated Support', 'Scalable Solution'],
    popular: false,
    cta: 'CONTACT US',
    href: '/page-contact',
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="rd-section rd-pricing">
      <div className="container">
        <div className="row align-items-end mb-10">
          <div className="col-lg-6">
            <p className="rd-section-tag">PRICING PLANS</p>
            <h2 className="rd-section-title">
              Simple, Transparent <span>Pricing</span>
            </h2>
          </div>
          <div className="col-lg-6">
            <div className="rd-pricing-toggle">
              <span className={`rd-toggle-label${!yearly ? ' active' : ''}`}>MONTHLY</span>
              <div
                className={`rd-toggle-switch${yearly ? ' yearly' : ''}`}
                onClick={() => setYearly(!yearly)}
              />
              <span className={`rd-toggle-label${yearly ? ' active' : ''}`}>YEARLY</span>
              {yearly && <span className="rd-save-badge">Save up to 20%</span>}
            </div>
          </div>
        </div>

        <div className="row g-4 align-items-stretch">
          {plans.map((plan, i) => (
            <div key={i} className="col-lg-4 col-md-6 d-flex">
              <div className={`rd-pricing-card w-100${plan.popular ? ' popular' : ''}`}>
                {plan.popular && (
                  <div className="rd-popular-badge">Most Popular</div>
                )}
                <div className="rd-plan-name">{plan.name}</div>
                <div className="rd-plan-desc">{plan.desc}</div>

                <div className="rd-plan-price">
                  {plan.monthly ? (
                    <>
                      <span className="rd-price-currency">₹</span>
                      <span className="rd-price-amount">
                        {yearly ? plan.yearly : plan.monthly}
                      </span>
                      <span className="rd-price-period">/project</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 32, fontWeight: 800, color: '#1a1a2e' }}>
                      Let&apos;s Talk
                    </span>
                  )}
                </div>

                <ul className="rd-plan-features">
                  {plan.features.map((f, j) => (
                    <li key={j}>
                      <i className="fas fa-check-circle"></i>
                      {f}
                    </li>
                  ))}
                </ul>

                <a href={plan.href} className="rd-btn-plan">{plan.cta}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
