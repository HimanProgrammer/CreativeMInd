import Brand from '@/components/meetnotes/Brand';
import { MEETNOTES } from '@/lib/meetnotes/config';

export const metadata = { title: 'MeetNotes — AI meeting notes for Indian businesses' };

const FEATURES = [
  ['Understands Hinglish', 'Built for how Indian teams actually talk — Hindi, English or both in one sentence.'],
  ['Notes in one tap', 'Summary, decisions, action items with owners and dates, and open questions.'],
  ['Follow-up ready', 'A polite WhatsApp or email follow-up written for you, ready to send.'],
  ['Upload any recording', 'Zoom, Google Meet, phone-call or voice-note recordings — drop the file in.'],
  ['Voice Flow', 'Speak messy, get polished text: clean replies, emails or bullet notes, or translate.'],
  ['Private by default', 'Your meetings are visible only to your account. Audio is not stored.'],
];

const wa = (text) => `https://wa.me/${MEETNOTES.whatsapp}?text=${encodeURIComponent(text)}`;

export default function MeetNotesLanding() {
  return (
    <>
      <div className="navy">
        <div className="wrap">
          <header className="top">
            <Brand light />
            <nav style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a className="btn o sm" href="#pricing">Pricing</a>
              <a className="btn sm" href="/meetnotes/app/">Open app</a>
            </nav>
          </header>
          <div className="hero">
            <div>
              <h1>Your meetings, written up before you hang up.</h1>
              <p className="lead">
                MeetNotes listens to your client calls and team meetings, then gives you a clean summary, every decision,
                who does what by when — and the follow-up message to send. In Hinglish, English or Hindi.
              </p>
              <div className="ctas">
                <a className="btn" href="/meetnotes/app/">Start free — 60 min/month</a>
                <a className="btn o" href={wa('Hi, I want a MeetNotes demo')}>Get a demo on WhatsApp</a>
              </div>
              <small>Works in the browser on phone and laptop. Install it like an app — no Play Store needed.</small>
            </div>
            <div className="demo" aria-label="Example of MeetNotes output">
              <div className="bar">
                <span className="dot" />
                <strong>Client call — Sharma Jewellers</strong>
                <span className="lbl" style={{ marginLeft: 'auto' }}>12:48</span>
              </div>
              <div className="ln"><span>00:42</span><span><b>Client:</b> Website mein online booking bhi chahiye.</span></div>
              <div className="ln"><span>03:15</span><span><b>Me:</b> Theek hai, Diwali se pehle live kar denge.</span></div>
              <div className="ln"><span>07:30</span><span><b>Client:</b> Budget ₹40,000 tak rakhte hain.</span></div>
              <h3>Action items</h3>
              <ul>
                <li>Send website + booking quote — Me, by Friday</li>
                <li>Share 20 product photos — Client</li>
              </ul>
              <p className="lbl" style={{ marginTop: 10 }}>Example meeting for illustration.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="band">
        <div className="wrap">
          <h2>Everything a busy owner forgets after a call — captured.</h2>
          <div className="feats">
            {FEATURES.map(([h, p]) => (
              <div className="feat" key={h}>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band navy">
        <div className="wrap">
          <h2>How it works</h2>
          <div className="steps">
            <div><h3>Tap record</h3><p>Keep your phone or laptop near the meeting, or upload a recording afterwards.</p></div>
            <div><h3>Watch it write</h3><p>The transcript fills in every few seconds. Tag who is speaking with one tap.</p></div>
            <div><h3>Get your notes</h3><p>Summary, decisions, action items and a follow-up message — copy, download or share on WhatsApp.</p></div>
          </div>
        </div>
      </section>

      <section className="band" id="pricing">
        <div className="wrap">
          <h2>Simple monthly plans</h2>
          <div className="plans">
            {MEETNOTES.plans.map((p) => (
              <div className={`plan ${p.highlight ? 'hi' : ''}`} key={p.id}>
                <h3 style={{ fontSize: 24 }}>{p.name}</h3>
                <div className="price">{p.price} <small>{p.per}</small></div>
                <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                {p.id === 'free' ? (
                  <a className="btn o" href="/meetnotes/app/">Start free</a>
                ) : (
                  <a className="btn" href={wa(`Hi, I want the MeetNotes ${p.name} plan`)}>Choose {p.name}</a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="navy">
        <div className="wrap">
          <footer>
            <Brand light />
            <span>MeetNotes is a Creative Mind IT Solutions product · WhatsApp +91 78881 13974</span>
          </footer>
        </div>
      </div>
    </>
  );
}
