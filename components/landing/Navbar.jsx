'use client';
import React, { useEffect } from 'react';

function Navbar() {
  function handleScroll() {
    const bodyScroll = window.scrollY;
    const navbar = document.querySelector('.navbar');

    if (bodyScroll > 300) navbar.classList.add('nav-scroll');
    else navbar.classList.remove('nav-scroll');
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <nav className="navbar navbar-expand-lg bord">
      <div className="container o-hidden">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#0" data-scroll-nav="1">
                <span className="rolling-text">Demos</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#0" data-scroll-nav="2">
                <span className="rolling-text">Pages</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                target="_blank"
                href="https://uicamp.smartinnovates.net/docs/nextjs"
              >
                <span className="rolling-text">Documentaion</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="contact-button">
          <a
            href="https://themeforest.net/item/webfolio-digital-agency-creative-portfolio-template/50476003"
            className="butn butn-sm butn-bg main-colorbg radius-5"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="17"
                height="17"
                viewBox="0 0 17 17"
              >
                <g></g>
                <path
                  d="M2.75 12.5c-0.965 0-1.75 0.785-1.75 1.75s0.785 1.75 1.75 1.75 1.75-0.785 1.75-1.75-0.785-1.75-1.75-1.75zM2.75 15c-0.414 0-0.75-0.337-0.75-0.75s0.336-0.75 0.75-0.75 0.75 0.337 0.75 0.75-0.336 0.75-0.75 0.75zM11.25 12.5c-0.965 0-1.75 0.785-1.75 1.75s0.785 1.75 1.75 1.75 1.75-0.785 1.75-1.75-0.785-1.75-1.75-1.75zM11.25 15c-0.414 0-0.75-0.337-0.75-0.75s0.336-0.75 0.75-0.75 0.75 0.337 0.75 0.75-0.336 0.75-0.75 0.75zM13.371 2l-0.302 2h-13.143l1.118 8.036h11.913l1.038-7.463 0.236-1.573h2.769v-1h-3.629zM12.926 5l-0.139 1h-11.574l-0.139-1h11.852zM1.914 11.036l-0.561-4.036h11.295l-0.561 4.036h-10.173z"
                  fill="#fff"
                ></path>
              </svg>
            </span>
            <span className="text fz-14 ml-10">Purchase Now</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
