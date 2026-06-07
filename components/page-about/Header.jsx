'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import loadBackgroudImages from '@/common/loadBackgroudImages';

function Header() {
  useLayoutEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.header', { y: 200 }, { y: 0 }, '+=2.5');
    tl.fromTo('.header .container', { opacity: 0, translateY: 40 }, { opacity: 1, translateY: 0 }, '-=0');
    return () => tl.kill();
  }, []);
  useEffect(() => { loadBackgroudImages(); }, []);

  return (
    <div style={{
      position: 'relative',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: '#fff',
      paddingTop: 120,
      paddingBottom: 80,
    }}>
      {/* Decorative blobs */}
      <div style={{ position:'absolute', top:-100, right:-100, width:500, height:500, borderRadius:'50%', background:'rgba(240,90,40,0.06)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, left:-80, width:400, height:400, borderRadius:'50%', background:'rgba(108,99,255,0.05)', pointerEvents:'none' }} />

      {/* Grid pattern */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:'linear-gradient(rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.04) 1px,transparent 1px)',
        backgroundSize:'60px 60px',
      }} />

      <div className="container" style={{ position:'relative', zIndex:2, textAlign:'center' }}>
        {/* Breadcrumb */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:24, color:'#999', fontSize:13 }}>
          <a href="/" style={{ color:'#999', textDecoration:'none', transition:'color 0.2s' }}>Home</a>
          <span style={{ color:'#ddd' }}>›</span>
          <span style={{ color:'#f05a28', fontWeight:600 }}>About Us</span>
        </div>

        {/* Tag */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          background:'rgba(240,90,40,0.08)', border:'1px solid rgba(240,90,40,0.2)',
          borderRadius:50, padding:'6px 18px',
          color:'#f05a28', fontSize:12, fontWeight:700,
          letterSpacing:'0.14em', textTransform:'uppercase',
          marginBottom:28,
        }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#f05a28', display:'inline-block' }} />
          Who We Are
        </div>

        {/* Main heading */}
        <h1 style={{
          fontSize:'clamp(48px, 8vw, 90px)',
          fontWeight:800,
          lineHeight:1.05,
          color:'#111',
          margin:'0 0 24px',
          letterSpacing:'-2px',
        }}>
          About <span style={{
            background:'linear-gradient(135deg, #f05a28, #e040fb)',
            WebkitBackgroundClip:'text',
            WebkitTextFillColor:'transparent',
            backgroundClip:'text',
          }}>Studio</span>
        </h1>

        {/* Sub text */}
        <p style={{ color:'#888', fontSize:18, maxWidth:560, margin:'0 auto 40px', lineHeight:1.7 }}>
          Crafting impactful brands, stunning visuals &amp; seamless digital experiences that drive real results.
        </p>

        {/* Quick stats row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, flexWrap:'wrap' }}>
          {[
            { val:'6700+', lbl:'Projects Done' },
            { val:'100%', lbl:'Client Satisfaction' },
            { val:'12+', lbl:'Years Experience' },
            { val:'34+', lbl:'Awards Won' },
          ].map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ padding:'16px 36px', textAlign:'center' }}>
                <div style={{ fontSize:28, fontWeight:800, color:'#111', letterSpacing:'-1px' }}>{s.val}</div>
                <div style={{ fontSize:12, color:'#aaa', marginTop:4, fontWeight:500 }}>{s.lbl}</div>
              </div>
              {i < 3 && <div style={{ width:1, height:40, background:'rgba(0,0,0,0.1)' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Header;
