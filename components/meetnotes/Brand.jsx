// Full Creative Mind logo lockup: real CM logo + "— IT SOLUTIONS —" + tagline.
export default function Brand({ light = true, compact = false }) {
  return (
    <a href="/" className={`mn-lock ${light ? 'on-navy' : 'on-white'} ${compact ? 'compact' : ''}`} aria-label="Creative Mind IT Solutions">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={light ? '/meetnotes/logo-white.png' : '/meetnotes/logo-navy.png'} alt="Creative Mind" />
      <span className="sub">— IT SOLUTIONS —</span>
      {!compact && <span className="tag">Innovate | Implement | Inspire</span>}
    </a>
  );
}
