'use client';
import isInView from '@/common/isInView';
import React, { useEffect } from 'react';

function Intro() {
  function handleShowProgressValues() {
    isInView({
      selector: '.skill-progress .progres',
      isElements: true,
      callback: (element) => {
        element.style.width = element.getAttribute('data-value');
      },
    });
  }
  useEffect(() => {
    window.addEventListener('scroll', handleShowProgressValues);
    return () => window.removeEventListener('scroll', handleShowProgressValues);
  }, []);
  return (
    <section className="team-single section-padding pb-0">
      <div className="container">
        <div className="row md-marg justify-content-around bord">
          <div className="col-lg-5">
            <div className="img md-mb50">
              <img src="/assets/imgs/team/t5.jpg" alt="" />
            </div>
          </div>
          <div className="col-lg-6 valign">
            <div className="cont">
              <h2>Aron Bowers</h2>
              <h6 className="sub-title main-color mt-10">UI/UX Designer</h6>
              <div className="text mt-15">
                <p>
                  This is the main factor that sets us apart from our
                  competition and allows us to deliver a specialist business
                  consultancy service.
                </p>
              </div>
              <div className="info mt-30">
                <ul className="rest">
                  <li className="mb-25 fz-18">
                    <span className="sub-title mr-15">RESPONSIBILITY :</span>{' '}
                    Designer
                  </li>
                  <li className="mb-25 fz-18">
                    <span className="sub-title mr-15">Experiences :</span> 12+
                    Years
                  </li>
                  <li className="mb-25 fz-18">
                    <span className="sub-title mr-15">Date Of Birth :</span> 16
                    Fub 1995
                  </li>
                  <li className="mb-25 fz-18">
                    <span className="sub-title mr-15">Email :</span>{' '}
                    Aron_Bowers@domain.com
                  </li>
                  <li className="fz-18">
                    <span className="sub-title mr-15">Phone :</span> +44 (0) 20
                    7430 2973
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row md-marg justify-content-around mt-80">
          <div className="col-lg-6 valign">
            <div className="text md-mb50">
              <h4 className="mb-15">About Me</h4>
              <p>
                Aron Bowers is known for her ability to take a creative brief
                and run with it, coming back with fresh ideas and a perfectly
                built design file every time. From digital design to long-format
                layouts, he blends beautiful and intuitive with each project he
                touches. he also happens to be the queen of deadline-crushing,
                Zen attitude that keeps the whole Statement team centered.
              </p>
              <ul className="rest mt-30 social-icon d-flex align-items-center">
                <li className="hover-this cursor-pointer">
                  <a href="#0" className="hover-anim">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li className="hover-this cursor-pointer ml-10">
                  <a href="#0" className="hover-anim">
                    <i className="fab fa-dribbble"></i>
                  </a>
                </li>
                <li className="hover-this cursor-pointer ml-10">
                  <a href="#0" className="hover-anim">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </li>
                <li className="hover-this cursor-pointer ml-10">
                  <a href="#0" className="hover-anim">
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="skills-box">
              <div className="skill-item mb-30">
                <h5 className="sub-title mb-15">UI / UX Design 90%</h5>
                <div className="skill-progress">
                  <div className="progres" data-value="90%"></div>
                </div>
              </div>
              <div className="skill-item mb-30">
                <h5 className="sub-title mb-15">Digital Marketing 80%</h5>
                <div className="skill-progress">
                  <div className="progres" data-value="80%"></div>
                </div>
              </div>
              <div className="skill-item">
                <h5 className="sub-title mb-15">Development 85%</h5>
                <div className="skill-progress">
                  <div className="progres" data-value="85%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;
