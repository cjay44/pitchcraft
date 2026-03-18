import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Nav({ isBeta }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <header style={s.header} className="pc-header">
      <Link to="/" style={s.logoRow} onClick={close}>
        <div>
          <div style={s.logoText}>Pitchcraft</div>
          <div style={s.logoSub} className="pc-logo-sub">For freelance designers · Australia</div>
        </div>
      </Link>

      <button
        className="pc-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        aria-controls="pc-nav-menu"
        style={s.hamburger}
      >
        <span className={`pc-ham-line${menuOpen ? ' pc-ham-open-1' : ''}`} />
        <span className={`pc-ham-line${menuOpen ? ' pc-ham-open-2' : ''}`} />
        <span className={`pc-ham-line${menuOpen ? ' pc-ham-open-3' : ''}`} />
      </button>

      <nav id="pc-nav-menu" style={s.nav} className={`pc-nav${menuOpen ? ' open' : ''}`}>
        <Link to="/"           onClick={close} style={{ ...s.navLink, ...(pathname === "/"           ? s.navActive : {}) }}>Craft</Link>
        <Link to="/dashboard"  onClick={close} style={{ ...s.navLink, ...(pathname === "/dashboard"  ? s.navActive : {}) }}>Dashboard</Link>
        <Link to="/roadmap"    onClick={close} style={{ ...s.navLink, ...(pathname === "/roadmap"    ? s.navActive : {}) }}>Roadmap</Link>
        <Link to="/pricing"    onClick={close} style={{ ...s.navLink, ...(pathname === "/pricing"    ? s.navActive : {}) }}>Pricing</Link>
        <Link to="/feedback"   onClick={close} style={{ ...s.navLink, ...(pathname === "/feedback"   ? s.navActive : {}) }}>Feedback</Link>
        {isBeta && (
          <div style={s.betaPill} className="pc-beta-pill">
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
  hamburger: { background: 'none', border: 'none', cursor: 'pointer', padding: 4 },
  logoRow:  { display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' },
  logoMark: {
    width: 36, height: 36, background: '#1e1e1e', color: '#f5f1eb',
    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', flexShrink: 0,
  },
  logoText: { fontFamily: "'DM Serif Display', serif", fontSize: 19, color: '#1e1e1e', lineHeight: 1.2 },
  logoSub:  { fontSize: 10, color: '#6b6058', letterSpacing: '0.05em', textTransform: 'uppercase' },
  nav:      { display: 'flex', alignItems: 'center', gap: 24 },
  navLink:  { fontSize: 14, color: '#6b6058', fontWeight: 400, transition: 'color 0.15s' },
  navActive:{ color: '#1e1e1e', fontWeight: 600 },
  betaPill: {
    display: 'flex', alignItems: 'center', gap: 7,
    background: '#f0f7f4', border: '1.5px solid #b7ddd0',
    borderRadius: 100, padding: '6px 14px',
    fontSize: 12, fontWeight: 600, color: '#2D6A4F',
  },
  betaDot: { width: 7, height: 7, borderRadius: '50%', background: '#2D6A4F', flexShrink: 0 },
};
