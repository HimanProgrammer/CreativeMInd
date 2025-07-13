'use client';
import loadBackgroudImages from '@/common/loadBackgroudImages';
import React, { useEffect } from 'react';

function Marq() {
  const marquess = ['Free Lifetime Updates', 'Free Support']; // Replace with your actual array
  const AllMarquess = Array(5).fill(marquess).flat();
  useEffect(() => {
    loadBackgroudImages();
  }, []);
  return (
    <section
      className="main-img d-flex align-items-end bg-img overlay-center"
      data-background="/assets/imgs/background/b1.jpg"
      data-overlay-dark="8"
    >
      <div className="marq-head ontop">
        <div className="main-marq xlrg text-u o-hidden">
          <div className="slide-har st1">
            <div className="box">
              {AllMarquess.map((item, i) => (
                <div key={i} className="item">
                  <h4>{item}</h4>
                </div>
              ))}
            </div>
            <div className="box">
              {AllMarquess.map((item, i) => (
                <div key={i} className="item">
                  <h4>{item}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Marq;
