// SERVER ONLY. Shared helpers for the /api/meetnotes/* routes.
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

/**
 * Verifies the Supabase access token sent as "Authorization: Bearer <token>".
 * Returns { user, db } where db is a Supabase client acting AS that user, so
 * row-level security and auth.uid() apply to everything it does.
 */
export async function requireUser(request) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return { error: json({ error: 'Supabase is not configured.' }, 503) };
  const header = request.headers.get('authorization') || '';
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
  if (!token) return { error: json({ error: 'Please sign in.' }, 401) };

  const db = createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await db.auth.getUser(token);
  if (error || !data?.user) return { error: json({ error: 'Your session has expired. Please sign in again.' }, 401) };
  return { user: data.user, db };
}

/** Counts recording time against the user's monthly plan. */
export async function consumeSeconds(db, seconds) {
  const { data, error } = await db.rpc('meetnotes_consume', { secs: Math.max(0, Math.round(seconds)) });
  if (error) return { ok: false, error: 'usage_check_failed' };
  return data;
}

/** One Claude call. Returns the text of the reply. */
export async function askClaude({ system, prompt, maxTokens = 2000 }) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw Object.assign(new Error('ANTHROPIC_API_KEY is not set.'), { status: 503 });
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('[meetnotes] Anthropic error', res.status, body?.error?.message);
    throw Object.assign(new Error('The AI service did not answer. Please try again.'), { status: 502 });
  }
  return (body.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
}

/** Pulls the first JSON object out of a model reply. */
export function parseJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}
