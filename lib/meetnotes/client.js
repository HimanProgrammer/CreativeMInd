'use client';
// Browser helpers for MeetNotes: authenticated API calls and audio handling.
import { getSupabase } from '@/lib/supabase';

export async function api(path, { json, form } = {}) {
  const { data } = await getSupabase().auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw Object.assign(new Error('Please sign in again.'), { status: 401 });
  const res = await fetch(`/api/meetnotes/${path}/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, ...(json ? { 'content-type': 'application/json' } : {}) },
    body: json ? JSON.stringify(json) : form,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(body.message || body.error || 'Something went wrong.'), { status: res.status, body });
  return body;
}

export const fmtTime = (s) => {
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600);
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${m}:${sec}` : `${m}:${sec}`;
};

function pickMime() {
  if (typeof MediaRecorder === 'undefined') return '';
  for (const t of ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']) {
    if (MediaRecorder.isTypeSupported?.(t)) return t;
  }
  return '';
}

/**
 * Records the microphone in self-contained chunks (each a playable file), so
 * every chunk can be transcribed on its own while the meeting is still going.
 * onChunk(blob, startSec, durationSec) is called for each finished chunk.
 */
export class ChunkRecorder {
  constructor({ onChunk, chunkSeconds = 20 }) {
    this.onChunk = onChunk;
    this.chunkMs = chunkSeconds * 1000;
    this.mime = pickMime();
    this.offset = 0; // seconds recorded before the current chunk
  }

  static supported() {
    return typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
    this.running = true;
    this._next();
  }

  _next() {
    if (!this.running) return;
    const rec = new MediaRecorder(this.stream, this.mime ? { mimeType: this.mime, audioBitsPerSecond: 32000 } : undefined);
    const parts = [];
    const began = performance.now();
    const start = this.offset;
    rec.ondataavailable = (e) => e.data.size && parts.push(e.data);
    rec.onstop = () => {
      const dur = (performance.now() - began) / 1000;
      this.offset += dur;
      if (parts.length && dur > 0.8) this.onChunk(new Blob(parts, { type: rec.mimeType || this.mime || 'audio/webm' }), start, dur);
      if (this.running) this._next();
      else this._release();
    };
    rec.start();
    this.rec = rec;
    this.timer = setTimeout(() => rec.state === 'recording' && rec.stop(), this.chunkMs);
  }

  elapsed() {
    return this.offset;
  }

  stop() {
    this.running = false;
    clearTimeout(this.timer);
    if (this.rec?.state === 'recording') this.rec.stop();
    else this._release();
  }

  _release() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
  }
}

export const extFor = (type = '') => (type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : type.includes('wav') ? 'wav' : 'webm');

/**
 * Decodes any audio/video file the browser can play and cuts it into 16 kHz
 * mono WAV pieces of `pieceSeconds`, small enough for the upload limit.
 */
export async function splitFileToWav(file, pieceSeconds = 60) {
  const buf = await file.arrayBuffer();
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();
  const decoded = await ctx.decodeAudioData(buf.slice(0));
  ctx.close?.();
  const rate = 16000;
  const length = Math.ceil(decoded.duration * rate);
  const off = new OfflineAudioContext(1, length, rate);
  const src = off.createBufferSource();
  src.buffer = decoded;
  src.connect(off.destination);
  src.start();
  const mono = (await off.startRendering()).getChannelData(0);
  const pieces = [];
  const step = pieceSeconds * rate;
  for (let i = 0; i < mono.length; i += step) {
    const slice = mono.subarray(i, Math.min(i + step, mono.length));
    pieces.push({ blob: toWav(slice, rate), start: i / rate, dur: slice.length / rate });
  }
  return { pieces, duration: decoded.duration };
}

function toWav(samples, rate) {
  const out = new DataView(new ArrayBuffer(44 + samples.length * 2));
  const w = (o, s) => [...s].forEach((c, i) => out.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF');
  out.setUint32(4, 36 + samples.length * 2, true);
  w(8, 'WAVE');
  w(12, 'fmt ');
  out.setUint32(16, 16, true);
  out.setUint16(20, 1, true);
  out.setUint16(22, 1, true);
  out.setUint32(24, rate, true);
  out.setUint32(28, rate * 2, true);
  out.setUint16(32, 2, true);
  out.setUint16(34, 16, true);
  w(36, 'data');
  out.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    out.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([out], { type: 'audio/wav' });
}

export function notesToMarkdown(n, segs = []) {
  const list = (a) => (a || []).map((x) => `- ${x}`).join('\n') || '- —';
  return [
    `# ${n.title || 'Meeting notes'}`,
    `\n## Summary\n${n.summary || ''}`,
    `\n## Key points\n${list(n.key_points)}`,
    `\n## Decisions\n${list(n.decisions)}`,
    `\n## Action items\n${(n.action_items || []).map((a) => `- [ ] ${a.task}${a.owner ? ` — ${a.owner}` : ''}${a.due ? ` (${a.due})` : ''}`).join('\n') || '- —'}`,
    n.open_questions?.length ? `\n## Open questions\n${list(n.open_questions)}` : '',
    `\n## Follow-up message\n${n.follow_up_message || ''}`,
    segs.length ? `\n## Transcript\n${segs.map((s) => `[${fmtTime(s.t)}] ${s.who}: ${s.text}`).join('\n')}` : '',
    '\n— Made with MeetNotes by Creative Mind IT Solutions',
  ].join('\n');
}
