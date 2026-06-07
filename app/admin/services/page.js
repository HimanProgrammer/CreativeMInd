'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

const ICONS = ['💻', '📱', '🎨', '🚀', '📊', '🔒', '🌐', '⚙️', '✉️', '📸', '🎬', '📝'];
const COLORS = ['#6c63ff', '#e040fb', '#00bfa5', '#f05a28', '#0ea5e9', '#f59e0b', '#10b981', '#ec4899'];
const EMPTY = { title: '', description: '', icon: '💻', color: '#6c63ff', order_index: 0 };

export default function ServicesPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/admin/login'); return; }
    fetchServices();
  }, [user, authLoading]);

  async function fetchServices() {
    const { data } = await supabase.from('services').select('*').order('order_index');
    setServices(data || []);
    setLoading(false);
  }

  function openAdd() { setForm(EMPTY); setError(''); setModal('add'); }
  function openEdit(s) { setForm({ ...s }); setError(''); setModal('edit'); }
  function closeModal() { setModal(null); setError(''); }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: typeof e === 'string' ? e : e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title) { setError('Title is required.'); return; }
    setSaving(true); setError('');
    if (modal === 'add') {
      const { error } = await supabase.from('services').insert([form]);
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const { id, ...rest } = form;
      const { error } = await supabase.from('services').update(rest).eq('id', id);
      if (error) { setError(error.message); setSaving(false); return; }
    }
    await fetchServices();
    setSaving(false); closeModal();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this service?')) return;
    setDeleting(id);
    await supabase.from('services').delete().eq('id', id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
  }

  async function handleLogout() { await logout(); router.push('/admin/login'); }

  if (loading) return <LoadingScreen />;

  return (
    <div style={s.layout}>
      <AdminSidebar onLogout={handleLogout} userEmail={user?.email} userName={user?.displayName} userPhoto={user?.photoURL} />
      <main style={s.main}>
        <div style={s.topBar}>
          <div>
            <h1 style={s.title}>Services</h1>
            <p style={s.sub}>{services.length} services listed</p>
          </div>
          <button onClick={openAdd} style={s.addBtn}>+ Add Service</button>
        </div>

        {services.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚙️</div>
            <p style={{ color: '#555', marginBottom: 20 }}>No services yet.</p>
            <button onClick={openAdd} style={s.addBtn}>Add First Service</button>
          </div>
        ) : (
          <div style={s.grid}>
            {services.map((svc) => (
              <div key={svc.id} style={s.card}>
                <div style={{ ...s.iconBox, background: `${svc.color}18`, border: `1px solid ${svc.color}30` }}>
                  <span style={{ fontSize: 28 }}>{svc.icon}</span>
                </div>
                <div style={s.cardBody}>
                  <div style={s.cardTitle}>{svc.title}</div>
                  <p style={s.cardDesc}>{svc.description?.slice(0, 100)}{svc.description?.length > 100 ? '...' : ''}</p>
                </div>
                <div style={s.orderBadge}>#{svc.order_index + 1}</div>
                <div style={s.cardActions}>
                  <button onClick={() => openEdit(svc)} style={s.editBtn}>Edit</button>
                  <button onClick={() => handleDelete(svc.id)} disabled={deleting === svc.id} style={s.deleteBtn}>
                    {deleting === svc.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modal && (
        <div style={s.overlay} onClick={closeModal}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{modal === 'add' ? 'Add Service' : 'Edit Service'}</h2>
              <button onClick={closeModal} style={s.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: 14 }}>
                <label style={s.label}>Title *</label>
                <input value={form.title} onChange={set('title')} placeholder="Web Development" style={s.input} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={s.label}>Description</label>
                <textarea value={form.description} onChange={set('description')} placeholder="Describe this service..." rows={3} style={{ ...s.input, resize: 'vertical' }} />
              </div>

              {/* Icon Picker */}
              <div style={{ marginBottom: 14 }}>
                <label style={s.label}>Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {ICONS.map((ic) => (
                    <button key={ic} type="button" onClick={() => setForm((f) => ({ ...f, icon: ic }))}
                      style={{ width: 40, height: 40, fontSize: 20, borderRadius: 8, cursor: 'pointer', background: form.icon === ic ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.04)', border: form.icon === ic ? '1px solid #6c63ff' : '1px solid rgba(255,255,255,0.08)' }}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div style={{ marginBottom: 14 }}>
                <label style={s.label}>Accent Color</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => setForm((f) => ({ ...f, color: c }))}
                      style={{ width: 32, height: 32, borderRadius: 8, cursor: 'pointer', background: c, border: form.color === c ? '2px solid #fff' : '2px solid transparent' }} />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={s.label}>Order Index</label>
                <input type="number" value={form.order_index} onChange={set('order_index')} style={s.input} />
              </div>

              {error && <p style={s.error}>{error}</p>}
              <div style={s.modalActions}>
                <button type="button" onClick={closeModal} style={s.cancelBtn}>Cancel</button>
                <button type="submit" disabled={saving} style={s.saveBtn}>
                  {saving ? 'Saving...' : modal === 'add' ? 'Add Service' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a18' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(108,99,255,0.2)', borderTopColor: '#6c63ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const s = {
  layout: { display: 'flex', minHeight: '100vh', background: '#0a0a18', fontFamily: 'Inter, system-ui, sans-serif' },
  main: { marginLeft: 250, flex: 1, padding: '32px 36px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  title: { color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' },
  sub: { color: '#555', fontSize: 13, margin: 0 },
  addBtn: { padding: '10px 22px', background: 'linear-gradient(135deg,#6c63ff,#e040fb)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '80px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px', position: 'relative' },
  iconBox: { width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  cardBody: { marginBottom: 16 },
  cardTitle: { color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 6 },
  cardDesc: { color: '#666', fontSize: 13, lineHeight: 1.6, margin: 0 },
  orderBadge: { position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.06)', color: '#555', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 },
  cardActions: { display: 'flex', gap: 8, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14 },
  editBtn: { flex: 1, padding: '8px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 8, color: '#6c63ff', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  deleteBtn: { flex: 1, padding: '8px', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', borderRadius: 8, color: '#ff6b6b', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
  modal: { background: '#13131f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '32px', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 800, margin: 0 },
  closeBtn: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 18, padding: 4 },
  label: { display: 'block', color: '#aaa', fontSize: 12, fontWeight: 500, marginBottom: 6 },
  input: { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  error: { color: '#ff6b6b', fontSize: 13, marginBottom: 14, padding: '8px 12px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 8 },
  modalActions: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 },
  cancelBtn: { padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#888', cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  saveBtn: { padding: '10px 24px', background: 'linear-gradient(135deg,#6c63ff,#e040fb)', border: 'none', borderRadius: 9, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 },
};
