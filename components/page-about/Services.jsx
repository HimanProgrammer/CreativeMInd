'use client';
import React, { useState } from 'react';

const SERVICES = [
  { num:'01', tag:'Web & App Design', title:'UI / UX', sub:'Design',   img:'/assets/imgs/serv-img/1.jpg', color:'#6c63ff', desc:'We help clients succeed by creating identities, digital experiences, and print materials that communicate clearly and effectively.' },
  { num:'02', tag:'Branding',         title:'Brand',  sub:'Strategy', img:'/assets/imgs/serv-img/2.jpg', color:'#f05a28', desc:'We help clients succeed by building strong brand identities, voice guidelines, and visual systems that resonate with your audience.' },
  { num:'03', tag:'Growth Marketing', title:'SEO /',  sub:'Marketing',img:'/assets/imgs/serv-img/3.jpg', color:'#00bfa5', desc:'We help clients succeed by driving organic growth, creating campaigns, and building digital marketing funnels that convert visitors.' },
];

function Services() {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{ padding:'100px 0', background:'#fafafa', borderTop:'1px solid rgba(0,0,0,0.06)' }}>
      <div className="container">

        {/* Header row */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:64, flexWrap:'wrap', gap:20 }}>
          <div>
            <span style={{
              display:'inline-block', background:'rgba(240,90,40,0.08)', border:'1px solid rgba(240,90,40,0.18)',
              color:'#f05a28', fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase',
              padding:'5px 16px', borderRadius:50, marginBottom:16,
            }}>What We Do</span>
            <h2 style={{ color:'#111', fontSize:40, fontWeight:800, margin:0, letterSpacing:'-0.5px', lineHeight:1.15 }}>
              Featured <span style={{ color:'#bbb', fontWeight:300 }}>Services</span>
            </h2>
          </div>
          <a href="/page-services" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            border:'1.5px solid #222', color:'#222',
            padding:'12px 26px', borderRadius:50,
            fontSize:13, fontWeight:700, textDecoration:'none',
            transition:'all 0.2s',
          }}>
            View All Services <span>↗</span>
          </a>
        </div>

        {/* Service rows */}
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {SERVICES.map((s, i) => (
            <div key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display:'grid', gridTemplateColumns:'80px 1fr 1fr auto',
                gap:32, alignItems:'center',
                padding:'36px 32px',
                borderRadius:16,
                marginBottom:8,
                background: hovered===i ? '#fff' : 'transparent',
                boxShadow: hovered===i ? '0 8px 40px rgba(0,0,0,0.08)' : 'none',
                borderBottom: hovered===i ? 'none' : '1px solid rgba(0,0,0,0.07)',
                transition:'all 0.25s',
                cursor:'pointer',
              }}
            >
              {/* Number */}
              <div style={{
                fontSize:52, fontWeight:900, lineHeight:1,
                color:'transparent',
                WebkitTextStroke:`1.5px ${hovered===i ? s.color : '#ddd'}`,
                transition:'all 0.25s',
                letterSpacing:'-2px',
              }}>{s.num}</div>

              {/* Title */}
              <div>
                <span style={{ color:s.color, fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', display:'block', marginBottom:6 }}>{s.tag}</span>
                <h3 style={{ color:'#111', fontSize:28, fontWeight:800, margin:0, lineHeight:1.15 }}>
                  {s.title} <span style={{ fontWeight:300, color:'#999' }}>{s.sub}</span>
                </h3>
              </div>

              {/* Description */}
              <p style={{ color:'#777', fontSize:14, lineHeight:1.75, margin:0 }}>{s.desc}</p>

              {/* Image + Arrow */}
              <div style={{ position:'relative', width:120, height:90, borderRadius:12, overflow:'hidden', flexShrink:0 }}>
                <img src={s.img} alt={s.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.4s', transform: hovered===i ? 'scale(1.08)' : 'scale(1)' }} />
                <a href="/page-services-details" style={{
                  position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
                  background: hovered===i ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0)',
                  color:'#fff', fontSize:20, textDecoration:'none',
                  transition:'all 0.25s',
                  opacity: hovered===i ? 1 : 0,
                }}>↗</a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Services;
