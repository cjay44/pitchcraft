import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const FREE_LIMIT = 10;

function getUsageData() {
  try {
    const raw = sessionStorage.getItem('pc_usage');
    if (!raw) return { count: 0, month: null };
    return JSON.parse(raw);
  } catch { return { count: 0, month: null }; }
}

function getUsageDetail() {
  try {
    const raw = sessionStorage.getItem('pc_usage_detail');
    if (!raw) return { proposal: 0, followup: 0, invoice: 0 };
    return JSON.parse(raw);
  } catch { return { proposal: 0, followup: 0, invoice: 0 }; }
}

function getBetaActivatedDate() {
  try {
    const raw = sessionStorage.getItem('pc_beta_activated');
    if (!raw) return null;
    return new Date(raw);
  } catch { return null; }
}

function BetaBanner() {
  const activatedDate = getBetaActivatedDate();
  const daysRemaining = useMemo(() => {
    if (!activatedDate) return 28;
    const expiry = new Date(activatedDate);
    expiry.setDate(expiry.getDate() + 28);
    const diff = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }, [activatedDate]);

  return (
    <div style={s.betaBanner}>
      <div style={s.betaBannerLeft}>
        <span style={s.betaDot} />
        <span style={s.betaTitle}>Beta access active</span>
        <span style={s.betaDesc}>Unlimited generations · Expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}</span>
      </div>
      <span style={s.betaThanks}>Thank you for helping shape Pitchcraft 🙏</span>
    </div>
  );
}

function StatCard({ emoji, label, count, color, bg, border }) {
  return (
    <div style={{ ...s.statCard, background: bg, borderColor: border }}>
      <div style={s.statEmoji}>{emoji}</div>
      <div style={{ ...s.statCount, color }}>{count}</div>
      <div style={s.statLabel}>{label}</div>
    </div>
  );
}

