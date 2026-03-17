import { Link, useLocation } from 'react-router-dom';

export default function Nav({ isBeta }) {
  const { pathname } = useLocation();

  return (
    <header style={s.header}>
      <Link to="/" style={s.logoRow}>
        <div style={s.logoMark}>PC</div>
        <div>
          <div style={s.logoText}>Pitchcraft</div>
          <div style={s.logoSub}>For freelance designers · Australia</div>
        </div>
      </Link>

      <nav style={s.nav}>
        <Link to="/"        style={{ ...s.navLink, ...(pathname === "/"        ? s.navActive : {}) }}>App</Link>
        <Link to="/pricing" style={{ ...s.navLink, ...(pathname === "/pricing" ? s.navActive : {}) }}>Pricing</Link>
        <Link to="/feedback" style={{ ...s.navLink, ...(pathname === "/feedback" ? s.navActive : {}) }}>Feedback</Link>
        {!isBeta && (
          <Link to="/pricing" style={s.navCta}>Upgrade to Pro →</Link>
        )}
        {isBeta && (
          <div style={s.betaPill}>
            <span style={s.betaDot} />
            Beta access active
          </div>
        )}
      </nav>
    </header>
  );
}

const s = {
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    padding: '18px 40px',
    borderBottom: '1px solid rgba(0,0,0,0.07)',
    background: 'rgba(245,241,235,0.96)',
    backdropFilter: 'blur(10px)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logoRow:  { display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' },
  logoMark: {
    width: 36, height: 36, background: '#1e1e1e', color: '#f5f1eb',
    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', flexShrink: 0,
  },
  logoText: { fontFamily: "'DM Serif Display', serif", fontSize: 19, color: '#1e1e1e', lineHeight: 1.2 },
  logoSub:  { fontSize: 10, color: '#8a7f72', letterSpacing: '0.05em', textTransform: 'uppercase' },
  nav:      { display: 'flex', alignItems: 'center', gap: 24 },
  navLink:  { fontSize: 14, color: '#6b6058', fontWeight: 400, transition: 'color 0.15s' },
  navActive:{ color: '#1e1e1e', fontWeight: 600 },
  navCta:   {
    fontSize: 13, fontWeight: 600, color: '#fff', background: '#1e1e1e',
    padding: '8px 18px', borderRadius: 100, letterSpacing: '0.01em',
    transition: 'opacity 0.18s',
  },
  betaPill: {
    display: 'flex', alignItems: 'center', gap: 7,
    background: '#f0f7f4', border: '1.5px solid #b7ddd0',
    borderRadius: 100, padding: '6px 14px',
    fontSize: 12, fontWeight: 600, color: '#2D6A4F',
  },
  betaDot: { width: 7, height: 7, borderRadius: '50%', background: '#2D6A4F', flexShrink: 0 },
};
