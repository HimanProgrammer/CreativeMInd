'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AnalyticsPanel from '@/components/admin/AnalyticsPanel';

const STAT_CARDS = (stats) => [
  {
    label: 'Total Images',
    value: stats.images,
    icon: '🖼️',
    gradient: 'linear-gradient(135deg, #6c63ff, #4f46e5)',
    glow: 'rgba(108,99,255,0.35)',
    change: '+12%',
    trend: 'up',
  },
  {
    label: 'Videos',
    value: stats.videos,
    icon: '🎬',
    gradient: 'linear-gradient(135deg, #f05a28, #ff8c42)',
    glow: 'rgba(240,90,40,0.3)',
    change: 'YouTube',
    trend: 'up',
  },
  {
    label: 'Categories',
    value: stats.categories,
    icon: '📂',
    gradient: 'linear-gradient(135deg, #e040fb, #9c27b0)',
    glow: 'rgba(224,64,251,0.3)',
    change: '+3',
    trend: 'up',
  },
  {
    label: 'Messages',
    value: stats.messages,
    icon: '✉️',
    gradient: 'linear-gradient(135deg, #00bfa5, #00897b)',
    glow: 'rgba(0,191,165,0.3)',
    change: 'Unread',
    trend: 'alert',
  },
];

const QUICK_ACTIONS = [
  { label: 'Upload Image/Video', icon: '⬆', href: '/admin/portfolio/upload', color: '#6c63ff' },
  { label: 'New Blog Post', icon: '📝', href: '/admin/blog', color: '#e040fb' },
  { label: 'View Portfolio', icon: '🖼️', href: '/admin/portfolio', color: '#00bfa5' },
  { label: 'View Messages', icon: '✉', href: '/admin/messages', color: '#f05a28' },
  { label: 'Manage Team', icon: '👥', href: '/admin/team', color: '#0ea5e9' },
  { label: 'Settings', icon: '⚙', href: '/admin/settings', color: '#f59e0b' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, logout } = useAuth();
  const [stats, setStats] = useState({ images: 0, categories: 0, team: 0, messages: 0 });
  const [recentImages, setRecentImages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) { router.push('/admin/login'); return; }

    async function load() {
      setUser(authUser);

      const { data: items } = await supabase
        .from('portfolio_items').select('*')
        .order('created_at', { ascending: false }).limit(6);

      const { count } = await supabase
        .from('portfolio_items').select('*', { count: 'exact', head: true });

      const { data: cats } = await supabase
        .from('portfolio_items').select('category');

      const uniqueCats = new Set((cats || []).map((c) => c.category)).size;

      const { count: videoCount } = await supabase
        .from('portfolio_items')
        .select('*', { count: 'exact', head: true })
        .not('video_url', 'is', null)
        .neq('video_url', '');

      setRecentImages(items || []);
      setStats({ images: count || 0, categories: uniqueCats, videos: videoCount || 0, messages: 3 });
      setLoading(false);
    }
    load();
  }, [authUser, authLoading]);

  async function handleLogout() {
    await logout();
    router.push('/admin/login');
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d1a' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, border: '3px solid rgba(108,99,255,0.2)',
          borderTopColor: '#6c63ff', borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: '#555', fontSize: 14 }}>Loading dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a18', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <AdminSidebar
        onLogout={handleLogout}
        userEmail={user?.email}
        userName={user?.displayName}
        userPhoto={user?.photoURL}
      />

      <main style={{ marginLeft: 250, flex: 1, padding: '32px 36px', overflowX: 'hidden' }}>

        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Dashboard
            </h1>
            <p style={{ color: '#555', fontSize: 13, margin: 0 }}>
              Welcome back, <span style={{ color: '#6c63ff', fontWeight: 600 }}>{user?.email}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              padding: '8px 14px', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, color: '#555', fontSize: 12,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ color: '#10b981', fontSize: 8 }}>●</span>
              <span suppressHydrationWarning>{typeof window !== 'undefined' ? new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) : ''}</span>
            </div>
            <Link href="/admin/portfolio/upload" style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #6c63ff, #e040fb)',
              borderRadius: 9, color: '#fff', textDecoration: 'none',
              fontSize: 13, fontWeight: 700,
              boxShadow: '0 4px 20px rgba(108,99,255,0.35)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span>+</span> Upload Images
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20, marginBottom: 32,
        }}>
          {STAT_CARDS(stats).map((s) => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '22px 24px',
              position: 'relative', overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}>
              {/* Glow */}
              <div style={{
                position: 'absolute', top: -30, right: -30,
                width: 120, height: 120,
                background: s.glow, borderRadius: '50%', filter: 'blur(40px)',
                opacity: 0.5, pointerEvents: 'none',
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: s.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                  boxShadow: `0 4px 16px ${s.glow}`,
                }}>
                  {s.icon}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 8px',
                  borderRadius: 20,
                  background: s.trend === 'up' ? 'rgba(16,185,129,0.12)' : s.trend === 'alert' ? 'rgba(240,90,40,0.12)' : 'rgba(255,255,255,0.06)',
                  color: s.trend === 'up' ? '#10b981' : s.trend === 'alert' ? '#f05a28' : '#666',
                }}>
                  {s.change}
                </span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ color: '#555', fontSize: 12, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '24px', marginBottom: 28,
        }}>
          <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.href} href={a.href} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 8, padding: '16px 8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, textDecoration: 'none',
                transition: 'all 0.15s',
                cursor: 'pointer',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${a.color}18`,
                  border: `1px solid ${a.color}28`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, color: a.color,
                }}>
                  {a.icon}
                </div>
                <span style={{ color: '#888', fontSize: 11, fontWeight: 600, textAlign: 'center' }}>
                  {a.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Google Analytics Panel */}
        <AnalyticsPanel />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

          {/* Recent Portfolio Images */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16, padding: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0 }}>
                Recent Portfolio Images
              </h2>
              <Link href="/admin/portfolio" style={{
                color: '#6c63ff', textDecoration: 'none', fontSize: 12, fontWeight: 600,
                padding: '5px 12px', border: '1px solid rgba(108,99,255,0.2)',
                borderRadius: 6, background: 'rgba(108,99,255,0.08)',
              }}>
                View All →
              </Link>
            </div>

            {recentImages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
                <p style={{ color: '#555', fontSize: 14, marginBottom: 16 }}>No images yet.</p>
                <Link href="/admin/portfolio/upload" style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg,#6c63ff,#e040fb)',
                  borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600,
                }}>
                  Upload Now
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {recentImages.map((img) => (
                  <div key={img.id} style={{
                    background: '#111', borderRadius: 10, overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ position: 'relative', overflow: 'hidden', height: 130 }}>
                      <img
                        src={img.image_url} alt={img.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                      }} />
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <p style={{
                        color: '#fff', fontSize: 12, margin: '0 0 5px',
                        fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {img.title || 'Untitled'}
                      </p>
                      <span style={{
                        background: 'rgba(108,99,255,0.15)',
                        color: '#6c63ff', fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                      }}>
                        {img.category || 'General'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Activity Feed */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: '22px',
            }}>
              <h2 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 18px' }}>
                Recent Activity
              </h2>
              {[
                { icon: '🖼️', text: 'New portfolio image uploaded', time: '2m ago', color: '#6c63ff' },
                { icon: '✉️', text: 'New contact message received', time: '1h ago', color: '#f05a28' },
                { icon: '👥', text: 'Team member profile updated', time: '3h ago', color: '#10b981' },
                { icon: '📝', text: 'Blog post draft saved', time: '1d ago', color: '#e040fb' },
                { icon: '⚙', text: 'Site settings updated', time: '2d ago', color: '#f59e0b' },
              ].map((act, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  paddingBottom: 14, marginBottom: 14,
                  borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <div style={{
                    width: 32, height: 32, flexShrink: 0,
                    background: `${act.color}14`,
                    border: `1px solid ${act.color}22`,
                    borderRadius: 8, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 14,
                  }}>
                    {act.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#ccc', fontSize: 12, margin: '0 0 2px', fontWeight: 500 }}>{act.text}</p>
                    <span style={{ color: '#444', fontSize: 11 }}>{act.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Site Health */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: '22px',
            }}>
              <h2 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 18px' }}>
                Site Health
              </h2>
              {[
                { label: 'Portfolio', pct: 85, color: '#6c63ff' },
                { label: 'Blog', pct: 60, color: '#e040fb' },
                { label: 'Team', pct: 100, color: '#10b981' },
                { label: 'Services', pct: 75, color: '#f05a28' },
              ].map((bar) => (
                <div key={bar.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ color: '#888', fontSize: 12, fontWeight: 500 }}>{bar.label}</span>
                    <span style={{ color: bar.color, fontSize: 12, fontWeight: 700 }}>{bar.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${bar.pct}%`,
                      background: bar.color, borderRadius: 6,
                      boxShadow: `0 0 8px ${bar.color}60`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 1200px) {
          main { margin-left: 0 !important; padding: 24px !important; }
        }
      `}</style>
    </div>
  );
}
