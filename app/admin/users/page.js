'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/lib/authContext';

const ROLES = ['Admin', 'Editor', 'Viewer'];
const EMPTY = { email: '', password: '', displayName: '', role: 'Editor' };

export default function UsersPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [meUid, setMeUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [busyUid, setBusyUid] = useState(null);

  // Always send a FRESH Firebase ID token — the API verifies it server-side.
  const authedFetch = useCallback(async (url, opts = {}) => {
    if (!user?.getIdToken) throw new Error('Sign in with a real Firebase account to manage users.');
    const token = await user.getIdToken();
    return fetch(url, {
      ...opts,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
    });
  }, [user]);

  const load = useCallback(async () => {
    setLoading(true); setError(''); setSetupNeeded(false);
    try {
      const res = await authedFetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 503) setSetupNeeded(true);
        setError(data.error || 'Could not load users.');
        setUsers([]);
      } else {
        setUsers(data.users || []);
        setMeUid(data.me || null);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [authedFetch]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/admin/login'); return; }
    load();
  }, [user, authLoading, load, router]);

  async function handleCreate() {
    if (!form.email || !form.password) { setError('Email and password are required.'); return; }
    setSaving(true); setError('');
    try {
      const res = await authedFetch('/api/admin/users', { method: 'POST', body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Could not create user.');
      else { setUsers((p) => [data.user, ...p]); setShowNew(false); setForm(EMPTY); }
    } catch (e) { setError(e.message); }
    setSaving(false);
  }

  async function patch(uid, body, label) {
    setBusyUid(uid); setError('');
    try {
      const res = await authedFetch(`/api/admin/users/${uid}`, { method: 'PATCH', body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) setError(data.error || `Could not ${label}.`);
      else setUsers((p) => p.map((u) => (u.uid === uid ? { ...u, ...data.user } : u)));
    } catch (e) { setError(e.message); }
    setBusyUid(null);
  }

  async function handleDelete(u) {
    if (!confirm(`Permanently delete ${u.email}? This cannot be undone.`)) return;
    setBusyUid(u.uid); setError('');
    try {
      const res = await authedFetch(`/api/admin/users/${u.uid}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Could not delete user.');
      else setUsers((p) => p.filter((x) => x.uid !== u.uid));
    } catch (e) { setError(e.message); }
    setBusyUid(null);
  }

  async function handleSaveEdit() {
    if (!editUser) return;
    await patch(editUser.uid, {
      displayName: editUser.displayName,
      role: editUser.role,
      ...(editUser.newPassword ? { password: editUser.newPassword } : {}),
    }, 'save changes');
    setEditUser(null);
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.email.toLowerCase().includes(q) || (u.displayName || '').toLowerCase().includes(q);
  });

  const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

  return (
    <div style={s.layout}>
      <AdminSidebar onLogout={async () => { await logout(); router.push('/admin/login'); }}
        userEmail={user?.email} userName={user?.displayName} userPhoto={user?.photoURL} />

      <main style={s.main}>
        <div style={s.topBar}>
          <div>
            <h1 style={s.title}>User Management</h1>
            <p style={s.sub}>
              {loading ? 'Loading…' : `${users.length} account${users.length === 1 ? '' : 's'}`}
              {users.filter((u) => u.disabled).length > 0 && ` · ${users.filter((u) => u.disabled).length} disabled`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…" style={s.search} />
            <button onClick={() => { setShowNew(true); setForm(EMPTY); setError(''); }} style={s.addBtn}>
              + New User
            </button>
          </div>
        </div>

        {setupNeeded && (
          <div style={s.setupBox}>
            <h3 style={{ color: '#fff', margin: '0 0 10px', fontSize: 16 }}>⚙️ One-time setup required</h3>
            <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.7, margin: '0 0 12px' }}>
              This panel manages your real Firebase Auth accounts, which needs a service-account key
              on the server. In <strong>Firebase Console → Project Settings → Service accounts</strong>,
              click <strong>Generate new private key</strong>, then add the downloaded JSON to
              <code style={s.code}>.env.local</code> as a single line:
            </p>
            <pre style={s.pre}>{`FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...", ... }
ADMIN_EMAILS=${user?.email || 'you@example.com'}`}</pre>
            <p style={{ color: '#666', fontSize: 12, margin: '10px 0 0', lineHeight: 1.7 }}>
              No <code style={s.code}>NEXT_PUBLIC_</code> prefix — this key must stay secret and never
              reach the browser. <code style={s.code}>ADMIN_EMAILS</code> is a comma-separated
              allowlist that bootstraps the first admin. Restart the dev server afterwards, and add the
              same two variables in Vercel for production.
            </p>
          </div>
        )}

        {error && !setupNeeded && <p style={s.error}>{error}</p>}

        {!loading && !setupNeeded && filtered.length === 0 && (
          <div style={s.empty}>
            <div style={{ fontSize: 46, marginBottom: 10 }}>👥</div>
            <p style={{ color: '#555' }}>{search ? 'No users match that search.' : 'No users yet.'}</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div style={s.table}>
            <div style={s.thead}>
              <span style={{ flex: 2 }}>User</span>
              <span style={{ width: 110 }}>Role</span>
              <span style={{ width: 90 }}>Status</span>
              <span style={{ width: 110 }}>Created</span>
              <span style={{ width: 110 }}>Last sign-in</span>
              <span style={{ width: 210, textAlign: 'right' }}>Actions</span>
            </div>

            {filtered.map((u) => (
              <div key={u.uid} style={{ ...s.row, opacity: busyUid === u.uid ? 0.5 : 1 }}>
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  {u.photoURL
                    ? <img src={u.photoURL} alt="" style={s.avatarImg} />
                    : <div style={s.avatar}>{(u.displayName || u.email || '?')[0].toUpperCase()}</div>}
                  <div style={{ minWidth: 0 }}>
                    <div style={s.name}>
                      {u.displayName || '—'}
                      {u.uid === meUid && <span style={s.youPill}>you</span>}
                    </div>
                    <div style={s.email}>{u.email}</div>
                  </div>
                </div>

                <span style={{ width: 110 }}>
                  <span style={{ ...s.rolePill, ...(u.role === 'Admin' ? s.roleAdmin : {}) }}>{u.role}</span>
                </span>

                <span style={{ width: 90 }}>
                  <span style={{ ...s.statusPill, ...(u.disabled ? s.statusOff : s.statusOn) }}>
                    {u.disabled ? 'Disabled' : 'Active'}
                  </span>
                </span>

                <span style={{ width: 110, ...s.meta }} suppressHydrationWarning>{fmt(u.createdAt)}</span>
                <span style={{ width: 110, ...s.meta }} suppressHydrationWarning>{fmt(u.lastSignIn)}</span>

                <span style={{ width: 210, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <button onClick={() => setEditUser({ ...u, newPassword: '' })} style={s.editBtn}>Edit</button>
                  <button
                    onClick={() => patch(u.uid, { disabled: !u.disabled }, 'update status')}
                    disabled={u.uid === meUid}
                    title={u.uid === meUid ? 'You cannot disable your own account' : ''}
                    style={{ ...s.toggleBtn, opacity: u.uid === meUid ? 0.35 : 1 }}
                  >
                    {u.disabled ? 'Enable' : 'Disable'}
                  </button>
                  <button
                    onClick={() => handleDelete(u)}
                    disabled={u.uid === meUid}
                    title={u.uid === meUid ? 'You cannot delete your own account' : ''}
                    style={{ ...s.delBtn, opacity: u.uid === meUid ? 0.35 : 1 }}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New user modal */}
      {showNew && (
        <div style={s.modalBg} onClick={() => setShowNew(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#fff', margin: '0 0 20px' }}>New User</h3>
            {error && <p style={s.error}>{error}</p>}
            <label style={s.label}>Email *</label>
            <input style={s.input} type="email" value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="user@example.com" />
            <label style={s.label}>Password * <span style={s.hint}>(min 6 characters)</span></label>
            <input style={s.input} type="text" value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Temporary password" />
            <label style={s.label}>Display name</label>
            <input style={s.input} value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))} placeholder="Full name" />
            <label style={s.label}>Role</label>
            <select style={s.input} value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button onClick={handleCreate} disabled={saving} style={{ ...s.addBtn, flex: 1 }}>
                {saving ? 'Creating…' : 'Create User'}
              </button>
              <button onClick={() => setShowNew(false)} style={{ ...s.ghostBtn, flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit user modal */}
      {editUser && (
        <div style={s.modalBg} onClick={() => setEditUser(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#fff', margin: '0 0 6px' }}>Edit User</h3>
            <p style={{ color: '#666', fontSize: 13, margin: '0 0 20px' }}>{editUser.email}</p>
            {error && <p style={s.error}>{error}</p>}
            <label style={s.label}>Display name</label>
            <input style={s.input} value={editUser.displayName || ''}
              onChange={(e) => setEditUser((p) => ({ ...p, displayName: e.target.value }))} />
            <label style={s.label}>Role</label>
            <select style={s.input} value={editUser.role}
              onChange={(e) => setEditUser((p) => ({ ...p, role: e.target.value }))}
              disabled={editUser.uid === meUid}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {editUser.uid === meUid && <p style={s.hintLine}>You cannot change your own role.</p>}
            <label style={s.label}>Reset password <span style={s.hint}>(leave blank to keep)</span></label>
            <input style={s.input} type="text" value={editUser.newPassword || ''}
              onChange={(e) => setEditUser((p) => ({ ...p, newPassword: e.target.value }))}
              placeholder="New password" />
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button onClick={handleSaveEdit} style={{ ...s.addBtn, flex: 1 }}>Save Changes</button>
              <button onClick={() => setEditUser(null)} style={{ ...s.ghostBtn, flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  layout: { display: 'flex', minHeight: '100vh', background: '#0a0a18', fontFamily: 'Inter, system-ui, sans-serif' },
  main: { marginLeft: 250, flex: 1, padding: '32px 36px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' },
  title: { color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' },
  sub: { color: '#555', fontSize: 13, margin: 0 },
  search: { padding: '10px 14px', background: '#0d0d1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', minWidth: 220 },
  addBtn: { padding: '10px 22px', background: 'linear-gradient(135deg,#6c63ff,#e040fb)', border: 'none', borderRadius: 9, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  ghostBtn: { padding: '10px 22px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#aaa', fontSize: 13, fontWeight: 600, cursor: 'pointer' },

  table: { border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' },
  thead: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: 'rgba(255,255,255,0.03)', color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' },
  row: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.05)', transition: 'opacity .2s' },
  avatar: { width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#6c63ff,#e040fb)', color: '#fff', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarImg: { width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
  name: { color: '#fff', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 },
  email: { color: '#666', fontSize: 12, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  youPill: { fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: 'rgba(108,99,255,0.2)', color: '#a5b4fc' },
  rolePill: { fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: '#999' },
  roleAdmin: { background: 'rgba(224,64,251,0.15)', color: '#e879f9' },
  statusPill: { fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 },
  statusOn: { background: 'rgba(16,185,129,0.15)', color: '#10b981' },
  statusOff: { background: 'rgba(255,107,107,0.13)', color: '#ff6b6b' },
  meta: { color: '#555', fontSize: 12 },
  editBtn: { padding: '6px 12px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 7, color: '#6c63ff', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  toggleBtn: { padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#aaa', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  delBtn: { padding: '6px 12px', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', borderRadius: 7, color: '#ff6b6b', cursor: 'pointer', fontSize: 12, fontWeight: 600 },

  empty: { textAlign: 'center', padding: '70px 0' },
  error: { color: '#ff6b6b', fontSize: 13, padding: '10px 14px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 8, marginBottom: 16 },
  setupBox: { background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 12, padding: '22px 24px', marginBottom: 20 },
  pre: { background: '#07070f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '12px 14px', color: '#9ad1a5', fontSize: 11.5, overflowX: 'auto', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' },
  code: { background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4, color: '#c4b5fd', fontSize: 11.5 },

  modalBg: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 },
  modal: { background: '#12121f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 28, width: '100%', maxWidth: 440, maxHeight: '90vh', overflowY: 'auto' },
  label: { display: 'block', color: '#aaa', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' },
  hint: { color: '#555', fontWeight: 400, textTransform: 'none', fontSize: 11 },
  hintLine: { color: '#666', fontSize: 11.5, margin: '-10px 0 14px' },
  input: { width: '100%', padding: '10px 14px', background: '#0d0d1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 16, fontFamily: 'inherit' },
};
