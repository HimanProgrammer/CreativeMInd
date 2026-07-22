import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function shape(u) {
  return {
    uid: u.uid,
    email: u.email || '',
    displayName: u.displayName || '',
    photoURL: u.photoURL || null,
    disabled: u.disabled,
    emailVerified: u.emailVerified,
    role: u.customClaims?.admin ? 'Admin' : (u.customClaims?.role || 'Editor'),
    provider: (u.providerData || []).map((p) => p.providerId).join(', ') || 'password',
    createdAt: u.metadata?.creationTime || null,
    lastSignIn: u.metadata?.lastSignInTime || null,
  };
}

// GET /api/admin/users — list all Firebase Auth accounts
export async function GET(request) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  try {
    const users = [];
    let pageToken;
    // listUsers pages at 1000; loop so large projects are covered.
    do {
      const res = await adminAuth().listUsers(1000, pageToken);
      res.users.forEach((u) => users.push(shape(u)));
      pageToken = res.pageToken;
    } while (pageToken);

    users.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return NextResponse.json({ users, count: users.length, me: gate.user.uid });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/admin/users — create a new account
export async function POST(request) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }

  const { email, password, displayName, role } = body || {};
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }
  if (String(password).length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
  }

  try {
    const user = await adminAuth().createUser({
      email: String(email).trim(),
      password: String(password),
      displayName: displayName ? String(displayName).trim() : undefined,
    });
    if (role) {
      await adminAuth().setCustomUserClaims(user.uid, role === 'Admin' ? { admin: true, role } : { role });
    }
    const fresh = await adminAuth().getUser(user.uid);
    return NextResponse.json({ user: shape(fresh) }, { status: 201 });
  } catch (e) {
    const msg = e.code === 'auth/email-already-exists'
      ? 'That email is already registered.'
      : e.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
