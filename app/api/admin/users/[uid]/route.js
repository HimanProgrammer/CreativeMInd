import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// PATCH /api/admin/users/:uid — update name, role, enabled state or password
export async function PATCH(request, { params }) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const { uid } = params;
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }

  const { displayName, disabled, role, password } = body || {};

  // Lockout guards: don't let an admin lock themselves out.
  if (uid === gate.user.uid && disabled === true) {
    return NextResponse.json({ error: 'You cannot disable your own account.' }, { status: 400 });
  }
  if (uid === gate.user.uid && role && role !== 'Admin') {
    return NextResponse.json({ error: 'You cannot remove your own admin role.' }, { status: 400 });
  }

  try {
    const update = {};
    if (displayName !== undefined) update.displayName = String(displayName).trim();
    if (disabled !== undefined) update.disabled = Boolean(disabled);
    if (password) {
      if (String(password).length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
      }
      update.password = String(password);
    }
    if (Object.keys(update).length) await adminAuth().updateUser(uid, update);

    if (role) {
      await adminAuth().setCustomUserClaims(uid, role === 'Admin' ? { admin: true, role } : { role });
      // Force the user's next request to pick up the new claim.
      await adminAuth().revokeRefreshTokens(uid);
    }

    const u = await adminAuth().getUser(uid);
    return NextResponse.json({
      user: {
        uid: u.uid,
        email: u.email || '',
        displayName: u.displayName || '',
        disabled: u.disabled,
        role: u.customClaims?.admin ? 'Admin' : (u.customClaims?.role || 'Editor'),
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// DELETE /api/admin/users/:uid
export async function DELETE(request, { params }) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const { uid } = params;
  if (uid === gate.user.uid) {
    return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
  }

  try {
    await adminAuth().deleteUser(uid);
    return NextResponse.json({ ok: true, uid });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
