'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

const EMPTY = { name:'', role:'', bio:'', photo_url:'', linkedin_url:'', order_index:0 };

export default function TeamPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [members, setMembers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(null);
  const [error, setError]           = useState('');
  const [saved, setSaved]           = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/admin/login'); return; }
    fetchMembers();
  }, [user, authLoading]);

  async function fetchMembers() {
    const { data } = await supabase.from('team_members').select('*').order('order_index');
    setMembers(data || []);
    setLoading(false);
  }

  function openAdd()  { setForm(EMPTY); setPhotoPreview(''); setError(''); setModal('add'); }
  function openEdit(m){ setForm({...m}); setPhotoPreview(m.photo_url||''); setError(''); setModal('edit'); }
  function closeModal(){ setModal(null); setError(''); setPhotoPreview(''); }
  const set = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));

  // ── Photo upload to Supabase Storage ──
  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext  = file.name.split('.').pop();
    const path = `team/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('portfolio-images').upload(path, file, { upsert: true });
    if (upErr) { setError('Upload failed: ' + upErr.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('portfolio-images').getPublicUrl(path);
    setForm(f => ({...f, photo_url: publicUrl}));
    setPhotoPreview(publicUrl);
    setUploading(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name || !form.role) { setError('Name and role are required.'); return; }
    setSaving(true); setError(''); setSaved(false);
    const payload = { ...form, order_index: Number(form.order_index) || 0 };
    let err;
    if (modal === 'add') {
      ({ error: err } = await supabase.from('team_members').insert([payload]));
    } else {
      const { id, ...rest } = payload;
      ({ error: err } = await supabase.from('team_members').update(rest).eq('id', id));
    }
    setSaving(false);
    if (err) { setError(err.message); return; }
    setSaved(true);
    await fetchMembers();
    setTimeout(() => { setSaved(false); closeModal(); }, 800);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this team member?')) return;
    setDeleting(id);
    await supabase.from('team_members').delete().eq('id', id);
    setMembers(prev => prev.filter(m => m.id !== id));
    setDeleting(null);
  }

  async function moveOrder(m, dir) {
    const newOrder = Number(m.order_index) + dir;
    await supabase.from('team_members').update({ order_index: newOrder }).eq('id', m.id);
    fetchMembers();
  }

  if (loading || authLoading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a18' }}>
      <div style={{ width:40, height:40, border:'3px solid rgba(108,99,255,0.2)', borderTopColor:'#6c63ff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0a0a18', fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .team-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(108,99,255,0.12) !important; }
      `}</style>

      <AdminSidebar onLogout={logout} userEmail={user?.email} userName={user?.displayName || user?.user_metadata?.full_name} userPhoto={user?.photoURL || user?.user_metadata?.avatar_url} />

      <main style={{ marginLeft:250, flex:1, padding:'32px 40px' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
          <div>
            <h1 style={{ color:'#fff', fontSize:26, fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.02em' }}>Team Members</h1>
            <p style={{ color:'#555', fontSize:13, margin:0 }}>
              {members.length} member{members.length !== 1 ? 's' : ''} · Changes reflect live on website
            </p>
          </div>
          <button onClick={openAdd} style={{
            padding:'11px 24px', background:'linear-gradient(135deg,#6c63ff,#e040fb)',
            border:'none', borderRadius:10, color:'#fff', fontSize:13, fontWeight:700,
            cursor:'pointer', boxShadow:'0 4px 20px rgba(108,99,255,0.3)',
            display:'flex', alignItems:'center', gap:8,
          }}>
            + Add Member
          </button>
        </div>

        {/* Live badge */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8, marginBottom:28,
          background:'rgba(0,230,118,0.08)', border:'1px solid rgba(0,230,118,0.2)',
          borderRadius:50, padding:'6px 16px', color:'#00e676', fontSize:12, fontWeight:600,
        }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#00e676', boxShadow:'0 0 8px #00e676' }} />
          Connected to Website — Add members here to show them on the About &amp; Team pages
        </div>

        {/* Empty */}
        {members.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ fontSize:52, marginBottom:16 }}>👥</div>
            <p style={{ color:'#555', marginBottom:24, fontSize:15 }}>No team members yet. Add your first member!</p>
            <button onClick={openAdd} style={{ padding:'12px 28px', background:'linear-gradient(135deg,#6c63ff,#e040fb)', border:'none', borderRadius:10, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
              + Add First Member
            </button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:20 }}>
            {members.map(m => (
              <div key={m.id} className="team-card" style={{
                background:'rgba(255,255,255,0.03)',
                border:'1px solid rgba(255,255,255,0.07)',
                borderRadius:18, overflow:'hidden',
                transition:'transform 0.25s, box-shadow 0.25s',
              }}>
                {/* Photo */}
                <div style={{ width:'100%', height:200, background:'linear-gradient(135deg,#6c63ff18,#e040fb18)', overflow:'hidden', position:'relative' }}>
                  {m.photo_url
                    ? <img src={m.photo_url} alt={m.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:56, fontWeight:800, color:'rgba(108,99,255,0.4)' }}>
                        {m.name?.[0]?.toUpperCase()}
                      </div>
                  }
                  {/* Order badge */}
                  <div style={{ position:'absolute', top:10, right:10, background:'rgba(0,0,0,0.6)', borderRadius:6, padding:'3px 8px', color:'#fff', fontSize:11, fontWeight:700 }}>
                    #{m.order_index ?? '—'}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding:'18px 20px 10px' }}>
                  <div style={{ color:'#fff', fontWeight:700, fontSize:16, marginBottom:4 }}>{m.name}</div>
                  <div style={{ color:'#6c63ff', fontSize:13, fontWeight:600, marginBottom:10 }}>{m.role}</div>
                  {m.bio && <p style={{ color:'#555', fontSize:12, lineHeight:1.6, margin:'0 0 8px' }}>{m.bio.slice(0,90)}{m.bio.length>90?'…':''}</p>}
                  {m.linkedin_url && (
                    <a href={m.linkedin_url} target="_blank" rel="noreferrer" style={{ color:'#0ea5e9', fontSize:11, fontWeight:600, textDecoration:'none' }}>LinkedIn ↗</a>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:8, padding:'10px 20px 16px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                  <button onClick={() => moveOrder(m, -1)} title="Move up" style={{ padding:'7px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:7, color:'#666', cursor:'pointer', fontSize:12 }}>↑</button>
                  <button onClick={() => moveOrder(m, 1)}  title="Move down" style={{ padding:'7px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:7, color:'#666', cursor:'pointer', fontSize:12 }}>↓</button>
                  <button onClick={() => openEdit(m)} style={{ flex:1, padding:'8px', background:'rgba(108,99,255,0.1)', border:'1px solid rgba(108,99,255,0.2)', borderRadius:8, color:'#6c63ff', cursor:'pointer', fontSize:12, fontWeight:600 }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(m.id)} disabled={deleting===m.id} style={{ flex:1, padding:'8px', background:'rgba(255,68,68,0.08)', border:'1px solid rgba(255,68,68,0.15)', borderRadius:8, color:'#ff6b6b', cursor:'pointer', fontSize:12, fontWeight:600 }}>
                    {deleting===m.id ? '…' : '🗑 Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Modal ── */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(6px)' }} onClick={closeModal}>
          <div style={{ background:'#13131f', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'32px', width:'100%', maxWidth:580, maxHeight:'90vh', overflowY:'auto', animation:'fadeIn 0.2s ease' }} onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
              <h2 style={{ color:'#fff', fontSize:20, fontWeight:800, margin:0 }}>
                {modal==='add' ? '➕ Add Team Member' : '✏️ Edit Team Member'}
              </h2>
              <button onClick={closeModal} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'#888', cursor:'pointer', fontSize:16, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              {/* Photo section */}
              <div style={{ marginBottom:24, textAlign:'center' }}>
                <div style={{ width:100, height:100, borderRadius:'50%', overflow:'hidden', margin:'0 auto 12px', background:'rgba(108,99,255,0.15)', border:'2px solid rgba(108,99,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {photoPreview
                    ? <img src={photoPreview} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <span style={{ fontSize:36, color:'rgba(108,99,255,0.5)' }}>👤</span>
                  }
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display:'none' }} />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding:'8px 18px', background:'rgba(108,99,255,0.1)', border:'1px solid rgba(108,99,255,0.25)', borderRadius:8, color:'#6c63ff', cursor:'pointer', fontSize:12, fontWeight:600 }}>
                  {uploading ? '⏳ Uploading…' : '📷 Upload Photo'}
                </button>
                <div style={{ marginTop:8 }}>
                  <input type="text" value={form.photo_url} onChange={set('photo_url')} onBlur={e => setPhotoPreview(e.target.value)} placeholder="Or paste image URL…" style={{ width:'100%', padding:'8px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, color:'#aaa', fontSize:12, outline:'none', boxSizing:'border-box', marginTop:6 }} />
                </div>
              </div>

              {/* Fields */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <MField label="Full Name *" value={form.name} onChange={set('name')} placeholder="John Doe" required />
                <MField label="Role / Title *" value={form.role} onChange={set('role')} placeholder="Senior Designer" required />
              </div>
              <MField label="Bio" value={form.bio} onChange={set('bio')} placeholder="Short description about this person…" textarea />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <MField label="LinkedIn URL" value={form.linkedin_url} onChange={set('linkedin_url')} placeholder="https://linkedin.com/in/…" />
                <MField label="Display Order (0 = first)" value={String(form.order_index)} onChange={set('order_index')} placeholder="0" type="number" />
              </div>

              {error && <div style={{ color:'#ff6b6b', fontSize:13, margin:'12px 0', padding:'10px 14px', background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:8 }}>❌ {error}</div>}
              {saved  && <div style={{ color:'#00e676', fontSize:13, margin:'12px 0', padding:'10px 14px', background:'rgba(0,230,118,0.08)', border:'1px solid rgba(0,230,118,0.2)', borderRadius:8 }}>✅ Saved!</div>}

              <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:20 }}>
                <button type="button" onClick={closeModal} style={{ padding:'11px 22px', background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:9, color:'#888', cursor:'pointer', fontSize:13, fontWeight:500 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding:'11px 28px', background:'linear-gradient(135deg,#6c63ff,#e040fb)', border:'none', borderRadius:9, color:'#fff', cursor:saving?'not-allowed':'pointer', fontSize:13, fontWeight:700, opacity:saving?0.7:1 }}>
                  {saving ? '💾 Saving…' : modal==='add' ? '➕ Add Member' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MField({ label, value, onChange, placeholder, textarea, type='text', required }) {
  const base = { width:'100%', padding:'10px 13px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:9, color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:'inherit', resize:'vertical', marginBottom:14 };
  return (
    <div>
      <label style={{ display:'block', color:'#777', fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:7 }}>
        {label}
      </label>
      {textarea
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3} style={base} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} style={base} />
      }
    </div>
  );
}
