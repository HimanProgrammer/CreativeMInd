'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/page-about', label: 'ABOUT' },
    { href: '/page-services', label: 'SERVICES', dropdown: [
      { href: '/page-services', label: 'All Services' },
      { href: '/service-web-development', label: 'Website Development' },
      { href: '/service-app-development', label: 'App Development' },
      { href: '/service-seo', label: 'SEO Services' },
      { href: '/service-social-media', label: 'Social Media Marketing' },
      { href: '/service-ui-ux-design', label: 'UI/UX Design' },
      { href: '/service-branding', label: 'Branding & Identity' },
    ]},
    { href: '/portfolio-masonry', label: 'PORTFOLIO' },
    { href: '/blog-grid-3column', label: 'BLOG' },
    { href: '/page-contact', label: 'CONTACT' },
  ];

  const isGroupActive = (link) => {
    if (link.dropdown) return link.dropdown.some(d => isActive(d.href));
    return isActive(link.href);
  };

  return (
    <nav className={`rd-navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="rd-nav-container">
        {/* Logo */}
        <a href="/" className="rd-logo">
          <img src="/assets/imgs/logo-light-03.png" alt="CreativeMind" />
        </a>

        {/* Desktop Nav Links */}
        <ul className="rd-nav-links">
          {navLinks.map((link) => (
            <li
              key={link.label}
              className={`rd-nav-item${link.dropdown ? ' rd-dropdown' : ''}${isGroupActive(link) ? ' rd-nav-item-active' : ''}`}
            >
              <Link
                href={link.href}
                className={`rd-nav-link${isGroupActive(link) ? ' active' : ''}`}
              >
                {link.label}
                {link.dropdown && <span className="rd-nav-arrow">▾</span>}
              </Link>

              {link.dropdown && (
                <div className="rd-dropdown-menu">
                  {link.dropdown.map((d) => (
                    <Link
                      key={d.href}
                      href={d.href}
                      className={`rd-dropdown-item${isActive(d.href) ? ' active' : ''}`}
                    >
                      {d.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="rd-nav-right">
          <Link href="/page-contact" className="rd-btn-quote">GET A QUOTE</Link>
          <button
            className="rd-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`rd-ham-bar${mobileOpen ? ' open' : ''}`}></span>
            <span className={`rd-ham-bar${mobileOpen ? ' open' : ''}`}></span>
            <span className={`rd-ham-bar${mobileOpen ? ' open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`rd-mobile-menu${mobileOpen ? ' open' : ''}`}>
        <div className="rd-mobile-menu-inner">
          {navLinks.map((link) => (
            <div key={link.label}>
              {link.dropdown ? (
                <>
                  <button
                    className={`rd-mobile-link rd-mobile-parent${isGroupActive(link) ? ' active' : ''}`}
                    onClick={() => {
                      if (link.label === 'SERVICES') setServicesOpen(o => !o);
                    }}
                  >
                    {link.label}
                    <span className="rd-mobile-arrow">▾</span>
                  </button>
                  {((link.label === 'SERVICES' && servicesOpen) ||
                    (link.label !== 'SERVICES')) && (
                    <div className="rd-mobile-sub">
                      {link.dropdown.map((d) => (
                        <Link
                          key={d.href}
                          href={d.href}
                          className={`rd-mobile-sublink${isActive(d.href) ? ' active' : ''}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {d.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  className={`rd-mobile-link${isActive(link.href) ? ' active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
          <Link href="/page-contact" className="rd-mobile-cta" onClick={() => setMobileOpen(false)}>
            GET A QUOTE
          </Link>
        </div>
      </div>
    </nav>
  );
}
