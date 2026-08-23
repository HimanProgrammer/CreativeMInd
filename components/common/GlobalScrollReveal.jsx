'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip admin routes
    if (pathname?.startsWith('/admin')) return;

    let observer = null;
    let hardTimer = null;
    let cancelled = false;

    const reveal = (el) => {
      if (el && el.classList.contains('gs-hidden')) {
        el.classList.add('gs-visible');
        if (observer) observer.unobserve(el);
      }
    };

    // Reveal anything currently within (or just below) the viewport, without
    // waiting for IntersectionObserver — this is what keeps above-the-fold
    // content from ever getting stuck at opacity:0 if IO is slow or blocked.
    const revealInView = () => {
      const vh = window.innerHeight || 800;
      document.querySelectorAll('.gs-hidden:not(.gs-visible)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh + 60 && r.bottom > -60) reveal(el);
      });
    };

    const run = () => {
      if (cancelled) return;
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

      const supportsIO = typeof IntersectionObserver !== 'undefined';
      if (supportsIO) {
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) reveal(entry.target);
          });
        }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
      }

      targets.forEach((el, i) => {
        if (el.classList.contains('gs-init')) return;
        el.classList.add('gs-init');
        const siblings = el.parentElement?.children;
        const idx = siblings ? Array.from(siblings).indexOf(el) : i;
        el.style.transitionDelay = Math.min(idx * 60, 400) + 'ms';
        el.classList.add('gs-hidden');
        if (observer) observer.observe(el);
      });

      // Immediately reveal what's already on screen (don't wait for IO).
      revealInView();
      requestAnimationFrame(revealInView);

      // Scroll fallback: reveals as you scroll even if IO never fires.
      window.addEventListener('scroll', revealInView, { passive: true });

      // Hard safety net: whatever the reason, never leave the page blank.
      // After a short beat, reveal everything still hidden.
      hardTimer = setTimeout(() => {
        document.querySelectorAll('.gs-hidden:not(.gs-visible)').forEach(reveal);
      }, 1400);
    };

    const t = setTimeout(run, 80);
    return () => {
      cancelled = true;
      clearTimeout(t);
      clearTimeout(hardTimer);
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', revealInView);
    };
  }, [pathname]);

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      .gs-hidden {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1),
                    transform 0.5s cubic-bezier(0.22,1,0.36,1);
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
