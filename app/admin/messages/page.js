'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/admin/login'); return; }
    fetchMessages();
  }, [user, authLoading]);

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  async function markRead(id, is_read) {
    await supabase.from('messages').update({ is_read: !is_read }).eq('id', id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: !is_read } : m));
  }

  async function handleDelete(id) {
    if (!confirm('Delete this message?')) return;
    setDeleting(id);
    await supabase.from('messages').delete().eq('id', id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleting(null);
  }

  async function handleLogout() { await logout(); router.push('/admin/login'); }

  const filtered = filter === 'all' ? messages
    : filter === 'unread' ? messages.filter((m) => !m.is_read)
    : messages.filter((m) => m.is_read);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (loading) return <LoadingScreen />;

  return (
    <div style={s.layout}>
      <AdminSidebar onLogout={handleLogout} userEmail={user?.email} userName={user?.displayName} userPhoto={user?.photoURL} />
      <main style={s.main}>
        <div style={s.topBar}>
          <div>
            <h1 style={s.title}>Messages</h1>
            <p style={s.sub}>{unreadCount} unread · {messages.length} total</p>
          </div>
        </div>

        {/* Filters */}
        <div style={s.filters}>
          {['all', 'unread', 'read'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={filter === f ? { ...s.filterBtn, ...s.filterActive } : s.filterBtn}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'unread' && unreadCount > 0 && (
                <span style={s.badge}>{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        <div style={s.grid}>
          {/* Message List */}
          <div style={s.list}>
            {filtered.length === 0 ? (
              <div style={s.empty}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✉️</div>
                <p style={{ color: '#555' }}>No messages found.</p>
              </div>
            ) : filtered.map((msg) => (
              <div key={msg.id} onClick={() => { setSelected(msg); markRead(msg.id, true); }}
                style={{ ...s.msgCard, ...(selected?.id === msg.id ? s.msgCardActive : {}), opacity: msg.is_read ? 0.7 : 1 }}>
                <div style={s.msgAvatar}>{(msg.name || 'A')[0].toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={s.msgName}>
                    {msg.name || 'Unknown'}
                    {!msg.is_read && <span style={s.unreadDot} />}
                  </div>
                  <div style={s.msgSubject}>{msg.subject || 'No subject'}</div>
                  <div style={s.msgPreview}>{(msg.message || '').slice(0, 60)}...</div>
                </div>
                <div style={s.msgTime}>{formatDate(msg.created_at)}</div>
              </div>
            ))}
          </div>

          {/* Message Detail */}
          <div style={s.detail}>
            {selected ? (
              <>
                <div style={s.detailHeader}>
                  <div style={s.detailAvatar}>{(selected.name || 'A')[0].toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{selected.name}</div>
                    <div style={{ color: '#666', fontSize: 13 }}>{selected.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => markRead(selected.id, selected.is_read)}
                      style={{ ...s.actionBtn, background: 'rgba(108,99,255,0.12)', color: '#6c63ff', border: '1px solid rgba(108,99,255,0.2)' }}>
                      {selected.is_read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button onClick={() => handleDelete(selected.id)} disabled={deleting === selected.id}
                      style={{ ...s.actionBtn, background: 'rgba(255,68,68,0.1)', color: '#ff6b6b', border: '1px solid rgba(255,68,68,0.2)' }}>
                      {deleting === selected.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
                <div style={s.detailSubject}>{selected.subject || 'No subject'}</div>
                <div style={s.detailDate}>{new Date(selected.created_at).toLocaleString()}</div>
                <div style={s.detailBody}>{selected.message}</div>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || ''}`}
                  style={s.replyBtn}>
                  ✉ Reply via Email
                </a>
              </>
            ) : (
              <div style={s.empty}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👆</div>
                <p style={{ color: '#555' }}>Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
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
  main: { marginLeft: 250, flex: 1, padding: '32px 36px', minHeight: '100vh' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  title: { color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' },
  sub: { color: '#555', fontSize: 13, margin: 0 },
  filters: { display: 'flex', gap: 8, marginBottom: 24 },
  filterBtn: { padding: '7px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, color: '#666', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 },
  filterActive: { background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#fff' },
  badge: { background: 'linear-gradient(135deg,#6c63ff,#e040fb)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 },
  grid: { display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, minHeight: 500 },
  list: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' },
  msgCard: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.15s' },
  msgCardActive: { background: 'rgba(108,99,255,0.08)' },
  msgAvatar: { width: 36, height: 36, flexShrink: 0, background: 'linear-gradient(135deg,#6c63ff,#e040fb)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 },
  msgName: { color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 },
  unreadDot: { display: 'inline-block', width: 7, height: 7, background: '#6c63ff', borderRadius: '50%' },
  msgSubject: { color: '#aaa', fontSize: 12, marginBottom: 3, fontWeight: 500 },
  msgPreview: { color: '#555', fontSize: 11 },
  msgTime: { color: '#444', fontSize: 11, flexShrink: 0 },
  detail: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '28px' },
  detailHeader: { display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' },
  detailAvatar: { width: 48, height: 48, flexShrink: 0, background: 'linear-gradient(135deg,#6c63ff,#e040fb)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 },
  detailSubject: { color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 6 },
  detailDate: { color: '#555', fontSize: 12, marginBottom: 20 },
  detailBody: { color: '#ccc', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: 24 },
  actionBtn: { padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  replyBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'linear-gradient(135deg,#6c63ff,#e040fb)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 },
  empty: { padding: '60px 20px', textAlign: 'center' },
};
