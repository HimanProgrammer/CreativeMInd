'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '⊞', badge: null },
  { href: '/admin/portfolio', label: 'Portfolio', icon: '🖼️', badge: null },
  { href: '/admin/portfolio/upload', label: 'Upload Images', icon: '⬆', badge: null },
  { href: '/admin/scraper', label: 'Image Extractor', icon: '🔍', badge: 'New' },
  { href: '/admin/messages', label: 'Messages', icon: '✉', badge: null },
  { href: '/admin/about', label: 'About Us', icon: '🏢', badge: null },
  { href: '/admin/team', label: 'Team', icon: '👥', badge: null },
  { href: '/admin/services', label: 'Services', icon: '⚙', badge: null },
  { href: '/admin/blog', label: 'Blog Posts', icon: '📝', badge: null },
  { href: '/admin/users', label: 'Users', icon: '👥', badge: 'New' },
  { href: '/admin/settings', label: 'Settings', icon: '🔧', badge: null },
];

export default function AdminSidebar({ onLogout, userEmail, userName, userPhoto }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  const displayName = userName || userEmail;
  const avatarLetter = (displayName || 'A')[0].toUpperCase();

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoWrap}>
        <div style={styles.logoBox}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>CM</span>
        </div>
        <div>
          <div style={styles.logoName}>CreativeMind</div>
          <div style={styles.logoBadge}>Admin Panel</div>
        </div>
      </div>

      {/* User pill */}
      {displayName && (
        <div style={styles.userPill}>
          {userPhoto ? (
            <img src={userPhoto} alt="avatar" style={{ ...styles.userAvatar, objectFit: 'cover' }} />
          ) : (
            <div style={styles.userAvatar}>{avatarLetter}</div>
          )}
          <div style={{ overflow: 'hidden' }}>
            <div style={styles.userEmail}>{userName || userEmail}</div>
            <div style={styles.userRole}>{userEmail}</div>
          </div>
        </div>
      )}

      <div style={styles.divider} />

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navSection}>MAIN MENU</div>
        {navItems.slice(0, 4).map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}

        <div style={{ ...styles.navSection, marginTop: 20 }}>MANAGEMENT</div>
        {navItems.slice(4, 8).map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}

        <div style={{ ...styles.navSection, marginTop: 20 }}>SYSTEM</div>
        {navItems.slice(8).map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>

      {/* Website link */}
      <a href="/" target="_blank" rel="noreferrer" style={styles.viewSite}>
        <span>🌐</span> View Website
        <span style={{ marginLeft: 'auto', opacity: 0.5, fontSize: 10 }}>↗</span>
      </a>

      {/* Logout */}
      {onLogout && (
        <button onClick={onLogout} style={styles.logoutBtn}>
          <span>🚪</span> Logout
        </button>
      )}
    </aside>
  );
}

function NavLink({ item, active }) {
  return (
    <Link href={item.href} style={{
      ...styles.navItem,
      ...(active ? styles.navItemActive : {}),
    }}>
      {active && <div style={styles.activeBar} />}
      <span style={{ fontSize: 15 }}>{item.icon}</span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span style={styles.badge}>{item.badge}</span>
      )}
    </Link>
  );
}

const styles = {
  sidebar: {
    width: 250,
    background: 'linear-gradient(180deg, #0d0d1a 0%, #111127 100%)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 0 20px',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
    scrollbarWidth: 'none',
  },
  logoWrap: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '24px 20px 20px',
  },
  logoBox: {
    width: 38, height: 38, flexShrink: 0,
    background: 'linear-gradient(135deg, #6c63ff, #e040fb)',
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(108,99,255,0.4)',
  },
  logoName: { color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1.2 },
  logoBadge: { color: '#6c63ff', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', marginTop: 2 },
  userPill: {
    display: 'flex', alignItems: 'center', gap: 10,
    margin: '0 12px 0',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  userAvatar: {
    width: 32, height: 32, flexShrink: 0,
    background: 'linear-gradient(135deg, #f05a28, #e040fb)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, fontSize: 13,
  },
  userEmail: { color: '#ccc', fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 },
  userRole: { color: '#555', fontSize: 10, marginTop: 1 },
  divider: { height: 1, background: 'rgba(255,255,255,0.06)', margin: '14px 12px' },
  nav: { flex: 1, padding: '0 10px' },
  navSection: { color: '#444', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', padding: '4px 12px 8px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px', borderRadius: 9,
    color: '#888', textDecoration: 'none', fontSize: 13, fontWeight: 500,
    marginBottom: 2, transition: 'all 0.15s', position: 'relative',
    overflow: 'hidden',
  },
  navItemActive: {
    background: 'rgba(108,99,255,0.15)',
    color: '#fff',
    borderColor: 'rgba(108,99,255,0.3)',
  },
  activeBar: {
    position: 'absolute', left: 0, top: '15%', bottom: '15%',
    width: 3, background: 'linear-gradient(180deg, #6c63ff, #e040fb)',
    borderRadius: '0 3px 3px 0',
  },
  badge: {
    background: 'linear-gradient(135deg, #f05a28, #e040fb)',
    color: '#fff', fontSize: 9, fontWeight: 700,
    padding: '2px 7px', borderRadius: 20, letterSpacing: '0.04em',
  },
  viewSite: {
    display: 'flex', alignItems: 'center', gap: 8,
    margin: '16px 10px 4px',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 9, color: '#666', textDecoration: 'none',
    fontSize: 12, fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'color 0.15s',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    margin: '4px 10px 0',
    padding: '10px 14px',
    background: 'rgba(255,68,68,0.06)',
    border: '1px solid rgba(255,68,68,0.12)',
    borderRadius: 9, color: '#ff6b6b', cursor: 'pointer',
    fontSize: 12, fontWeight: 600, textAlign: 'left',
    width: 'calc(100% - 20px)',
    transition: 'all 0.15s',
  },
};
