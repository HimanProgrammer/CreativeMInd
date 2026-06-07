'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['General', 'Design', 'Development', 'Marketing', 'Branding', 'Tips & Tricks'];
const EMPTY = { title: '', slug: '', excerpt: '', content: '', category: 'General', status: 'draft', cover_url: '', author: '' };

export default function BlogPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'editor'
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/admin/login'); return; }
    fetchPosts();
  }, [user, authLoading]);

  async function fetchPosts() {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }

  function openNew() {
    setForm({ ...EMPTY, author: user?.displayName || user?.email || '' });
    setEditId(null); setError(''); setView('editor');
  }

  function openEdit(post) {
    setForm({ ...post });
    setEditId(post.id); setError(''); setView('editor');
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function genSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  async function handleSave(status) {
    if (!form.title) { setError('Title is required.'); return; }
    setSaving(true); setError('');
    const payload = {
      ...form,
      slug: form.slug || genSlug(form.title),
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
    };
    let err;
    if (editId) {
      const { id, created_at, ...rest } = payload;
      ({ error: err } = await supabase.from('blog_posts').update(rest).eq('id', editId));
    } else {
      ({ error: err } = await supabase.from('blog_posts').insert([payload]));
    }
    if (err) { setError(err.message); setSaving(false); return; }
    await fetchPosts();
    setSaving(false);
    setView('list');
  }

  async function handleDelete(id) {
    if (!confirm('Delete this post?')) return;
    setDeleting(id);
    await supabase.from('blog_posts').delete().eq('id', id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  }

  async function handleLogout() { await logout(); router.push('/admin/login'); }

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.status === filter);

  if (loading) return <LoadingScreen />;

  if (view === 'editor') {
    return (
      <div style={s.layout}>
        <AdminSidebar onLogout={handleLogout} userEmail={user?.email} userName={user?.displayName} userPhoto={user?.photoURL} />
        <main style={s.main}>
          <div style={s.topBar}>
            <div>
              <h1 style={s.title}>{editId ? 'Edit Post' : 'New Blog Post'}</h1>
            </div>
            <button onClick={() => setView('list')} style={s.backBtn}>← Back to Posts</button>
          </div>

          <div style={s.editorGrid}>
            <div style={s.editorMain}>
              <div style={{ marginBottom: 16 }}>
                <input value={form.title} onChange={(e) => { set('title')(e); if (!editId) setForm((f) => ({ ...f, slug: genSlug(e.target.value) })); }}
                  placeholder="Post title..." style={s.titleInput} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={s.label}>Excerpt</label>
                <textarea value={form.excerpt} onChange={set('excerpt')} placeholder="Brief summary of the post..." rows={2} style={s.textarea} />
              </div>
              <div>
                <label style={s.label}>Content (Markdown / HTML)</label>
                <textarea value={form.content} onChange={set('content')} placeholder="Write your post content here..." rows={18} style={{ ...s.textarea, fontFamily: 'monospace', fontSize: 13 }} />
              </div>
            </div>

            <div style={s.editorSide}>
              <div style={s.sideCard}>
                <div style={s.sideTitle}>Publish</div>
                {error && <p style={s.error}>{error}</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button onClick={() => handleSave('draft')} disabled={saving} style={s.draftBtn}>
                    {saving ? 'Saving...' : 'Save as Draft'}
                  </button>
                  <button onClick={() => handleSave('published')} disabled={saving} style={s.publishBtn}>
                    {saving ? 'Publishing...' : '🚀 Publish Now'}
                  </button>
                </div>
              </div>

              <div style={s.sideCard}>
                <div style={s.sideTitle}>Settings</div>
                <div style={{ marginBottom: 12 }}>
                  <label style={s.label}>Category</label>
                  <select value={form.category} onChange={set('category')} style={s.select}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={s.label}>Author</label>
                  <input value={form.author} onChange={set('author')} placeholder="Author name" style={s.input} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={s.label}>Slug</label>
                  <input value={form.slug} onChange={set('slug')} placeholder="url-slug" style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Cover Image URL</label>
                  <input value={form.cover_url} onChange={set('cover_url')} placeholder="https://..." style={s.input} />
                  {form.cover_url && <img src={form.cover_url} alt="cover" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={s.layout}>
      <AdminSidebar onLogout={handleLogout} userEmail={user?.email} userName={user?.displayName} userPhoto={user?.photoURL} />
      <main style={s.main}>
        <div style={s.topBar}>
          <div>
            <h1 style={s.title}>Blog Posts</h1>
            <p style={s.sub}>{posts.length} posts · {posts.filter((p) => p.status === 'published').length} published</p>
          </div>
          <button onClick={openNew} style={s.addBtn}>+ New Post</button>
        </div>

        <div style={s.filters}>
          {['all', 'published', 'draft'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={filter === f ? { ...s.filterBtn, ...s.filterActive } : s.filterBtn}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span style={s.count}>{f === 'all' ? posts.length : posts.filter((p) => p.status === f).length}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
            <p style={{ color: '#555', marginBottom: 20 }}>No posts yet.</p>
            <button onClick={openNew} style={s.addBtn}>Write First Post</button>
          </div>
        ) : (
          <div style={s.postList}>
            {filtered.map((post) => (
              <div key={post.id} style={s.postRow}>
                {post.cover_url && (
                  <img src={post.cover_url} alt={post.title} style={s.postThumb} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={s.postTitle}>{post.title}</div>
                  <div style={s.postMeta}>
                    <span style={{ ...s.statusBadge, ...(post.status === 'published' ? s.statusPublished : s.statusDraft) }}>
                      {post.status}
                    </span>
                    <span style={s.metaDot}>·</span>
                    <span style={s.metaText}>{post.category}</span>
                    <span style={s.metaDot}>·</span>
                    <span style={s.metaText}>{post.author || 'Unknown'}</span>
                    <span style={s.metaDot}>·</span>
                    <span style={s.metaText} suppressHydrationWarning>{post.created_at ? new Date(post.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
                  </div>
                  {post.excerpt && <p style={s.postExcerpt}>{post.excerpt.slice(0, 100)}...</p>}
                </div>
                <div style={s.postActions}>
                  <button onClick={() => openEdit(post)} style={s.editBtn}>Edit</button>
                  <button onClick={() => handleDelete(post.id)} disabled={deleting === post.id} style={s.deleteBtn}>
                    {deleting === post.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
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
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' },
  sub: { color: '#555', fontSize: 13, margin: 0 },
  addBtn: { padding: '10px 22px', background: 'linear-gradient(135deg,#6c63ff,#e040fb)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  backBtn: { padding: '8px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, color: '#888', cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  filters: { display: 'flex', gap: 8, marginBottom: 24 },
  filterBtn: { padding: '7px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, color: '#666', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 },
  filterActive: { background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#fff' },
  count: { background: 'rgba(255,255,255,0.08)', color: '#888', fontSize: 10, padding: '1px 6px', borderRadius: 10 },
  empty: { textAlign: 'center', padding: '80px 0' },
  postList: { display: 'flex', flexDirection: 'column', gap: 2 },
  postRow: { display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, marginBottom: 8 },
  postThumb: { width: 72, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 },
  postTitle: { color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 6 },
  postMeta: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 },
  statusBadge: { fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 },
  statusPublished: { background: 'rgba(16,185,129,0.15)', color: '#10b981' },
  statusDraft: { background: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  metaDot: { color: '#333', fontSize: 12 },
  metaText: { color: '#555', fontSize: 12 },
  postExcerpt: { color: '#555', fontSize: 12, margin: 0 },
  postActions: { display: 'flex', gap: 8, flexShrink: 0 },
  editBtn: { padding: '7px 14px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 8, color: '#6c63ff', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  deleteBtn: { padding: '7px 14px', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', borderRadius: 8, color: '#ff6b6b', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  editorGrid: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' },
  editorMain: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '24px' },
  titleInput: { width: '100%', padding: '12px 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 22, fontWeight: 700, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  label: { display: 'block', color: '#aaa', fontSize: 12, fontWeight: 500, marginBottom: 6 },
  textarea: { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#ccc', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.7, resize: 'vertical' },
  sideCard: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px', marginBottom: 16 },
  sideTitle: { color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 16 },
  draftBtn: { padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#aaa', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  publishBtn: { padding: '10px', background: 'linear-gradient(135deg,#6c63ff,#e040fb)', border: 'none', borderRadius: 9, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 },
  select: { width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  input: { width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  error: { color: '#ff6b6b', fontSize: 12, padding: '7px 10px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 7, marginBottom: 10 },
};