function UsageBreakdown({ detail }) {
  const total = detail.proposal + detail.followup + detail.invoice || 1;
  const bars = [
    { key: 'proposal', label: 'Proposals',   color: '#2D6A4F', bg: '#f0f7f4', count: detail.proposal },
    { key: 'followup', label: 'Follow-Ups',  color: '#1D4ED8', bg: '#f0f4ff', count: detail.followup },
    { key: 'invoice',  label: 'Invoices',    color: '#B45309', bg: '#fdf6ed', count: detail.invoice  },
  ];
  return (
    <div style={s.section}>
      <div style={s.sectionTitle}>Usage breakdown</div>
      <div style={s.breakdownList}>
        {bars.map(b => (
          <div key={b.key} style={s.breakdownRow}>
            <div style={s.breakdownMeta}>
              <span style={s.breakdownLabel}>{b.label}</span>
              <span style={{ ...s.breakdownCount, color: b.color }}>{b.count}</span>
            </div>
            <div style={s.barTrack}>
              <div style={{ ...s.barFill, width: `${(b.count / total) * 100}%`, background: b.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { to: '/',          emoji: '✦', label: 'Generate',  desc: 'Write a proposal, follow-up or invoice' },
    { to: '/roadmap',   emoji: '◎', label: 'Roadmap',   desc: "See what's coming to Pitchcraft" },
    { to: '/feedback',  emoji: '✉', label: 'Feedback',  desc: 'Share ideas or report a bug' },
  ];
  return (
    <div style={s.section}>
      <div style={s.sectionTitle}>Quick actions</div>
      <div style={s.actionsGrid}>
        {actions.map(a => (
          <Link key={a.to} to={a.to} style={s.actionCard}>
            <div style={s.actionEmoji}>{a.emoji}</div>
            <div style={s.actionLabel}>{a.label}</div>
            <div style={s.actionDesc}>{a.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function UpgradeNudge({ used }) {
  const pct = Math.min((used / FREE_LIMIT) * 100, 100);
  const remaining = Math.max(FREE_LIMIT - used, 0);
  const color = remaining <= 2 ? '#c0392b' : remaining <= 5 ? '#B45309' : '#2D6A4F';
  return (
    <div style={s.upgradeCard}>
      <div style={s.upgradeTop}>
        <div>
          <div style={s.upgradeTitle}>Free plan</div>
          <div style={s.upgradeDesc}>
            {remaining === 0
              ? "You've hit your limit — upgrade to keep generating."
              : `${remaining} of ${FREE_LIMIT} free generations remaining this month.`}
          </div>
        </div>
        <Link to="/pricing" style={s.upgradeCta}>Upgrade to Pro →</Link>
      </div>
      <div style={s.upgradeBarTrack}>
        <div style={{ ...s.upgradeBarFill, width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function DashboardPage({ isBeta }) {
  const usage  = getUsageData();
  const detail = getUsageDetail();
  const total  = usage.count || 0;

  return (
    <div style={s.page}>
      <div style={s.bgTexture} />
      <main style={s.main}>

        <div style={s.hero}>
          <h1 style={s.heroTitle}>Dashboard</h1>
          <p style={s.heroSub}>Your Pitchcraft activity at a glance.</p>
        </div>

        {isBeta && <BetaBanner />}

        {/* Stat cards */}
        <div style={s.statsGrid}>
          <StatCard emoji="⚡" label="Total generated" count={total}             color="#1e1e1e" bg="#fff"     border="#e8e2d8" />
          <StatCard emoji="✦" label="Proposals"        count={detail.proposal}   color="#2D6A4F" bg="#f0f7f4" border="#b7ddd0" />
          <StatCard emoji="✉" label="Follow-Ups"       count={detail.followup}   color="#1D4ED8" bg="#f0f4ff" border="#bcceff" />
          <StatCard emoji="◎" label="Invoices"         count={detail.invoice}    color="#B45309" bg="#fdf6ed" border="#f5d9a8" />
        </div>

        <UsageBreakdown detail={detail} />

        <QuickActions />

        {!isBeta && <UpgradeNudge used={total} />}

      </main>
    </div>
  );
}

const s = {
  page:      { minHeight: '100vh', background: '#f5f1eb', position: 'relative', overflowX: 'hidden' },
  bgTexture: { position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(180,160,120,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(120,100,80,0.06) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 },
  main:      { position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px' },

  hero:      { marginBottom: 32 },
  heroTitle: { fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px, 5vw, 44px)', color: '#1e1e1e', lineHeight: 1.15, marginBottom: 10 },
  heroSub:   { fontSize: 15, color: '#6b6058', fontWeight: 300 },

  betaBanner:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, background: '#f0f7f4', border: '1.5px solid #b7ddd0', borderRadius: 14, padding: '14px 20px', marginBottom: 28 },
  betaBannerLeft:{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  betaDot:       { width: 8, height: 8, borderRadius: '50%', background: '#2D6A4F', flexShrink: 0 },
  betaTitle:     { fontSize: 13, fontWeight: 700, color: '#2D6A4F' },
  betaDesc:      { fontSize: 13, color: '#5a9e7a' },
  betaThanks:    { fontSize: 12, color: '#5a9e7a', fontStyle: 'italic' },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 },
  statCard:  { borderRadius: 16, border: '1.5px solid', padding: '20px 16px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  statEmoji: { fontSize: 22, marginBottom: 10 },
  statCount: { fontFamily: "'DM Serif Display', serif", fontSize: 36, lineHeight: 1, marginBottom: 6 },
  statLabel: { fontSize: 11, color: '#8a7f72', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' },

  section:      { background: '#fff', borderRadius: 20, padding: '28px 32px', boxShadow: '0 2px 20px rgba(0,0,0,0.05)', marginBottom: 20 },
  sectionTitle: { fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#1e1e1e', marginBottom: 20 },

  breakdownList: { display: 'flex', flexDirection: 'column', gap: 16 },
  breakdownRow:  { display: 'flex', flexDirection: 'column', gap: 6 },
  breakdownMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  breakdownLabel:{ fontSize: 13, fontWeight: 500, color: '#5a5048' },
  breakdownCount:{ fontSize: 13, fontWeight: 700 },
  barTrack:      { height: 6, background: '#f0ebe3', borderRadius: 100, overflow: 'hidden' },
  barFill:       { height: '100%', borderRadius: 100, transition: 'width 0.5s ease' },

  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  actionCard:  { display: 'block', background: '#faf8f5', border: '1.5px solid #e8e2d8', borderRadius: 14, padding: '20px 18px', textDecoration: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' },
  actionEmoji: { fontSize: 22, marginBottom: 10, color: '#8a7f72' },
  actionLabel: { fontFamily: "'DM Serif Display', serif", fontSize: 16, color: '#1e1e1e', marginBottom: 4 },
  actionDesc:  { fontSize: 12, color: '#8a7f72', fontWeight: 300, lineHeight: 1.5 },

  upgradeCard:    { background: '#1e1e1e', borderRadius: 20, padding: '28px 32px', marginBottom: 20 },
  upgradeTop:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginBottom: 20, flexWrap: 'wrap' },
  upgradeTitle:   { fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#fff', marginBottom: 6 },
  upgradeDesc:    { fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 300, lineHeight: 1.6 },
  upgradeCta:     { background: '#fff', color: '#1e1e1e', borderRadius: 10, padding: '11px 22px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 },
  upgradeBarTrack:{ height: 5, background: 'rgba(255,255,255,0.12)', borderRadius: 100, overflow: 'hidden' },
  upgradeBarFill: { height: '100%', borderRadius: 100, transition: 'width 0.5s ease' },
};
