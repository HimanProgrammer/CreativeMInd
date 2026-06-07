'use client';
import React from 'react';

function Intro() {
  return (
    <section style={{ background:'#fff', padding:'80px 0 100px' }}>
      <div className="container">
        <div className="row align-items-center" style={{ gap:'0' }}>

          {/* ── Left: Images ── */}
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div style={{ position:'relative', paddingRight:20 }}>

              {/* Main large image */}
              <div style={{ borderRadius:24, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.12)' }}>
                <img src="/assets/imgs/intro/i1.jpg" alt="CreativeMind team"
                  style={{ width:'100%', height:420, objectFit:'cover', display:'block' }} />
              </div>

              {/* Small image overlapping */}
              <div style={{
                position:'absolute', bottom:-30, right:-10,
                width:200, height:160,
                borderRadius:16, overflow:'hidden',
                boxShadow:'0 16px 40px rgba(0,0,0,0.18)',
                border:'4px solid #fff',
              }}>
                <img src="/assets/imgs/intro/i2.jpg" alt="CreativeMind work"
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              </div>

              {/* Badge — Years */}
              <div style={{
                position:'absolute', top:30, left:-20,
                background:'linear-gradient(135deg,#f05a28,#e040fb)',
                borderRadius:20, padding:'18px 22px',
                boxShadow:'0 12px 32px rgba(240,90,40,0.35)',
                color:'#fff', textAlign:'center',
              }}>
                <div style={{ fontSize:34, fontWeight:900, lineHeight:1 }}>12+</div>
                <div style={{ fontSize:11, fontWeight:600, marginTop:4, opacity:0.9, letterSpacing:'0.06em' }}>YEARS EXP.</div>
              </div>
            </div>
          </div>

          {/* ── Right: Content ── */}
          <div className="col-lg-6" style={{ paddingLeft:48, paddingTop:30 }}>

            <span style={{
              display:'inline-block',
              background:'rgba(240,90,40,0.08)', border:'1px solid rgba(240,90,40,0.18)',
              color:'#f05a28', fontSize:11, fontWeight:700,
              letterSpacing:'0.16em', textTransform:'uppercase',
              padding:'5px 16px', borderRadius:50, marginBottom:22,
            }}>
              Our Story
            </span>

            <h2 style={{ color:'#111', fontSize:38, fontWeight:800, lineHeight:1.2, marginBottom:20, letterSpacing:'-0.5px' }}>
              We craft digital <span style={{ color:'#f05a28' }}>experiences</span> that make brands unforgettable
            </h2>

            <p style={{ color:'#666', fontSize:15, lineHeight:1.8, marginBottom:18 }}>
              CreativeMind IT Solutions is a full-service creative agency delivering end-to-end design solutions
              rooted in experience strategy. We help you build standout brands and launch online platforms your customers love.
            </p>
            <p style={{ color:'#888', fontSize:14, lineHeight:1.8, marginBottom:32 }}>
              From logos to full-scale websites and mobile apps, we blend creativity with functionality to elevate your
              business. Let&apos;s turn your ideas into digital experiences that captivate and convert.
            </p>

            {/* Two column feature points */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:36 }}>
              {[
                { icon:'🎯', text:'Strategic Thinking' },
                { icon:'🚀', text:'Fast Delivery' },
                { icon:'💎', text:'Premium Quality' },
                { icon:'🤝', text:'Dedicated Support' },
              ].map((f,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{
                    width:36, height:36, borderRadius:10,
                    background:'rgba(240,90,40,0.08)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:16, flexShrink:0,
                  }}>{f.icon}</div>
                  <span style={{ color:'#444', fontSize:14, fontWeight:600 }}>{f.text}</span>
                </div>
              ))}
            </div>

            <a href="/page-services" style={{
              display:'inline-flex', alignItems:'center', gap:10,
              background:'#111', color:'#fff',
              padding:'14px 32px', borderRadius:50,
              fontSize:14, fontWeight:700, textDecoration:'none',
              boxShadow:'0 8px 24px rgba(0,0,0,0.18)',
              transition:'all 0.25s',
            }}>
              Explore Services <span style={{ fontSize:18 }}>→</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Intro;
