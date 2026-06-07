'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

const EMPTY = {
  company_name: '', tagline: '', description: '',
  mission: '', vision: '', founded_year: '',
  total_projects: '', happy_clients: '', team_size: '', awards: '',
  hero_image_url: '', logo_url: '',
  email: '', phone: '', address: '', website: '',
};

export default function AboutPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');
  const [tab, setTab]         = useState('company');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/admin/login'); return; }
    fetchAbout();
  }, [user, authLoading]);

  async function fetchAbout() {
    setLoading(true);
    try {
      const { data } = await supabase.from('about_us').select('*').limit(1).maybeSingle();
      if (data) setForm({ ...EMPTY, ...data });
    } catch {}
    setLoading(false);
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    const { id, ...rest } = form;
    let result;
    if (id) {
      result = await supabase.from('about_us').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      result = await supabase.from('about_us').insert([rest]).select().single();
      if (result.data) setForm((f) => ({ ...f, id: result.data.id }));
    }
    if (result.error) { setError(result.error.message); }
    else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  }

  if (loading || authLoading) return (
    <div style={{ display:'flex', height:'100vh', background:'#0a0a14', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:44, height:44, border:'3px solid rgba(108,99,255,0.2)', borderTopColor:'#6c63ff', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 14px' }} />
        <div style={{ color:'#666', fontSize:13 }}>Loading About Us…</div>
      </div>
    </div>
  );

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0a0a14', fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder, textarea::placeholder { color:#3a3a5a; }
        input:focus, textarea:focus { border-color:rgba(108,99,255,0.5)!important; box-shadow:0 0 0 3px rgba(108,99,255,0.12)!important; }
        .field-row:hover label { color:#c0b8ff; }
      `}</style>

      <AdminSidebar
        onLogout={logout}
        userEmail={user?.email}
        userName={user?.displayName || user?.user_metadata?.full_name}
        userPhoto={user?.photoURL || user?.user_metadata?.avatar_url}
      />

      <main style={{ marginLeft:250, flex:1, minHeight:'100vh', background:'#0a0a14' }}>

        {/* Top banner */}
        <div style={{
          background:'linear-gradient(135deg, #0f0f2a 0%, #13132b 50%, #0f0f2a 100%)',
          borderBottom:'1px solid rgba(255,255,255,0.06)',
          padding:'32px 40px 28px',
          position:'relative', overflow:'hidden',
        }}>
          {/* Glow orbs */}
          <div style={{ position:'absolute', top:-60, right:80, width:220, height:220, background:'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', top:-40, right:260, width:160, height:160, background:'radial-gradient(circle, rgba(224,64,251,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />

          <div style={{ display:'flex', alignItems:'center', gap:16, position:'relative' }}>
            <div style={{
              width:52, height:52, borderRadius:14,
              background:'linear-gradient(135deg,#6c63ff,#e040fb)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:24, boxShadow:'0 8px 24px rgba(108,99,255,0.4)',
            }}>🏢</div>
            <div>
              <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>About Us</h1>
              <p style={{ margin:'4px 0 0', color:'#555', fontSize:13 }}>
                Company info · Stats · Contact — all shown on your website
              </p>
            </div>
            {form.id && (
              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6, color:'#555', fontSize:12 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#00e676', display:'inline-block' }} />
                Record saved
              </div>
            )}
          </div>
        </div>

        <div style={{ padding:'32px 40px' }}>

          {/* Tab bar */}
          <div style={{ display:'flex', gap:4, marginBottom:28, background:'rgba(255,255,255,0.03)', borderRadius:12, padding:5, width:'fit-content', border:'1px solid rgba(255,255,255,0.06)' }}>
            {[
              { key:'company', icon:'🏢', label:'Company' },
              { key:'stats',   icon:'📊', label:'Stats' },
              { key:'contact', icon:'📞', label:'Contact' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding:'9px 22px', borderRadius:9, border:'none', cursor:'pointer',
                fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:7,
                transition:'all 0.18s',
                background: tab === t.key ? 'linear-gradient(135deg,#6c63ff,#e040fb)' : 'transparent',
                color: tab === t.key ? '#fff' : '#555',
                boxShadow: tab === t.key ? '0 4px 14px rgba(108,99,255,0.4)' : 'none',
              }}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display:'grid', gap:28, animation:'fadeIn 0.25s ease' }}>

              {/* ── COMPANY ─────────────────────────────────────────── */}
              {tab === 'company' && (
                <>
                  <Card title="Brand Identity" icon="✨">
                    <Grid cols={2}>
                      <Field label="Company Name" required>
                        <FInput value={form.company_name} onChange={set('company_name')} placeholder="CreativeMind IT Solutions" required />
                      </Field>
                      <Field label="Tagline">
                        <FInput value={form.tagline} onChange={set('tagline')} placeholder="Crafting Digital Excellence" />
                      </Field>
                    </Grid>
                    <Field label="Founded Year">
                      <FInput value={form.founded_year} onChange={set('founded_year')} placeholder="2018" type="number" style={{ maxWidth:180 }} />
                    </Field>
                  </Card>

                  <Card title="About Description" icon="📄">
                    <Field label="Full Description">
                      <FTextarea value={form.description} onChange={set('description')} placeholder="Write a compelling description of your company, what you do, and what makes you unique…" rows={6} />
                    </Field>
                    <Grid cols={2}>
                      <Field label="Mission Statement">
                        <FTextarea value={form.mission} onChange={set('mission')} placeholder="Our mission is to…" rows={4} />
                      </Field>
                      <Field label="Vision Statement">
                        <FTextarea value={form.vision} onChange={set('vision')} placeholder="Our vision is to…" rows={4} />
                      </Field>
                    </Grid>
                  </Card>

                  <Card title="Media / Images" icon="🖼️">
                    <Grid cols={2}>
                      <Field label="Hero / Banner Image URL">
                        <FInput value={form.hero_image_url} onChange={set('hero_image_url')} placeholder="https://…" />
                        {form.hero_image_url && (
                          <ImgPreview src={form.hero_image_url} style={{ height:110, objectFit:'cover', borderRadius:8, marginTop:10, width:'100%' }} />
                        )}
                      </Field>
                      <Field label="Logo URL">
                        <FInput value={form.logo_url} onChange={set('logo_url')} placeholder="https://…" />
                        {form.logo_url && (
                          <div style={{ marginTop:10, background:'rgba(255,255,255,0.05)', borderRadius:8, padding:12, display:'inline-flex', border:'1px solid rgba(255,255,255,0.08)' }}>
                            <ImgPreview src={form.logo_url} style={{ height:48, objectFit:'contain' }} />
                          </div>
                        )}
                      </Field>
                    </Grid>
                  </Card>
                </>
              )}

              {/* ── STATS ───────────────────────────────────────────── */}
              {tab === 'stats' && (
                <>
                  <Card title="Numbers That Impress" icon="🔢" subtitle="Shown as animated counters on your homepage and About page">
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
                      {[
                        { key:'total_projects', icon:'✅', label:'Projects Completed', color:'#6c63ff', placeholder:'250+' },
                        { key:'happy_clients',  icon:'😊', label:'Happy Clients',      color:'#e040fb', placeholder:'180+' },
                        { key:'team_size',       icon:'👥', label:'Team Members',       color:'#00bfa5', placeholder:'12' },
                        { key:'awards',          icon:'🏆', label:'Awards Won',         color:'#f59e0b', placeholder:'8' },
                      ].map(s => (
                        <div key={s.key} style={{
                          background:'rgba(255,255,255,0.03)',
                          border:`1px solid ${s.color}22`,
                          borderRadius:14, padding:'20px 20px 18px',
                          position:'relative', overflow:'hidden',
                        }}>
                          <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, background:`radial-gradient(circle,${s.color}18 0%,transparent 70%)`, pointerEvents:'none' }} />
                          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                            <div style={{ width:36, height:36, borderRadius:10, background:`${s.color}18`, border:`1px solid ${s.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{s.icon}</div>
                            <span style={{ color:'#888', fontSize:12, fontWeight:600 }}>{s.label}</span>
                          </div>
                          <input
                            value={form[s.key]} onChange={set(s.key)}
                            placeholder={s.placeholder}
                            style={{
                              width:'100%', padding:'10px 14px', borderRadius:8, boxSizing:'border-box',
                              background:'rgba(255,255,255,0.05)', border:`1px solid ${s.color}33`,
                              color:'#fff', fontSize:20, fontWeight:800, outline:'none',
                              transition:'all 0.18s',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Live preview */}
                  <Card title="Live Preview" icon="👁️" subtitle="How it looks on website">
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
                      {[
                        { label:'Projects', val:form.total_projects||'—', icon:'✅', g:'linear-gradient(135deg,#6c63ff,#4f46e5)' },
                        { label:'Clients',  val:form.happy_clients ||'—', icon:'😊', g:'linear-gradient(135deg,#e040fb,#9c27b0)' },
                        { label:'Team',     val:form.team_size     ||'—', icon:'👥', g:'linear-gradient(135deg,#00bfa5,#00897b)' },
                        { label:'Awards',   val:form.awards        ||'—', icon:'🏆', g:'linear-gradient(135deg,#f59e0b,#ea580c)' },
                      ].map(s => (
                        <div key={s.label} style={{
                          background:s.g, borderRadius:14, padding:'20px 16px',
                          textAlign:'center', boxShadow:'0 8px 24px rgba(0,0,0,0.3)',
                        }}>
                          <div style={{ fontSize:26 }}>{s.icon}</div>
                          <div style={{ fontSize:28, fontWeight:900, color:'#fff', margin:'8px 0 4px', letterSpacing:'-1px' }}>{s.val}</div>
                          <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {/* ── CONTACT ─────────────────────────────────────────── */}
              {tab === 'contact' && (
                <Card title="Contact Information" icon="📞" subtitle="Shown in footer and Contact page">
                  <Grid cols={2}>
                    <Field label="📧 Email Address">
                      <FInput value={form.email} onChange={set('email')} placeholder="info@creativemind.com" type="email" />
                    </Field>
                    <Field label="📱 Phone Number">
                      <FInput value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
                    </Field>
                  </Grid>
                  <Field label="📍 Office Address">
                    <FTextarea value={form.address} onChange={set('address')} placeholder="123 Main Street, City, State — 400001" rows={3} />
                  </Field>
                  <Field label="🌐 Website URL">
                    <FInput value={form.website} onChange={set('website')} placeholder="https://creativemind.com" />
                  </Field>

                  {/* Contact preview */}
                  {(form.email || form.phone || form.address) && (
                    <div style={{ marginTop:8, padding:'18px 20px', background:'rgba(108,99,255,0.08)', border:'1px solid rgba(108,99,255,0.2)', borderRadius:12 }}>
                      <div style={{ color:'#666', fontSize:11, fontWeight:700, letterSpacing:'0.08em', marginBottom:12 }}>CONTACT CARD PREVIEW</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                        {form.email   && <div style={{ display:'flex', gap:10, alignItems:'center', color:'#ccc', fontSize:13 }}><span>📧</span>{form.email}</div>}
                        {form.phone   && <div style={{ display:'flex', gap:10, alignItems:'center', color:'#ccc', fontSize:13 }}><span>📱</span>{form.phone}</div>}
                        {form.address && <div style={{ display:'flex', gap:10, alignItems:'flex-start', color:'#ccc', fontSize:13 }}><span>📍</span><span style={{ whiteSpace:'pre-line' }}>{form.address}</span></div>}
                        {form.website && <div style={{ display:'flex', gap:10, alignItems:'center', color:'#6c63ff', fontSize:13 }}><span>🌐</span>{form.website}</div>}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Error */}
              {error && (
                <div style={{ padding:'14px 18px', background:'rgba(255,68,68,0.08)', border:'1px solid rgba(255,68,68,0.25)', borderRadius:10, color:'#ff6b6b', fontSize:13, display:'flex', gap:10, alignItems:'flex-start' }}>
                  <span style={{ fontSize:16 }}>❌</span>
                  <div>{error}</div>
                </div>
              )}

              {/* Save bar */}
              <div style={{
                display:'flex', alignItems:'center', gap:14,
                padding:'18px 24px',
                background:'rgba(255,255,255,0.03)',
                border:'1px solid rgba(255,255,255,0.07)',
                borderRadius:14,
              }}>
                <button type="submit" disabled={saving} style={{
                  padding:'12px 34px', borderRadius:10, border:'none', cursor:saving?'not-allowed':'pointer',
                  background:'linear-gradient(135deg,#6c63ff,#e040fb)',
                  color:'#fff', fontWeight:700, fontSize:14,
                  opacity:saving?0.7:1, transition:'all 0.18s',
                  boxShadow:'0 6px 20px rgba(108,99,255,0.4)',
                  display:'flex', alignItems:'center', gap:8,
                }}>
                  {saving
                    ? <><span style={{ width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite',display:'inline-block' }}/> Saving…</>
                    : '💾  Save Changes'
                  }
                </button>

                {saved && (
                  <div style={{ display:'flex', alignItems:'center', gap:7, color:'#00e676', fontSize:13, fontWeight:600, animation:'fadeIn 0.3s ease' }}>
                    <span style={{ width:20,height:20,background:'rgba(0,230,118,0.15)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11 }}>✓</span>
                    Saved successfully!
                  </div>
                )}

                <div style={{ marginLeft:'auto', color:'#444', fontSize:12 }}>
                  {form.id ? `ID: ${form.id.slice(0,8)}…` : 'New record — will be created on save'}
                </div>
              </div>

            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

/* ── Reusable mini components ─────────────────────────────────────── */
function Card({ title, icon, subtitle, children }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, overflow:'hidden' }}>
      <div style={{ padding:'18px 24px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontSize:18 }}>{icon}</span>
        <div>
          <div style={{ color:'#fff', fontWeight:700, fontSize:15 }}>{title}</div>
          {subtitle && <div style={{ color:'#555', fontSize:12, marginTop:2 }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:20 }}>{children}</div>
    </div>
  );
}

function Grid({ cols, children }) {
  return <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:20 }}>{children}</div>;
}

function Field({ label, required, children }) {
  return (
    <div className="field-row">
      <label style={{ display:'block', color:'#666', fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:8, transition:'color 0.15s' }}>
        {label}{required && <span style={{ color:'#e040fb', marginLeft:3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function FInput({ style, ...props }) {
  return (
    <input {...props} style={{
      width:'100%', padding:'11px 14px', borderRadius:9, boxSizing:'border-box',
      background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)',
      color:'#fff', fontSize:13, outline:'none', transition:'all 0.18s',
      ...style,
    }} />
  );
}

function FTextarea(props) {
  return (
    <textarea {...props} style={{
      width:'100%', padding:'11px 14px', borderRadius:9, boxSizing:'border-box',
      background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)',
      color:'#fff', fontSize:13, outline:'none', resize:'vertical',
      lineHeight:1.65, transition:'all 0.18s',
    }} />
  );
}

function ImgPreview({ src, style }) {
  const [err, setErr] = useState(false);
  if (err) return <div style={{ color:'#ff6b6b', fontSize:12, marginTop:8 }}>⚠️ Image could not load</div>;
  return <img src={src} alt="preview" onError={() => setErr(true)} style={{ display:'block', ...style }} />;
}
