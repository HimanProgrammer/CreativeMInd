// POST /api/meetnotes/polish  { text: string, style: id }
// Voice Flow: turns messy dictation into clean, formatted text.
import { requireUser, askClaude, json } from '@/lib/meetnotes/server';
import { FLOW_STYLES } from '@/lib/meetnotes/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const SYSTEM = `You rewrite dictated speech. Remove filler words (umm, uh, matlab, basically, like, you know),
repeated words and false starts. Fix grammar and punctuation. Keep the speaker's meaning, facts, numbers
and names exactly. Keep the original language (Hindi / English / Hinglish) unless the requested format
says to translate. Return only the final text — no preamble, no quotes, no explanation.`;

export async function POST(request) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  const { text = '', style = 'clean' } = await request.json().catch(() => ({}));
  const raw = String(text).trim();
  if (!raw) return json({ error: 'Nothing to polish yet.' }, 400);
  const fmt = (FLOW_STYLES.find((s) => s.id === style) || FLOW_STYLES[0]).prompt;

  try {
    const out = await askClaude({
      system: SYSTEM,
      maxTokens: 1500,
      prompt: `Rewrite as ${fmt}.\n\nDICTATED TEXT:\n${raw.slice(0, 20000)}`,
    });
    return json({ text: out });
  } catch (e) {
    return json({ error: e.message }, e.status || 500);
  }
}
