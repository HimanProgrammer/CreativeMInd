'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Fallback static data if Supabase is empty
const FALLBACK = [
  { id:1, name:'Robert De Niro',  role:'Web Developer',  photo_url:'/assets/imgs/team/t1.png', linkedin_url:'#' },
  { id:2, name:'Brendan Fraser',  role:'UI/UX Designer', photo_url:'/assets/imgs/team/t2.png', linkedin_url:'#' },
  { id:3, name:'Ahmed Khaled',    role:'Web Designer',   photo_url:'/assets/imgs/team/t3.png', linkedin_url:'#' },
  { id:4, name:'Ahmed Khaled',    role:'SEO Marketing',  photo_url:'/assets/imgs/team/t4.png', linkedin_url:'#' },
];

function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('team_members')
      .select('*')
      .order('order_index', { ascending: true })
      .then(({ data }) => {
        setMembers(data?.length ? data : FALLBACK);
        setLoading(false);
      });
  }, []);

  return (
    <section className="team-crev2 section-padding pb-90">
      <div className="container">
        <div className="sec-head mb-80">
          <div className="d-flex align-items-center">
            <div>
              <span className="sub-title main-color mb-5">Our Team</span>
              <h3 className="fw-600 fz-50 text-u d-rotate wow">
                <span className="rotate-text">
                  Meet our <span className="fw-200">legends.</span>
                </span>
              </h3>
            </div>
            <div className="ml-auto vi-more">
              <a href="/page-team" className="butn butn-sm butn-bord radius-30">
                <span>Join to us</span>
              </a>
              <span className="icon ti-arrow-top-right"></span>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#555' }}>Loading team…</div>
        ) : (
          <div className="row md-marg">
            {members.map((m) => (
              <div key={m.id} className="col-lg-3 col-md-6">
                <div className="item mb-50">
                  <div className="bg-blur">
                    <div className="img">
                      {m.photo_url
                        ? <img src={m.photo_url} alt={m.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        : <div style={{ width:'100%', height:280, background:'linear-gradient(135deg,#6c63ff22,#e040fb22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:52, fontWeight:800, color:'rgba(108,99,255,0.5)' }}>
                            {m.name?.[0]?.toUpperCase()}
                          </div>
                      }
                      <div className="social">
                        <div className="links">
                          {m.linkedin_url && m.linkedin_url !== '#' ? (
                            <a href={m.linkedin_url} target="_blank" rel="noreferrer">
                              <i className="fab fa-linkedin-in"></i>
                            </a>
                          ) : (
                            <a href="#0"><i className="fab fa-facebook-f"></i></a>
                          )}
                          <a href="#0"><i className="fab fa-behance"></i></a>
                          <a href="#0"><i className="fab fa-instagram"></i></a>
                        </div>
                      </div>
                    </div>
                    <div className="circle-blur">
                      <img src="/assets/imgs/patterns/blur1.png" alt="" />
                    </div>
                  </div>
                  <div className="cont pt-30">
                    <div className="info">
                      <h6>{m.name}</h6>
                      <span className="fz-14 p-color mt-10">{m.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Join Us card */}
            <div className="col-lg-3 col-md-6">
              <div className="item-bord d-flex align-items-center justify-content-center mb-50">
                <div>
                  <h5>Become <br /> Our Member</h5>
                  <a href="/page-contact" className="mt-30">
                    <span className="ti-arrow-top-right fz-30"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="circle-blur">
        <img src="/assets/imgs/patterns/blur1.png" alt="" />
      </div>
    </section>
  );
}

export default Team;
