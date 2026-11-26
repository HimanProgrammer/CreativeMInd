'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Brand from '@/components/meetnotes/Brand';
import { getSupabase } from '@/lib/supabase';
import { MEETNOTES, NOTE_LANGS, FLOW_STYLES } from '@/lib/meetnotes/config';
import { api, fmtTime, ChunkRecorder, splitFileToWav, extFor, notesToMarkdown } from '@/lib/meetnotes/client';

const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11z" /></svg>
);
const StopIcon = () => (
  <svg className="stop" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2" /></svg>
);

let uid = 0;
const nextId = () => `s${Date.now().toString(36)}${(uid++).toString(36)}`;

export default function MeetNotesApp() {
  const [session, setSession] = useState(undefined); // undefined = checking
  const [tab, setTab] = useState('meet');
  const [usage, setUsage] = useState(null);
  const [toast, setToast] = useState('');
  const [limitHit, setLimitHit] = useState(false);

  // meeting
  const [segs, setSegs] = useState([]);
  const [speakers, setSpeakers] = useState(['Me', 'Client']);
  const [cur, setCur] = useState('Me');
  const [title, setTitle] = useState('');
  const [lang, setLang] = useState('hinglish');
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const [pending, setPending] = useState(0);
  const [notes, setNotes] = useState(null);
  const [busyNotes, setBusyNotes] = useState(false);
  const [meetingId, setMeetingId] = useState(null);
  const [fileBusy, setFileBusy] = useState('');

  // voice flow
  const [raw, setRaw] = useState('');
  const [style, setStyle] = useState('clean');
  const [polished, setPolished] = useState('');
  const [flowRec, setFlowRec] = useState(false);
  const [flowBusy, setFlowBusy] = useState('');

  // saved
  const [saved, setSaved] = useState(null);

  const recRef = useRef(null);
  const flowRef = useRef(null);
  const queue = useRef(Promise.resolve());
  const curRef = useRef(cur);
  const langRef = useRef(lang);
  const tick = useRef(null);
  const wake = useRef(null);
  const txBox = useRef(null);
  const segsRef = useRef(segs);
  const pendingRef = useRef(0);
  curRef.current = cur;
  langRef.current = lang;
  segsRef.current = segs;

  const say = useCallback((m) => {
    setToast(m);
    clearTimeout(say.t);
    say.t = setTimeout(() => setToast(''), 2600);
  }, []);

  // ---- auth ----
  useEffect(() => {
    let sb;
    try {
      sb = getSupabase();
    } catch {
      setSession(null);
      return;
    }
    sb.auth.getSession().then(({ data }) => setSession(data.session || null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s || null));
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/meetnotes/sw.js', { scope: '/meetnotes/' }).catch(() => {});
    return () => sub?.subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === null) window.location.replace('/meetnotes/login/');
  }, [session]);

  const loadUsage = useCallback(async () => {
    const { data } = await getSupabase().from('meetnotes_usage').select('plan,period,seconds_used').maybeSingle();
    const plan = data?.plan || 'free';
    const limit = (MEETNOTES.plans.find((p) => p.id === plan)?.minutes || 60) * 60;
    const thisMonth = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }).slice(0, 7);
    const used = data && data.period === thisMonth ? data.seconds_used : 0;
    setUsage({ plan, used, limit });
  }, []);

  useEffect(() => {
    if (session) loadUsage();
  }, [session, loadUsage]);

  // keep the transcript scrolled to the newest line
  useEffect(() => {
    const b = txBox.current;
    if (b) b.scrollTop = b.scrollHeight;
  }, [segs.length]);

  // warn before leaving mid-recording
  useEffect(() => {
    const h = (e) => {
      if (recRef.current || pending) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [pending]);

  // ---- transcription queue (one request at a time, in order) ----
  const transcribe = useCallback(
    (blob, seconds) =>
      new Promise((resolve, reject) => {
        queue.current = queue.current.then(async () => {
          const form = new FormData();
          form.append('audio', blob, `chunk.${extFor(blob.type)}`);
          form.append('seconds', String(Math.round(seconds)));
          form.append('lang', langRef.current);
          try {
            const r = await api('transcribe', { form });
            if (r.usage) setUsage((u) => (u ? { ...u, used: r.usage.used, limit: r.usage.limit, plan: r.usage.plan } : u));
            resolve(r.text || '');
          } catch (e) {
            reject(e);
          }
        });
      }),
    []
  );

  const handleChunk = useCallback(
    (blob, start, dur) => {
      const id = nextId();
      setSegs((s) => [...s, { id, t: start, who: curRef.current, text: '', pending: true }]);
      pendingRef.current += 1;
      setPending((p) => p + 1);
      transcribe(blob, dur)
        .then((text) => setSegs((s) => (text ? s.map((x) => (x.id === id ? { ...x, text, pending: false } : x)) : s.filter((x) => x.id !== id))))
        .catch((e) => {
          setSegs((s) => s.map((x) => (x.id === id ? { ...x, text: '(could not transcribe this part)', pending: false } : x)));
          if (e.status === 402) {
            setLimitHit(true);
            recRef.current?.stop();
          } else if (e.status === 401) window.location.replace('/meetnotes/login/');
          else say(e.message);
        })
        .finally(() => {
          pendingRef.current -= 1;
          setPending((p) => p - 1);
        });
    },
    [transcribe, say]
  );

  async function toggleRecord() {
    if (rec) {
      recRef.current?.stop();
      recRef.current = null;
      clearInterval(tick.current);
      setRec(false);
      wake.current?.release?.().catch(() => {});
      return;
    }
    if (!ChunkRecorder.supported()) return say('This browser cannot record audio. Try Chrome, or upload a recording.');
    const base = secs;
    const r = new ChunkRecorder({ onChunk: (b, st, d) => handleChunk(b, base + st, d), chunkSeconds: 15 });
    try {
      await r.start();
    } catch {
      return say('Microphone permission is needed to record.');
    }
    recRef.current = r;
    setRec(true);
    setNotes(null);
    const t0 = Date.now();
    const startSecs = secs;
    tick.current = setInterval(() => setSecs(startSecs + (Date.now() - t0) / 1000), 500);
    try {
      wake.current = await navigator.wakeLock?.request('screen');
    } catch {}
  }

  async function onUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setFileBusy('Reading the recording…');
    const base = secs;
    try {
      const { pieces, duration } = await splitFileToWav(file, 60);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ''));
      setSecs((s) => s + duration);
      setFileBusy(`Transcribing ${Math.ceil(duration / 60)} min of audio…`);
      pieces.forEach((p) => handleChunk(p.blob, base + p.start, p.dur));
      await queue.current.catch(() => {});
    } catch {
      say('Could not read that file. Try an MP3, M4A, WAV or WebM recording.');
    }
    setFileBusy('');
  }

  const transcriptText = () => segsRef.current.filter((s) => s.text && !s.pending).map((s) => `[${fmtTime(s.t)}] ${s.who}: ${s.text}`).join('\n');

  async function saveMeeting(n) {
    const row = {
      title: (n?.title || title || 'Meeting').slice(0, 200),
      lang,
      duration_sec: Math.round(secs),
      transcript: segsRef.current.filter((s) => !s.pending).map(({ t, who, text }) => ({ t, who, text })),
      notes: n || null,
      updated_at: new Date().toISOString(),
    };
    const sb = getSupabase();
    if (meetingId) {
      const { error } = await sb.from('meetnotes_meetings').update(row).eq('id', meetingId);
      if (error) say('Could not save. Check your connection.');
    } else {
      const { data, error } = await sb.from('meetnotes_meetings').insert(row).select('id').single();
      if (error) say('Could not save. Check your connection.');
      else setMeetingId(data.id);
    }
  }

  async function generate() {
    if (rec) {
      await toggleRecord();
      await new Promise((r) => setTimeout(r, 700)); // let the last chunk arrive
    }
    if (pendingRef.current) {
      say('Finishing the last part of the transcript…');
      while (pendingRef.current) {
        await queue.current.catch(() => {});
        await new Promise((r) => setTimeout(r, 300));
      }
    }
    const text = transcriptText();
    if (text.length < 20) return say('Record or type a bit more of the discussion first.');
    setBusyNotes(true);
    try {
      const { notes: n } = await api('notes', { json: { transcript: text, title, lang } });
      setNotes(n);
      if (!title && n.title) setTitle(n.title);
      await saveMeeting(n);
      say('Notes ready and saved');
    } catch (e) {
      say(e.message);
    }
    setBusyNotes(false);
  }

  function newMeeting() {
    if (rec) toggleRecord();
    setSegs([]);
    setNotes(null);
    setTitle('');
    setSecs(0);
    setMeetingId(null);
    setLimitHit(false);
  }

  const cycleSpeaker = (id) =>
    setSegs((s) => s.map((x) => (x.id === id ? { ...x, who: speakers[(speakers.indexOf(x.who) + 1) % speakers.length] } : x)));

  // ---- exports ----
  const copy = (t) => navigator.clipboard.writeText(t).then(() => say('Copied')).catch(() => say('Copy blocked — select the text instead'));
  function download() {
    const md = notesToMarkdown(notes, segs);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown' }));
    a.download = `${(notes.title || title || 'meeting-notes').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-')}.md`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  async function share() {
    const md = notesToMarkdown(notes);
    if (navigator.share) {
      try {
        await navigator.share({ title: notes.title || 'Meeting notes', text: md });
        return;
      } catch {}
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(md)}`, '_blank', 'noopener');
  }

  // ---- voice flow ----
  async function toggleFlow() {
    if (flowRec) {
      flowRef.current?.stop();
      flowRef.current = null;
      setFlowRec(false);
      return;
    }
    if (!ChunkRecorder.supported()) return say('This browser cannot record audio — type instead.');
    const r = new ChunkRecorder({
      chunkSeconds: 120,
      onChunk: (blob, _s, dur) => {
        setFlowBusy('Turning your voice into text…');
        transcribe(blob, dur)
          .then((t) => t && setRaw((x) => (x ? `${x.trimEnd()} ${t}` : t)))
          .catch((e) => (e.status === 402 ? setLimitHit(true) : say(e.message)))
          .finally(() => setFlowBusy(''));
      },
    });
    try {
      await r.start();
    } catch {
      return say('Microphone permission is needed.');
    }
    flowRef.current = r;
    setFlowRec(true);
  }

  async function polish() {
    if (!raw.trim()) return say('Speak or type something first.');
    setFlowBusy('Polishing…');
    try {
      const { text } = await api('polish', { json: { text: raw, style } });
      setPolished(text);
    } catch (e) {
      say(e.message);
    }
    setFlowBusy('');
  }

  // ---- saved ----
  const loadSaved = useCallback(async () => {
    setSaved('loading');
    const { data, error } = await getSupabase()
      .from('meetnotes_meetings')
      .select('id,title,created_at,duration_sec')
      .order('created_at', { ascending: false })
      .limit(100);
    setSaved(error ? 'error' : data);
  }, []);

  async function openMeeting(id) {
    const { data, error } = await getSupabase().from('meetnotes_meetings').select('*').eq('id', id).single();
    if (error) return say('Could not open that meeting.');
    setSegs((data.transcript || []).map((s) => ({ ...s, id: nextId() })));
    const who = [...new Set((data.transcript || []).map((s) => s.who))];
    if (who.length) setSpeakers((sp) => [...new Set([...sp, ...who])]);
    setNotes(data.notes);
    setTitle(data.title);
    setLang(data.lang || 'hinglish');
    setSecs(data.duration_sec || 0);
    setMeetingId(data.id);
    setTab('meet');
  }

  async function removeMeeting(id) {
    if (!window.confirm('Delete this meeting and its notes?')) return;
    const { error } = await getSupabase().from('meetnotes_meetings').delete().eq('id', id);
    if (error) return say('Could not delete.');
    if (id === meetingId) newMeeting();
    setSaved((s) => (Array.isArray(s) ? s.filter((m) => m.id !== id) : s));
  }

  useEffect(() => {
    if (tab === 'saved' && session) loadSaved();
  }, [tab, session, loadSaved]);

  async function signOut() {
    await getSupabase().auth.signOut();
    window.location.replace('/meetnotes/login/');
  }

  if (!session) {
    return <div className="navy auth"><p>Loading MeetNotes…</p></div>;
  }

  const usedPct = usage ? Math.min(100, (usage.used / usage.limit) * 100) : 0;
  const waUpgrade = `https://wa.me/${MEETNOTES.whatsapp}?text=${encodeURIComponent(`Hi, I want to upgrade MeetNotes. My account: ${session.user.email}`)}`;

  return (
    <>
      <header className="navy appbar">
        <div className="wrap">
          <div className="row1">
            <Brand light compact />
            <div className="who">
              <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: 20 }}>MeetNotes</span>
              <button className="btn o sm" onClick={signOut}>Sign out</button>
            </div>
          </div>
          <nav className="tabs" role="tablist">
            {[['meet', 'Meeting'], ['flow', 'Voice Flow'], ['saved', 'Saved']].map(([id, label]) => (
              <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>{label}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="app">
        {usage && (
          <div className="usage">
            <span>{usage.plan[0].toUpperCase() + usage.plan.slice(1)} plan · {Math.floor(usage.used / 60)} of {Math.round(usage.limit / 60)} min used this month</span>
            <span className="meter"><i style={{ width: `${usedPct}%` }} /></span>
          </div>
        )}
        {limitHit && (
          <div className="banner">
            <span>You have used all your minutes for this month. Upgrade to keep recording.</span>
            <a className="btn sm" href={waUpgrade} target="_blank" rel="noopener noreferrer">Upgrade on WhatsApp</a>
          </div>
        )}

        {tab === 'meet' && (
          <section>
            <div className="rec">
              <button className={`mic ${rec ? 'live' : ''}`} onClick={toggleRecord} aria-label={rec ? 'Stop recording' : 'Start recording'}>
                {rec ? <StopIcon /> : <MicIcon />}
              </button>
              <div>
                <div className="time">{fmtTime(secs)}</div>
                <div className="state">
                  {rec
                    ? 'Recording — the transcript updates every 15 seconds. Keep this screen open.'
                    : fileBusy || (pending ? 'Finishing the transcript…' : segs.length ? 'Paused. Tap to continue, or generate notes.' : 'Tap to record your meeting. Hindi, English and Hinglish all work.')}
                </div>
              </div>
            </div>

            <div className="row">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Meeting title, e.g. Client call – Sharma Jewellers" aria-label="Meeting title" />
              <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Language">
                {NOTE_LANGS.map((l) => <option key={l.id} value={l.id}>Language: {l.label}</option>)}
              </select>
              <label className="btn o" style={{ cursor: 'pointer' }}>
                Upload recording
                <input type="file" accept="audio/*,video/*" onChange={onUpload} hidden />
              </label>
            </div>

            <div className="chips">
              <span className="lbl">Who&apos;s speaking now:</span>
              {speakers.map((s) => (
                <button key={s} className="chip" aria-pressed={s === cur} onClick={() => setCur(s)}>{s}</button>
              ))}
              <button
                className="chip"
                onClick={() => {
                  const n = window.prompt('Name of the new speaker', `Person ${speakers.length + 1}`);
                  if (n && n.trim() && !speakers.includes(n.trim())) {
                    setSpeakers((s) => [...s, n.trim()]);
                    setCur(n.trim());
                  }
                }}
              >
                + Add
              </button>
            </div>

            <div className="tx" ref={txBox}>
              {segs.length === 0 && <div className="empty">The transcript appears here with timestamps. Tap a speaker&apos;s name on any line to change it, and tap the text to correct it.</div>}
              {segs.map((s) => (
                <div className={`seg ${s.pending ? 'pending' : ''}`} key={s.id}>
                  <span className="t">{fmtTime(s.t)}</span>
                  <div>
                    <b onClick={() => cycleSpeaker(s.id)} title="Tap to change speaker">{s.who}:</b>
                    {s.pending ? (
                      <span>listening…</span>
                    ) : (
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const text = e.currentTarget.textContent;
                          setSegs((all) => all.map((x) => (x.id === s.id ? { ...x, text } : x)));
                        }}
                      >
                        {s.text}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="row">
              <input
                placeholder="Type or paste a line and press Enter"
                aria-label="Add a line"
                onKeyDown={(e) => {
                  const v = e.currentTarget.value.trim();
                  if (e.key === 'Enter' && v) {
                    setSegs((s) => [...s, { id: nextId(), t: secs, who: cur, text: v }]);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
            <div className="row">
              <button className="btn" onClick={generate} disabled={busyNotes}>{busyNotes ? 'Writing notes…' : 'Generate meeting notes'}</button>
              <button className="btn o" onClick={newMeeting}>New meeting</button>
            </div>

            {notes && (
              <article className="notes">
                <h2>{notes.title || title || 'Meeting notes'}</h2>
                <h3>Summary</h3>
                <p>{notes.summary}</p>
                <Section title="Key points" items={notes.key_points} />
                <Section title="Decisions" items={notes.decisions} />
                <h3>Action items</h3>
                {notes.action_items?.length ? (
                  <ul className="act">
                    {notes.action_items.map((a, i) => (
                      <li key={i}>
                        <input type="checkbox" aria-label="Done" />
                        <div>
                          {a.task}
                          <small>{[a.owner, a.due].filter(Boolean).join(' · ') || 'Owner not set'}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="lbl">None recorded.</p>
                )}
                {notes.open_questions?.length > 0 && <Section title="Open questions" items={notes.open_questions} />}
                <h3>Follow-up message</h3>
                <div className="mail">{notes.follow_up_message}</div>
                <div className="row">
                  <button className="btn" onClick={() => copy(notesToMarkdown(notes))}>Copy notes</button>
                  <button className="btn o" onClick={() => copy(notes.follow_up_message || '')}>Copy follow-up</button>
                  <button className="btn o" onClick={share}>Share</button>
                  <button className="btn o" onClick={download}>Download</button>
                </div>
              </article>
            )}
          </section>
        )}

        {tab === 'flow' && (
          <section>
            <h2 style={{ fontSize: 'clamp(28px,5vw,40px)' }}>Speak messy. Get it polished.</h2>
            <p className="lbl" style={{ fontSize: 15, margin: '6px 0 16px' }}>
              Dictate a reply, an email or a quick note. MeetNotes removes the umms, fixes the grammar and formats it for where it&apos;s going.
            </p>
            <div className="rec">
              <button className={`mic ${flowRec ? 'live' : ''}`} onClick={toggleFlow} aria-label={flowRec ? 'Stop dictation' : 'Start dictation'}>
                {flowRec ? <StopIcon /> : <MicIcon />}
              </button>
              <textarea rows={5} value={raw} onChange={(e) => setRaw(e.target.value)} placeholder={flowRec ? 'Listening… tap stop when you finish.' : 'Tap the mic and speak, or type here.'} aria-label="Dictated text" />
            </div>
            <div className="chips">
              <span className="lbl">Format as:</span>
              {FLOW_STYLES.map((s) => (
                <button key={s.id} className="chip" aria-pressed={s.id === style} onClick={() => setStyle(s.id)}>{s.label}</button>
              ))}
            </div>
            <div className="row">
              <button className="btn" onClick={polish} disabled={!!flowBusy}>{flowBusy || 'Polish it'}</button>
              <button className="btn o" onClick={() => copy(polished)} disabled={!polished}>Copy</button>
              <button className="btn o" onClick={() => { setRaw(''); setPolished(''); }}>Clear</button>
            </div>
            <div className="out">{polished || <span className="lbl">Polished text appears here.</span>}</div>
          </section>
        )}

        {tab === 'saved' && (
          <section>
            <h2 style={{ fontSize: 'clamp(28px,5vw,40px)' }}>Saved meetings</h2>
            <p className="lbl" style={{ margin: '6px 0 12px' }}>Only you can see these.</p>
            <div className="list">
              {saved === 'loading' && <p className="lbl">Loading…</p>}
              {saved === 'error' && <p className="lbl">Could not load your meetings. <button className="btn o sm" onClick={loadSaved}>Try again</button></p>}
              {Array.isArray(saved) && saved.length === 0 && <p className="empty">No saved meetings yet. Record one and tap “Generate meeting notes”.</p>}
              {Array.isArray(saved) &&
                saved.map((m) => (
                  <div className="it" key={m.id}>
                    <button className="open" onClick={() => openMeeting(m.id)}>{m.title}</button>
                    <small>
                      {new Date(m.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                      {m.duration_sec ? ` · ${Math.max(1, Math.round(m.duration_sec / 60))} min` : ''}
                    </small>
                    <button className="btn o sm" onClick={() => removeMeeting(m.id)} aria-label={`Delete ${m.title}`}>Delete</button>
                  </div>
                ))}
            </div>
          </section>
        )}
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

function Section({ title, items }) {
  return (
    <>
      <h3>{title}</h3>
      {items?.length ? <ul>{items.map((x, i) => <li key={i}>{x}</li>)}</ul> : <p className="lbl">None recorded.</p>}
    </>
  );
}
