'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip admin routes
    if (pathname?.startsWith('/admin')) return;

    const run = () => {
      const targets = document.querySelectorAll(
        'section, .section, article, ' +
        'h1:not(.no-anim), h2:not(.no-anim), h3:not(.no-anim), ' +
        'p:not(.no-anim), ' +
        '.card, [class*="card"], ' +
        '[class*="service"], [class*="Service"], ' +
        '[class*="team"], [class*="Team"], ' +
        '[class*="blog"], [class*="Blog"], ' +
        '[class*="portfolio"], [class*="Portfolio"], ' +
        '[class*="testimonial"], [class*="Testimonial"], ' +
        '[class*="stat"], [class*="Stat"], ' +
        '[class*="feat"], [class*="Feat"], ' +
        '[class*="number"], [class*="Number"], ' +
        '[class*="btn"]:not(.no-anim), button:not(.no-anim), ' +
        'img:not(.no-anim), ' +
        '.reveal, .sr, [data-sr]'
      );

      const seen = new WeakSet();

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seen.has(entry.target)) {
            seen.add(entry.target);
            entry.target.classList.add('gs-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

      targets.forEach((el, i) => {
        if (el.classList.contains('gs-init')) return;
        el.classList.add('gs-init');

        // Determine direction based on position in parent
        const siblings = el.parentElement?.children;
        const idx = siblings ? Array.from(siblings).indexOf(el) : i;
        const delay = Math.min(idx * 60, 400);

        el.style.transitionDelay = delay + 'ms';
        el.classList.add('gs-hidden');

        observer.observe(el);
      });

      return () => observer.disconnect();
    };

    // Small delay to let DOM settle after navigation
    const t = setTimeout(run, 120);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      .gs-hidden {
        opacity: 0;
        transform: translateY(32px);
        transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1),
                    transform 0.55s cubic-bezier(0.22,1,0.36,1);
        will-change: opacity, transform;
      }
      .gs-visible {
        opacity: 1 !important;
        transform: none !important;
      }

      /* Stagger children inside grid/flex containers */
      .gs-visible > .gs-hidden {
        animation: none;
      }

      /* Respect reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .gs-hidden {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
      }
    ` }} />
  );
}
