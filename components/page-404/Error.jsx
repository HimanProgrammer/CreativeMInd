import React from 'react';

function Error() {
  const marquess = ['Page Not Found']; // Replace with your actual array
  const AllMarquess = Array(8).fill(marquess).flat();

  return (
    <section className="page-error section-padding valign">
      <div className="container">
        <div className="text-center">
          <h1>404</h1>
          <p>The page you are looking for doesn’t exist</p>
          <a
            href="/home-main"
            className="butn butn-md butn-bg main-colorbg radius-30 mt-30"
          >
            <span className="text">Back to Home</span>
          </a>
        </div>
      </div>
      <div className="marq">
        <div className="main-marq">
          <div className="slide-har st1 strok">
            <div className="box">
              {AllMarquess.map((item, i) => (
                <div key={i} className="item">
                  <h4 className="d-flex align-items-center">
                    <span>{item}</span>
                    <span className="ml-40">
                      <i className="fas fa-exclamation-triangle"></i>
                    </span>
                  </h4>
                </div>
              ))}
            </div>
            <div className="box">
              {AllMarquess.map((item, i) => (
                <div key={i} className="item">
                  <h4 className="d-flex align-items-center">
                    <span>{item}</span>
                    <span className="ml-40">
                      <i className="fas fa-exclamation-triangle"></i>
                    </span>
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="marq">
        <div className="main-marq">
          <div className="slide-har st2 non-strok">
            <div className="box">
              {AllMarquess.map((item, i) => (
                <div key={i} className="item">
                  <h4 className="d-flex align-items-center">
                    <span>{item}</span>
                    <span className="ml-40">
                      <i className="fas fa-exclamation-triangle"></i>
                    </span>
                  </h4>
                </div>
              ))}
            </div>
            <div className="box">
              {AllMarquess.map((item, i) => (
                <div key={i} className="item">
                  <h4 className="d-flex align-items-center">
                    <span>{item}</span>
                    <span className="ml-40">
                      <i className="fas fa-exclamation-triangle"></i>
                    </span>
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="marq">
        <div className="main-marq">
          <div className="slide-har st1 strok">
            <div className="box">
              {AllMarquess.map((item, i) => (
                <div key={i} className="item">
                  <h4 className="d-flex align-items-center">
                    <span>{item}</span>
                    <span className="ml-40">
                      <i className="fas fa-exclamation-triangle"></i>
                    </span>
                  </h4>
                </div>
              ))}
            </div>
            <div className="box">
              {AllMarquess.map((item, i) => (
                <div key={i} className="item">
                  <h4 className="d-flex align-items-center">
                    <span>{item}</span>
                    <span className="ml-40">
                      <i className="fas fa-exclamation-triangle"></i>
                    </span>
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="marq">
        <div className="main-marq">
          <div className="slide-har st2 non-strok">
            <div className="box">
              {AllMarquess.map((item, i) => (
                <div key={i} className="item">
                  <h4 className="d-flex align-items-center">
                    <span>{item}</span>
                    <span className="ml-40">
                      <i className="fas fa-exclamation-triangle"></i>
                    </span>
                  </h4>
                </div>
              ))}
            </div>
            <div className="box">
              {AllMarquess.map((item, i) => (
                <div key={i} className="item">
                  <h4 className="d-flex align-items-center">
                    <span>{item}</span>
                    <span className="ml-40">
                      <i className="fas fa-exclamation-triangle"></i>
                    </span>
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Error;
