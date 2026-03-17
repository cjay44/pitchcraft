import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={s.footer} className="pc-footer">
      <div style={s.inner}>
        <div style={s.logoRow}>
          <div style={s.logoMark}>PC</div>
          <span style={s.logoText}>Pitchcraft</span>
        </div>
        <div style={s.tagline}>Craft it in seconds. Send it with confidence.</div>
        <nav style={s.links}>
          <Link to="/"         style={s.link}>App</Link>
          <Link to="/pricing"  style={s.link}>Pricing</Link>
          <Link to="/feedback" style={s.link}>Beta Feedback</Link>
        </nav>
        <div style={s.meta}>© 2026 Pitchcraft · Built for freelance designers</div>
      </div>
    </footer>
  );
}

const s = {
  footer: { borderTop: '1px solid rgba(0,0,0,0.07)', background: 'rgba(245,241,235,0.8)', padding: '40px 24px 48px', marginTop: 40 },
  inner:  { maxWidth: 720, margin: '0 auto', textAlign: 'center' },
  logoRow:{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 10 },
  logoMark: { width: 28, height: 28, background: '#1e1e1e', color: '#f5f1eb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 },
  logoText: { fontFamily: "'DM Serif Display', serif", fontSize: 16, color: '#1e1e1e' },
  tagline:  { fontSize: 13, color: '#8a7f72', fontStyle: 'italic', fontFamily: "'DM Serif Display', serif", marginBottom: 16 },
  links:    { display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 16 },
  link:     { fontSize: 13, color: '#8a7f72', transition: 'color 0.15s' },
  meta:     { fontSize: 11, color: '#b0a99a', letterSpacing: '0.04em' },
};
