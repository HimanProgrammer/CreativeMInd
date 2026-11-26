'use client';
import { useEffect, useState } from 'react';
import Brand from '@/components/meetnotes/Brand';
import { getSupabase } from '@/lib/supabase';

// Email one-time code sign-in (works inside the installed app too, unlike a
// magic link that may open in a different browser). Google sign-in shows only
// when NEXT_PUBLIC_MEETNOTES_GOOGLE=1 and the Google provider is on in Supabase.
export default function MeetNotesLogin() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    try {
      getSupabase().auth.getSession().then(({ data }) => {
        if (data?.session) window.location.replace('/meetnotes/app/');
      });
    } catch {
      setMsg('Sign-in is not configured yet.');
    }
  }, []);

  async function sendCode(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    const { error } = await getSupabase().auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/meetnotes/app/` },
    });
    setBusy(false);
    if (error) return setMsg(error.message);
    setStep('code');
    setMsg(`We sent a sign-in code to ${email.trim()}. It may take a minute — check spam too.`);
  }

  async function verify(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    const { error } = await getSupabase().auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' });
    setBusy(false);
    if (error) return setMsg('That code did not work. Check it, or send a new one.');
    window.location.replace('/meetnotes/app/');
  }

  async function google() {
    await getSupabase().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/meetnotes/app/` },
    });
  }

  return (
    <div className="navy auth">
      <div className="card">
        <Brand light={false} compact />
        <h1>Sign in to MeetNotes</h1>
        <p className="lbl">New here? The same step creates your free account.</p>
        {step === 'email' ? (
          <form onSubmit={sendCode}>
            <label className="lbl" htmlFor="em">Email</label>
            <input id="em" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" />
            <button className="btn" disabled={busy}>{busy ? 'Sending…' : 'Send sign-in code'}</button>
            {process.env.NEXT_PUBLIC_MEETNOTES_GOOGLE === '1' && (
              <button type="button" className="btn o" onClick={google}>Continue with Google</button>
            )}
          </form>
        ) : (
          <form onSubmit={verify}>
            <label className="lbl" htmlFor="cd">Code from the email</label>
            <input id="cd" inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
            <button className="btn" disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
            <button type="button" className="btn o" onClick={() => { setStep('email'); setCode(''); setMsg(''); }}>Use a different email</button>
          </form>
        )}
        {msg && <p className="msg" style={{ marginTop: 14 }}>{msg}</p>}
        <p className="lbl" style={{ marginTop: 18 }}><a href="/meetnotes/">← About MeetNotes</a></p>
      </div>
    </div>
  );
}
