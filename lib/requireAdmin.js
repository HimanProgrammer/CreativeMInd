// SERVER ONLY. Guards the user-management API.
//
// The site's middleware only checks that an `admin_token` cookie EXISTS, and a
// literal "dev_bypass_token" is handed out by the login page's dev shortcut.
// That is fine for hiding UI, but it is nowhere near enough to protect
// endpoints that can list, disable or delete real accounts — anyone could set
// that cookie by hand. So every request here is cryptographically verified.
import { adminAuth, adminConfigured, adminConfigError } from './firebaseAdmin';

const DEV_BYPASS = 'dev_bypass_token';

function bearerFrom(request) {
  const header = request.headers.get('authorization') || '';
  if (header.toLowerCase().startsWith('bearer ')) return header.slice(7).trim();
  const cookie = request.cookies?.get?.('admin_token')?.value;
  return cookie || null;
}

function allowlist() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Returns { ok: true, user } or { ok: false, status, error }.
 * Authorised if the verified token carries a custom `admin` claim, or the
 * verified email is in ADMIN_EMAILS (used to bootstrap the first admin).
 */
export async function requireAdmin(request) {
  if (!adminConfigured()) {
    return { ok: false, status: 503, error: adminConfigError() || 'Firebase Admin not configured.' };
  }

  const token = bearerFrom(request);
  if (!token) return { ok: false, status: 401, error: 'Not signed in.' };

  if (token === DEV_BYPASS) {
    return {
      ok: false,
      status: 403,
      error: 'The dev bypass login cannot manage users. Sign in with a real Firebase account.',
    };
  }

  let decoded;
  try {
    decoded = await adminAuth().verifyIdToken(token, true);
  } catch (e) {
    return { ok: false, status: 401, error: `Invalid or expired session (${e.code || e.message}).` };
  }

  const email = (decoded.email || '').toLowerCase();
  const isAdmin = decoded.admin === true || allowlist().includes(email);
  if (!isAdmin) {
    return { ok: false, status: 403, error: 'Your account does not have admin permission.' };
  }

  return { ok: true, user: { uid: decoded.uid, email, name: decoded.name || '' } };
}
