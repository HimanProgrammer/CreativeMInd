'use client';
import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const selectors = '.rd-reveal, .rd-reveal-left, .rd-reveal-right, .rd-reveal-scale';
    const els = document.querySelectorAll(selectors);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('rd-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
