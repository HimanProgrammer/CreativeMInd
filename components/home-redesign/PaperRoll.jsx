'use client';
import React from 'react';
import PaperRollStage from './PaperRollStage';

/* Full-width "printing roll" section. The WebGL engine lives in
   PaperRollStage, which the hero slider reuses at a smaller size. */

export default function PaperRoll() {
  return (
    <section className="rd-section rd-paperroll">
      <div className="container">
        <div className="row align-items-end mb-40">
          <div className="col-lg-7 rd-reveal-left">
            <p className="rd-section-tag">THE PRESS</p>
            <h2 className="rd-section-title">Our Work, <span>Rolling Out</span></h2>
          </div>
          <div className="col-lg-5 text-lg-end rd-reveal-right">
            <p className="pr-lead">Move your cursor over the press &mdash; the roll follows, printing our portfolio behind it.</p>
          </div>
        </div>
      </div>

      <div className="pr-shell">
        <PaperRollStage />
      </div>

      <style>{`
        .rd-paperroll .pr-lead {
          font-size: 15px; line-height: 1.7; color: #6a6a75; margin: 0;
        }
        .rd-paperroll .pr-shell {
          width: 100%;
          height: 72vh;
          min-height: 460px;
          margin-top: 34px;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(20,20,43,0.10);
        }
        @media (max-width: 767px) {
          .rd-paperroll .pr-shell { height: 56vh; min-height: 340px; border-radius: 12px; }
        }
      `}</style>
    </section>
  );
}
