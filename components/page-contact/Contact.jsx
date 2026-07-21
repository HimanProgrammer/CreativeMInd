'use client';
import React, { useState } from 'react';
import { SITE } from '@/lib/siteConfig';
import { supabase } from '@/lib/supabase';

const EMPTY = { name: '', email: '', subject: '', message: '' };

function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState(null); // null | 'sending' | 'ok' | 'err'
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setStatus('err');
      setError('Please fill in your name, email and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('err');
      setError('Please enter a valid email address.');
      return;
    }

    setStatus('sending');
    try {
      const { error: dbErr } = await supabase.from('messages').insert({
        name,
        email,
        subject: form.subject.trim() || null,
        message,
      });
      if (dbErr) throw dbErr;
      setStatus('ok');
      setForm(EMPTY);
    } catch (err) {
      setStatus('err');
      setError(
        err?.message?.includes('relation')
          ? 'Message store is not set up yet. Please email us directly.'
          : 'Could not send your message. Please try again or email us directly.'
      );
    }
  }

  return (
    <section className="contact section-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 valign">
            <div className="sec-head info-box full-width md-mb80">
              <div className="phone fz-30 fw-600 underline main-color">
                <a href={SITE.phoneTel}>{SITE.phone}</a>
              </div>
              <div className="morinfo mt-50 pb-30 bord-thin-bottom">
                <h6 className="mb-15">Address</h6>
                <p>{SITE.address}</p>
              </div>
              <div className="morinfo mt-30 pb-30 bord-thin-bottom">
                <h6 className="mb-15">Email</h6>
                <p><a href={SITE.emailHref}>{SITE.email}</a></p>
              </div>
              <div className="social-icon mt-50">
                <a href={SITE.social.facebook} target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a href={SITE.social.dribbble} target="_blank" rel="noreferrer"><i className="fab fa-dribbble"></i></a>
                <a href={SITE.social.behance} target="_blank" rel="noreferrer"><i className="fab fa-behance"></i></a>
                <a href={SITE.social.instagram} target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>

          <div className="col-lg-7 offset-lg-1 valign">
            <div className="full-width">
              <div className="sec-head mb-50">
                <h6 className="sub-title main-color mb-15">Let&apos;s Chat</h6>
                <h3 className="text-u ls1">
                  Send a <span className="fw-200">message</span>
                </h3>
              </div>

              {status === 'ok' ? (
                <div style={st.success}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                  <h4 style={st.successH}>Thanks — message sent!</h4>
                  <p style={st.successP}>
                    We&apos;ve received your enquiry and will get back to you within 24 hours.
                  </p>
                  <button type="button" onClick={() => setStatus(null)} style={st.againBtn}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="form2" noValidate>
                  <div className="controls row">
                    <div className="col-lg-6">
                      <div className="form-group mb-30">
                        <input
                          type="text" name="name" placeholder="Name *"
                          value={form.name} onChange={set('name')}
                          disabled={status === 'sending'} required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group mb-30">
                        <input
                          type="email" name="email" placeholder="Email *"
                          value={form.email} onChange={set('email')}
                          disabled={status === 'sending'} required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group mb-30">
                        <input
                          type="text" name="subject" placeholder="Subject"
                          value={form.subject} onChange={set('subject')}
                          disabled={status === 'sending'}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <textarea
                          name="message" placeholder="Message *" rows="4"
                          value={form.message} onChange={set('message')}
                          disabled={status === 'sending'} required
                        ></textarea>
                      </div>

                      {status === 'err' && error && <p style={st.error}>{error}</p>}

                      <div className="mt-30">
                        <button
                          type="submit"
                          className="butn butn-full butn-bord radius-30"
                          disabled={status === 'sending'}
                          style={status === 'sending' ? { opacity: 0.6, pointerEvents: 'none' } : undefined}
                        >
                          <span className="text">
                            {status === 'sending' ? 'Sending…' : "Let's Talk"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const st = {
  success: {
    textAlign: 'center', padding: '48px 32px',
    background: 'rgba(240,90,40,0.06)', border: '1px solid rgba(240,90,40,0.25)',
    borderRadius: 18,
  },
  successH: { margin: '0 0 10px', fontSize: 24, fontWeight: 800 },
  successP: { margin: 0, opacity: 0.75, lineHeight: 1.7 },
  againBtn: {
    marginTop: 22, padding: '11px 26px', borderRadius: 30, cursor: 'pointer',
    background: '#f05a28', color: '#fff', border: 'none', fontWeight: 700, fontSize: 14,
  },
  error: {
    marginTop: 18, marginBottom: 0, padding: '10px 14px',
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8, color: '#ef4444', fontSize: 14,
  },
};

export default Contact;
