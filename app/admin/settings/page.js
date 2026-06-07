'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

const SETTING_KEYS = [
  { key: 'site_name', label: 'Site Name', placeholder: 'CreativeMind IT Solutions', group: 'General' },
  { key: 'site_tagline', label: 'Tagline', placeholder: 'We Build Brands & Digital Futures', group: 'General' },
  { key: 'contact_email', label: 'Contact Email', placeholder: 'hello@creativemind.com', group: 'General' },
  { key: 'contact_phone', label: 'Contact Phone', placeholder: '+1 234 567 8900', group: 'General' },
  { key: 'contact_address', label: 'Address', placeholder: '123 Main St, City, Country', group: 'General' },
  { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...', group: 'Social' },
  { key: 'social_facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/...', group: 'Social' },
  { key: 'social_linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/...', group: 'Social' },
  { key: 'social_twitter', label: 'Twitter / X URL', placeholder: 'https://x.com/...', group: 'Social' },
  { key: 'social_youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/...', group: 'Social' },
  { key: 'ga_id', label: 'Google Analytics ID', placeholder: 'G-XXXXXXXXXX', group: 'Analytics' },
  { key: 'fb_pixel_id', label: 'Facebook Pixel ID', placeholder: '1234567890', group: 'Analytics' },
  { key: 'meta_description', label: 'Meta Description', placeholder: 'Your site description for SEO...', group: 'SEO' },
  { key: 'meta_keywords', label: 'Meta Keywords', placeholder: 'web development, design, branding', group: 'SEO' },
];

const GROUPS = [...new Set(SETTING_KEYS.map((s) => s.group))];

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeGroup, setActiveGroup] = useState('General');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/admin/login'); return; }
    fetchSettings();
  }, [user, authLoading]);

  async function fetchSettings() {
    const { data } = await supabase.from('site_settings').select('*');
    const map = {};
    (data || []).forEach((row) => { map[row.key] = row.value || ''; });
    setSettings(map);
    setLoading(false);
  }

  const setVal = (key) => (e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setSaved(false);
    const upserts = Object.entries(settings).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
    await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleLogout() { await logout(); router.push('/admin/login'); }

  if (loading) return <LoadingScreen />;

  const activeKeys = SETTING_KEYS.filter((sk) => sk.group === activeGroup);

  return (
    <div style={s.layout}>
      <AdminSidebar onLogout={handleLogout} userEmail={user?.email} userName={user?.displayName} userPhoto={user?.photoURL} />
      <main style={s.main}>
        <div style={s.topBar}>
          <div>
            <h1 style={s.title}>Settings</h1>
            <p style={s.sub}>Manage your site configuration</p>
          </div>
          {saved && (
            <div style={s.savedBadge}>✓ Saved successfully</div>
          )}
        </div>

        <div style={s.grid}>
          {/* Sidebar Nav */}
          <div style={s.settingsNav}>
            {GROUPS.map((g) => (
              <button key={g} onClick={() => setActiveGroup(g)}
                style={{ ...s.navItem, ...(activeGroup === g ? s.navItemActive : {}) }}>
                <span style={s.navIcon}>{groupIcon(g)}</span>
                {g}
              </button>
            ))}
            <div style={{ marginTop: 'auto', paddingTop: 16 }}>
              <div style={s.profileCard}>
                {user?.photoURL
                  ? <img src={user.photoURL} alt="avatar" style={s.profilePhoto} />
                  : <div style={s.profileAvatar}>{(user?.email || 'A')[0].toUpperCase()}</div>
                }
                <div>
                  <div style={s.profileName}>{user?.displayName || 'Admin'}</div>
                  <div style={s.profileEmail}>{user?.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSave} style={s.formArea}>
            <div style={s.formCard}>
              <div style={s.formCardHeader}>
                <span style={{ fontSize: 20 }}>{groupIcon(activeGroup)}</span>
                <h2 style={s.formCardTitle}>{activeGroup} Settings</h2>
              </div>

              <div style={s.fieldsGrid}>
                {activeKeys.map((sk) => (
                  <div key={sk.key} style={{ marginBottom: 18 }}>
                    <label style={s.label}>{sk.label}</label>
                    <input
                      value={settings[sk.key] || ''}
                      onChange={setVal(sk.key)}
                      placeholder={sk.placeholder}
                      style={s.input}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
                <button type="submit" disabled={saving} style={s.saveBtn}>
                  {saving ? 'Saving...' : '💾 Save Settings'}
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            {activeGroup === 'General' && (
              <div style={s.dangerCard}>
                <div style={s.dangerTitle}>⚠️ Danger Zone</div>
                <div style={s.dangerRow}>
                  <div>
                    <div style={s.dangerLabel}>Sign Out</div>
                    <div style={s.dangerDesc}>Sign out of your admin account</div>
                  </div>
                  <button type="button" onClick={handleLogout} style={s.dangerBtn}>Sign Out</button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

function groupIcon(g) {
  return { General: '🏢', Social: '🔗', Analytics: '📊', SEO: '🔍' }[g] || '⚙️';
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
  savedBadge: { padding: '8px 16px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8, color: '#10b981', fontSize: 13, fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'start' },
  settingsNav: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px', display: 'flex', flexDirection: 'column', gap: 2, minHeight: 400 },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: 13, fontWeight: 600, textAlign: 'left' },
  navItemActive: { background: 'rgba(108,99,255,0.12)', color: '#fff' },
  navIcon: { fontSize: 16 },
  profileCard: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' },
  profilePhoto: { width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' },
  profileAvatar: { width: 32, height: 32, background: 'linear-gradient(135deg,#6c63ff,#e040fb)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 },
  profileName: { color: '#ccc', fontSize: 11, fontWeight: 700 },
  profileEmail: { color: '#555', fontSize: 10 },
  formArea: { display: 'flex', flexDirection: 'column', gap: 16 },
  formCard: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '28px' },
  formCardHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' },
  formCardTitle: { color: '#fff', fontSize: 17, fontWeight: 700, margin: 0 },
  fieldsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' },
  label: { display: 'block', color: '#aaa', fontSize: 12, fontWeight: 500, marginBottom: 7 },
  input: { width: '100%', padding: '10px 13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  saveBtn: { padding: '11px 28px', background: 'linear-gradient(135deg,#6c63ff,#e040fb)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(108,99,255,0.3)' },
  dangerCard: { background: 'rgba(255,68,68,0.04)', border: '1px solid rgba(255,68,68,0.12)', borderRadius: 14, padding: '22px 28px' },
  dangerTitle: { color: '#ff6b6b', fontWeight: 700, fontSize: 14, marginBottom: 16 },
  dangerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  dangerLabel: { color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 3 },
  dangerDesc: { color: '#666', fontSize: 12 },
  dangerBtn: { padding: '8px 18px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 8, color: '#ff6b6b', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
};
