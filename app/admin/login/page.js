'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';

export default function AdminLogin() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { resetPassword } = useAuth();

  // Only show Google button when Firebase Auth is fully enabled
  const firebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_AUTH_ENABLED === 'true';
  const [currentDomain, setCurrentDomain] = useState('');
  useEffect(() => {
    setCurrentDomain(window.location.hostname);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Dev bypass — works even without Firebase setup
    const DEV_PASS = 'admin123';
    if (password === DEV_PASS) {
      document.cookie = 'admin_token=dev_bypass_token; path=/; max-age=86400';
      router.push('/admin/dashboard');
      return;
    }

    try {
      await login(email, password);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      router.push('/admin/dashboard');
    } catch (err) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled in Firebase Console. Use email login with password: admin123');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(`Add "${currentDomain}" to Firebase → Authentication → Settings → Authorized Domains. Or use email + password: admin123`);
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError(friendlyError(err.code) + ' — Or use password: admin123');
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    try {
      await resetPassword(forgotEmail);
      setResetSent(true);
    } catch (err) {
      setError(friendlyError(err.code));
    }
  }

  if (showForgot) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.logo}><span style={s.logoText}>CM</span></div>
          <h2 style={s.title}>Reset Password</h2>
          <p style={s.subtitle}>Enter your email to receive a reset link</p>

          {resetSent ? (
            <div style={s.successBox}>
              ✅ Reset link sent! Check your inbox.
              <button onClick={() => { setShowForgot(false); setResetSent(false); }} style={s.linkBtn}>
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Email</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  style={s.input}
                />
              </div>
              {error && <p style={s.error}>{error}</p>}
              <button type="submit" style={s.btn}>Send Reset Link</button>
              <button type="button" onClick={() => setShowForgot(false)} style={s.ghostBtn}>
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}><span style={s.logoText}>CM</span></div>
        <h2 style={s.title}>Welcome Back</h2>
        <p style={s.subtitle}>Sign in to CreativeMind Admin</p>

        {/* Google Sign In */}
        <button onClick={handleGoogleLogin} disabled={googleLoading} style={s.googleBtn}>
          {googleLoading ? <span style={s.spinner} /> : <GoogleIcon />}
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </button>
        <div style={s.divider}>
          <span style={s.dividerLine} />
          <span style={s.dividerText}>or sign in with email</span>
          <span style={s.dividerLine} />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              style={s.input}
              autoComplete="email"
            />
          </div>

          <div style={s.field}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={s.label}>Password</label>
              <button type="button" onClick={() => setShowForgot(true)} style={s.forgotBtn}>
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={s.input}
              autoComplete="current-password"
            />
          </div>

          {error && <p style={s.error}>{error}</p>}

          <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? <><span style={s.spinner} /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 10, textAlign: 'center' }}>
          <p style={{ color: '#888', fontSize: 12, margin: 0 }}>
            🔑 <strong style={{ color: '#aaa' }}>Quick access:</strong> any email + password <code style={{ color: '#6c63ff', background: 'rgba(108,99,255,0.15)', padding: '1px 6px', borderRadius: 4 }}>admin123</code>
          </p>
        </div>

        <p style={s.registerText}>
          Don&apos;t have an account?{' '}
          <Link href="/admin/register" style={s.registerLink}>Create one</Link>
        </p>
      </div>
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
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many failed attempts. Try again later.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/not-configured': 'Firebase is not configured. Use password: admin123',
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
    padding: '48px 40px',
    width: '100%',
    maxWidth: 420,
    backdropFilter: 'blur(20px)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  },
  logo: {
    width: 60, height: 60,
    background: 'linear-gradient(135deg, #6c63ff, #e040fb)',
    borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 8px 32px rgba(108,99,255,0.4)',
  },
  logoText: { color: '#fff', fontWeight: 800, fontSize: 20 },
  title: { color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 8px', textAlign: 'center', letterSpacing: '-0.02em' },
  subtitle: { color: '#666', fontSize: 14, margin: '0 0 28px', textAlign: 'center' },
  googleBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '12px 16px',
    background: '#fff',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10,
    color: '#111',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 20,
    transition: 'all 0.15s',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
  },
  dividerLine: {
    flex: 1, height: 1, background: 'rgba(255,255,255,0.08)',
  },
  dividerText: { color: '#444', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' },
  form: { display: 'flex', flexDirection: 'column', gap: 0 },
  field: { marginBottom: 18 },
  label: { display: 'block', color: '#aaa', fontSize: 13, fontWeight: 500, marginBottom: 8 },
  input: {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  forgotBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#6c63ff', fontSize: 12, fontWeight: 500, padding: 0,
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
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 20px rgba(108,99,255,0.35)',
  },
  ghostBtn: {
    width: '100%',
    padding: '11px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#888',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: 10,
  },
  spinner: {
    display: 'inline-block',
    width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  registerText: { color: '#555', fontSize: 13, textAlign: 'center', marginTop: 24, marginBottom: 0 },
  registerLink: { color: '#6c63ff', textDecoration: 'none', fontWeight: 600 },
  linkBtn: {
    display: 'block',
    background: 'none', border: 'none',
    color: '#6c63ff', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', marginTop: 12, width: '100%', textAlign: 'center',
  },
  successBox: {
    textAlign: 'center',
    color: '#10b981',
    padding: '16px',
    background: 'rgba(16,185,129,0.08)',
    border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: 10,
    fontSize: 14,
  },
};
