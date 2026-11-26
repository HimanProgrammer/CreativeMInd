// POST /api/meetnotes/transcribe
// multipart/form-data: audio (file), seconds (number, client's estimate), lang ("hinglish" | "english" | "hindi")
// Turns one audio chunk (or an uploaded recording) into text with OpenAI.
import { requireUser, consumeSeconds, json } from '@/lib/meetnotes/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Vercel caps a request body at 4.5 MB, so the app sends live recording in
// ~20 s chunks and splits uploaded files into 60 s WAV pieces in the browser.
const MAX_BYTES = 4.4 * 1024 * 1024;

const PROMPTS = {
  hinglish: 'Business meeting in India. Speakers mix Hindi and English (Hinglish). Write Hindi words in Roman script, e.g. "haan, website ka budget kitna hai?"',
  english: 'Business meeting in India, mostly in English.',
  hindi: 'भारत में एक बिज़नेस मीटिंग। हिंदी में लिखें।',
};

export async function POST(request) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  const key = process.env.OPENAI_API_KEY;
  if (!key) return json({ error: 'Transcription is not set up yet (OPENAI_API_KEY missing).' }, 503);

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Send the audio as form data.' }, 400);
  }
  const audio = form.get('audio');
  if (!audio || typeof audio === 'string' || !audio.size) return json({ error: 'No audio received.' }, 400);
  if (audio.size > MAX_BYTES) return json({ error: 'This audio piece is too large.' }, 413);

  const lang = ['hinglish', 'english', 'hindi'].includes(form.get('lang')) ? form.get('lang') : 'hinglish';
  // Bill at least what the file itself implies, so a wrong client estimate can't
  // hide usage: WAV carries its byte rate in the header; compressed speech
  // (webm/opus, mp4/aac) runs at roughly 6 KB a second or less.
  const claimed = Number(form.get('seconds')) || 0;
  let implied = audio.size / 6000;
  const head = new Uint8Array(await audio.slice(0, 44).arrayBuffer());
  if (head.length === 44 && String.fromCharCode(...head.slice(0, 4)) === 'RIFF') {
    const byteRate = new DataView(head.buffer).getUint32(28, true);
    if (byteRate > 0) implied = (audio.size - 44) / byteRate;
  }
  const seconds = Math.max(claimed, implied, 1);

  const usage = await consumeSeconds(auth.db, seconds);
  if (!usage?.ok) {
    if (usage?.error === 'limit_reached') {
      return json({ error: 'limit_reached', message: 'You have used all your recording minutes for this month.', usage }, 402);
    }
    return json({ error: 'Could not check your plan. Please try again.' }, 500);
  }

  const out = new FormData();
  out.append('file', audio, audio.name || 'audio.webm');
  out.append('model', process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-transcribe');
  out.append('prompt', PROMPTS[lang]);
  if (lang === 'hindi') out.append('language', 'hi');
  out.append('response_format', 'json');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: out,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('[meetnotes] OpenAI transcription error', res.status, body?.error?.message);
    return json({ error: 'Could not transcribe this part. Please try again.' }, 502);
  }
  return json({ text: (body.text || '').trim(), usage });
}
