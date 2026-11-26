// POST /api/meetnotes/notes  { transcript: string, title?: string, lang?: id }
// Returns structured meeting notes written by Claude.
import { requireUser, askClaude, parseJson, json } from '@/lib/meetnotes/server';
import { NOTE_LANGS } from '@/lib/meetnotes/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SYSTEM = `You are MeetNotes, a careful meeting notetaker for Indian businesses.
You read a meeting transcript and return ONLY a JSON object, no prose, no code fences:
{
 "title": string,
 "summary": string,                 // 3-5 sentences
 "key_points": [string],
 "decisions": [string],
 "action_items": [{"task": string, "owner": string, "due": string}],
 "open_questions": [string],
 "follow_up_message": string        // short, polite, ready to send on WhatsApp or email
}
Rules:
- Use only what was said. Never invent names, prices, numbers or dates; use "" when unknown.
- Keep money and numbers exactly as spoken (₹25,000 stays ₹25,000).
- Fix obvious speech-recognition mistakes only when the meaning is clear.
- Empty arrays are fine when nothing fits.`;

export async function POST(request) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  const { transcript = '', title = '', lang = 'hinglish' } = await request.json().catch(() => ({}));
  const text = String(transcript).trim();
  if (text.length < 20) return json({ error: 'The transcript is too short to make notes from.' }, 400);
  const language = (NOTE_LANGS.find((l) => l.id === lang) || NOTE_LANGS[0]).prompt;

  try {
    const reply = await askClaude({
      system: SYSTEM,
      maxTokens: 3000,
      prompt: `Write every value in ${language}.\nTitle given by the user: ${String(title).slice(0, 200) || '(none)'}\n\nTRANSCRIPT:\n${text.slice(0, 180000)}`,
    });
    const notes = parseJson(reply);
    if (!notes) return json({ error: 'The AI reply could not be read. Please try again.' }, 502);
    return json({ notes });
  } catch (e) {
    return json({ error: e.message }, e.status || 500);
  }
}
