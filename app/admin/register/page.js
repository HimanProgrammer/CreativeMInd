'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';

export default function AdminRegister() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleRegister(e) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      setSuccess(true);
      setTimeout(() => router.push('/admin/dashboard'), 1500);
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setGoogleLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      router.push('/admin/dashboard');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(friendlyError(err.code));
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  if (success) {
    return (
      <div style={s.page}>
        <div style={{ ...s.card, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h2 style={s.title}>Account Created!</h2>
          <p style={{ color: '#666', fontSize: 14 }}>Redirecting to dashboard...</p>
          <div style={s.successBar} />
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}><span style={s.logoText}>CM</span></div>
        <h2 style={s.title}>Create Account</h2>
        <p style={s.subtitle}>Join the CreativeMind Admin Panel</p>

        {/* Google Sign Up */}
        <button onClick={handleGoogleRegister} disabled={googleLoading} style={s.googleBtn}>
          {googleLoading ? <span style={s.spinner} /> : <GoogleIcon />}
          {googleLoading ? 'Connecting...' : 'Sign up with Google'}
        </button>

        <div style={s.divider}>
          <span style={s.dividerLine} />
          <span style={s.dividerText}>or register with email</span>
          <span style={s.dividerLine} />
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister}>
          <div style={s.field}>
            <label style={s.label}>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="John Doe"
              required
              style={s.input}
              autoComplete="name"
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="admin@example.com"
              required
              style={s.input}
              autoComplete="email"
            />
          </div>

          <div style={s.twoCol}>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="Min. 6 chars"
                required
                style={s.input}
                autoComplete="new-password"
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={set('confirm')}
                placeholder="Repeat password"
                required
                style={s.input}
                autoComplete="new-password"
              />
            </div>
          </div>

          <PasswordStrength password={form.password} />

          {error && <p style={s.error}>{error}</p>}

          <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? <><span style={s.spinner} /> Creating Account...</> : 'Create Account'}
          </button>
        </form>

        <p style={s.loginText}>
          Already have an account?{' '}
          <Link href="/admin/login" style={s.loginLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const strength = password.length >= 12 ? 3 : password.length >= 8 ? 2 : password.length >= 6 ? 1 : 0;
  const labels = ['Too short', 'Weak', 'Good', 'Strong'];
  const colors = ['#ff4444', '#f05a28', '#f59e0b', '#10b981'];
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 3,
            background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.08)',
            transition: 'background 0.2s',
          }} />
        ))}
      </div>
      <span style={{ color: colors[strength], fontSize: 11, fontWeight: 600 }}>{labels[strength]}</span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function friendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/too-many-requests': 'Too many requests. Please try again later.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a18 0%, #1a1a2e 50%, #0d0d1a 100%)',
    padding: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '44px 40px',
    width: '100%',
    maxWidth: 460,
    backdropFilter: 'blur(20px)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  },
  logo: {
    width: 56, height: 56,
    background: 'linear-gradient(135deg, #6c63ff, #e040fb)',
    borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 8px 32px rgba(108,99,255,0.4)',
  },
  logoText: { color: '#fff', fontWeight: 800, fontSize: 18 },
  title: { color: '#fff', fontSize: 24, fontWeight: 800, margin: '0 0 6px', textAlign: 'center', letterSpacing: '-0.02em' },
  subtitle: { color: '#666', fontSize: 13, margin: '0 0 24px', textAlign: 'center' },
  googleBtn: {
    width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '12px 16px',
    background: '#fff',
    border: 'none',
    borderRadius: 10,
    color: '#111',
    fontSize: 14, fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 20,
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' },
  dividerText: { color: '#444', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  field: { marginBottom: 16 },
  label: { display: 'block', color: '#aaa', fontSize: 12, fontWeight: 500, marginBottom: 7 },
  input: {
    width: '100%',
    padding: '11px 13px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 9,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  error: {
    color: '#ff6b6b', fontSize: 13, margin: '0 0 14px',
    background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)',
    borderRadius: 8, padding: '8px 12px', textAlign: 'center',
  },
  btn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #6c63ff, #e040fb)',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15, fontWeight: 700,
    cursor: 'pointer',
    marginTop: 4,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: '0 4px 20px rgba(108,99,255,0.35)',
  },
  spinner: {
    display: 'inline-block',
    width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  loginText: { color: '#555', fontSize: 13, textAlign: 'center', marginTop: 22, marginBottom: 0 },
  loginLink: { color: '#6c63ff', textDecoration: 'none', fontWeight: 600 },
  successBar: {
    height: 3, background: 'linear-gradient(90deg, #6c63ff, #e040fb)',
    borderRadius: 3, marginTop: 20, animation: 'grow 1.5s ease-out',
  },
};
