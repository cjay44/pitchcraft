import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const FREE_LIMIT = 10;

/* ── data helpers ── */
function getUsageData() {
  try {
    const raw = sessionStorage.getItem('pc_usage');
    if (!raw) return { count: 0, month: null };
    const parsed = JSON.parse(raw);
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (parsed.month && parsed.month !== currentMonth) return { count: 0, month: currentMonth };
    return parsed;
  } catch { return { count: 0, month: null }; }
}

function getUsageDetail() {
  try {
    const raw = sessionStorage.getItem('pc_usage_detail');
    if (!raw) return { proposal: 0, followup: 0, invoice: 0 };
    return JSON.parse(raw);
  } catch { return { proposal: 0, followup: 0, invoice: 0 }; }
}

function getDaysRemaining() {
  try {
    const raw = localStorage.getItem('pc_beta_activated');
    const activated = raw ? new Date(raw) : new Date();
    const expiry = new Date(activated);
    expiry.setDate(expiry.getDate() + 28);
    const diff = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(28, diff));
  } catch { return 28; }
}

/* ── Beta Banner ── */
function BetaBanner() {
  const daysRemaining = useMemo(() => getDaysRemaining(), []);
  return (
    <div style={s.betaBanner}>
      <div style={s.betaLeft}>
        <div style={s.betaDotWrap}>
          <div style={s.betaDot} />
          <div style={s.betaDotPulse} />
        </div>
        <div>
          <div style={s.betaTitle}>Beta access active</div>
          <div style={s.betaSub}>Unlimited generations — your feedback is shaping the product</div>
        </div>
      </div>
      <div style={s.betaRight}>
        <div style={s.betaDaysNum}>{daysRemaining}</div>
        <div style={s.betaDaysLabel}>days remaining</div>
      </div>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon, label, count, color, bg, border, sub }) {
  return (
    <div style={{ ...s.statCard, background: bg, borderColor: border }}>
      <div style={s.statIcon}>{icon}</div>
      <div style={{ ...s.statCount, color }}>{count}</div>
      <div style={s.statLabel}>{label}</div>
      <div style={s.statSub}>{sub}</div>
    </div>
  );
}

/* ── Usage Breakdown ── */
function UsageBreakdown({ detail }) {
  const total = detail.proposal + detail.followup + detail.invoice;
  const rows = [
    { label: 'Proposals',              count: detail.proposal, color: '#2D6A4F' },
    { label: 'Follow-Up sequences',    count: detail.followup, color: '#1D4ED8' },
    { label: 'Invoice reminders',      count: detail.invoice,  color: '#B45309' },
  ];
  return (
    <div style={s.card}>
      <div style={s.cardTitleRow}>
        <div>
          <div style={s.cardTitle}>Usage breakdown</div>
          <div style={s.cardSub}>Which tools you've reached for most this session</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '8px 12px', background: '#fdf6ed', borderRadius: 8, border: '1px solid #f5d9a8' }}>
        <span style={{ fontSize: 13 }}>ℹ️</span>
        <span style={{ fontSize: 12, color: '#B45309', fontWeight: 400, lineHeight: 1.5 }}>
          Stats reset when you close your browser. Persistent history launches with user accounts in Sprint 4.
        </span>
      </div>
      {total === 0 ? (
        <p style={s.emptyState}>No generations yet this session — head to the app to get started.</p>
      ) : (
        <div style={s.breakdownList}>
          {rows.map(r => (
            <div key={r.label} style={s.breakdownRow}>
              <div style={s.breakdownMeta}>
                <span style={s.breakdownLabel}>{r.label}</span>
                <span style={{ ...s.breakdownCount, color: r.color }}>{r.count}</span>
              </div>
              <div style={s.barTrack}>
                <div style={{ ...s.barFill, width: `${(r.count / total) * 100}%`, background: r.color }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── CRM Teaser ── */
const PIPELINE_ROWS = [
  { client: 'Bloom Studio',   status: 'Won',  statusColor: '#2D6A4F', statusBg: '#f0f7f4', statusBorder: '#b7ddd0', value: '$3,200' },
  { client: 'Luma Creative',  status: 'Sent', statusColor: '#1D4ED8', statusBg: '#f0f4ff', statusBorder: '#bcceff', value: '$1,800' },
  { client: 'Oak & Pine Co.', status: 'Sent', statusColor: '#1D4ED8', statusBg: '#f0f4ff', statusBorder: '#bcceff', value: '$5,500' },
  { client: 'The Brand House', status: 'Lost', statusColor: '#c0392b', statusBg: '#fff0f0', statusBorder: '#f5bcbc', value: '$2,100' },
];

const CRM_FEATURES = [
  '📤 Proposals sent',
  '🏆 Proposals won',
  '📉 Proposals lost',
  '💰 Revenue tracked',
  '🎯 Win rate by tone',
  '📅 Average close time',
];

function CrmTeaser() {
  return (
    <div style={s.crmCard}>
      <div style={s.crmInner}>

        {/* Left — copy */}
        <div style={s.crmLeft}>
          <div style={s.crmEyebrow}>Coming in Sprint 4</div>
          <h2 style={s.crmHeading}>Know exactly which proposals win</h2>
          <p style={s.crmBody}>
            Once user accounts launch, Pitchcraft will track the full lifecycle of every
            proposal you send. You'll finally know your win rate, which tone converts best,
            and how much revenue your proposals have generated.
          </p>
          <div style={s.crmFeaturesGrid}>
            {CRM_FEATURES.map(f => (
              <div key={f} style={s.crmFeature}>{f}</div>
            ))}
          </div>
          <Link to="/roadmap" style={s.crmCta}>See full roadmap →</Link>
        </div>

        {/* Right — mock pipeline */}
        <div style={s.crmRight}>
          <div style={s.pipelineCard}>
            <div style={s.pipelineHeader}>Proposal pipeline</div>
            <div style={s.pipelineRows}>
              {PIPELINE_ROWS.map(r => (
                <div key={r.client} style={s.pipelineRow}>
                  <span style={s.pipelineClient}>{r.client}</span>
                  <div style={s.pipelineRowRight}>
                    <span style={{ ...s.pipelineBadge, color: r.statusColor, background: r.statusBg, borderColor: r.statusBorder }}>
                      {r.status}
                    </span>
                    <span style={s.pipelineValue}>{r.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={s.pipelineFooter}>
              <span style={s.pipelineWinRate}>Win rate <strong style={{ color: '#4ade80' }}>50%</strong></span>
              <span style={s.pipelineRevenue}>Revenue <strong style={{ color: '#fff' }}>$8,700</strong></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Quick Actions ── */
function QuickActions() {
  const actions = [
    {
      to: '/', icon: '✦', label: 'Generate a proposal',
      desc: 'Write a proposal, follow-up or invoice now',
      bg: '#fff', color: '#1e1e1e', border: '#e8e2d8', subColor: '#8a7f72', iconColor: '#1e1e1e',
    },
    {
      to: '/roadmap', icon: '🗺️', label: 'View the roadmap',
      desc: "See what's coming to Pitchcraft",
      bg: '#1e1e1e', color: '#fff', border: '#1e1e1e', subColor: 'rgba(255,255,255,0.5)', iconColor: '#fff',
    },
    {
      to: '/feedback', icon: '💬', label: 'Leave feedback',
      desc: 'Your input shapes what we build next',
      bg: '#f0f7f4', color: '#2D6A4F', border: '#b7ddd0', subColor: '#5a9e7a', iconColor: '#2D6A4F',
    },
  ];
  return (
    <div style={s.actionsGrid}>
      {actions.map(a => (
        <Link key={a.to} to={a.to} style={{ ...s.actionCard, background: a.bg, borderColor: a.border, color: a.color }}>
          <div style={{ ...s.actionIcon, color: a.iconColor }}>{a.icon}</div>
          <div style={{ ...s.actionLabel, color: a.color }}>{a.label}</div>
          <div style={{ ...s.actionDesc, color: a.subColor }}>{a.desc}</div>
        </Link>
      ))}
    </div>
  );
}

/* ── Main export ── */
export default function DashboardPage({ isBeta }) {
  const usage  = getUsageData();
  const detail = getUsageDetail();
  const total  = usage.count || 0;
  const FREE_REMAINING = Math.max(FREE_LIMIT - total, 0);

  return (
    <div style={s.page}>
      <div style={s.bgTexture} />
      <main style={s.main}>

        {/* Hero */}
        <div style={s.hero}>
          <div style={s.heroLabel}>Your Dashboard</div>
          <h1 style={s.heroTitle}>Here's how you're going</h1>
          <p style={s.heroSub}>These stats reflect your current session only. Persistent tracking across sessions is coming in Sprint 4 when user accounts launch.</p>
        </div>

        {/* Beta banner */}
        {isBeta && <BetaBanner />}

        {/* Stat cards */}
        <div style={s.statsGrid}>
          <StatCard
            icon="✦" label="Total generated" count={total} color="#1e1e1e"
            bg="#fff" border="#e8e2d8"
            sub={isBeta ? 'Unlimited on beta' : `${FREE_REMAINING} remaining`}
          />
          <StatCard
            icon="📄" label="Proposals" count={detail.proposal} color="#2D6A4F"
            bg="#f0f7f4" border="#b7ddd0"
            sub="Client proposals drafted"
          />
          <StatCard
            icon="✉️" label="Follow-Ups" count={detail.followup} color="#1D4ED8"
            bg="#f0f4ff" border="#bcceff"
            sub="Email sequences created"
          />
          <StatCard
            icon="💰" label="Invoices" count={detail.invoice} color="#B45309"
            bg="#fdf6ed" border="#f5d9a8"
            sub="Reminders drafted"
          />
        </div>

        {/* Usage breakdown */}
        <UsageBreakdown detail={detail} />

        {/* CRM teaser */}
        <CrmTeaser />

        {/* Quick actions */}
        <QuickActions />

      </main>
    </div>
  );
}

/* ── Styles ── */
const s = {
  page:      { minHeight: '100vh', background: '#f5f1eb', position: 'relative', overflowX: 'hidden' },
  bgTexture: { position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(180,160,120,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(120,100,80,0.06) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 },
  main:      { position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '56px 24px 80px' },

  /* Hero */
  hero:      { marginBottom: 36 },
  heroLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a09488', marginBottom: 10 },
  heroTitle: { fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(30px, 5vw, 44px)', color: '#1e1e1e', lineHeight: 1.15, marginBottom: 10 },
  heroSub:   { fontSize: 15, color: '#6b6058', fontWeight: 300, lineHeight: 1.7, maxWidth: 520 },

  /* Beta banner */
  betaBanner:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, background: '#f0f7f4', border: '1.5px solid #b7ddd0', borderRadius: 16, padding: '20px 28px', marginBottom: 28 },
  betaLeft:     { display: 'flex', alignItems: 'center', gap: 16 },
  betaDotWrap:  { position: 'relative', width: 14, height: 14, flexShrink: 0 },
  betaDot:      { position: 'absolute', inset: 0, margin: 'auto', width: 10, height: 10, borderRadius: '50%', background: '#2D6A4F' },
  betaDotPulse: { position: 'absolute', inset: -2, borderRadius: '50%', border: '2px solid #2D6A4F', opacity: 0.35, animation: 'none' },
  betaTitle:    { fontSize: 14, fontWeight: 700, color: '#2D6A4F', marginBottom: 3 },
  betaSub:      { fontSize: 13, color: '#5a9e7a', fontWeight: 300 },
  betaRight:    { textAlign: 'right', flexShrink: 0 },
  betaDaysNum:  { fontFamily: "'DM Serif Display', serif", fontSize: 44, color: '#2D6A4F', lineHeight: 1 },
  betaDaysLabel:{ fontSize: 11, color: '#5a9e7a', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 },

  /* Stats grid */
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 },
  statCard:  { borderRadius: 16, border: '1.5px solid', padding: '22px 16px 18px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  statIcon:  { fontSize: 22, marginBottom: 12 },
  statCount: { fontFamily: "'DM Serif Display', serif", fontSize: 40, lineHeight: 1, marginBottom: 6 },
  statLabel: { fontSize: 11, color: '#8a7f72', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 },
  statSub:   { fontSize: 11, color: '#a09488', fontWeight: 300 },

  /* Card base */
  card:       { background: '#fff', borderRadius: 20, padding: '28px 32px', boxShadow: '0 2px 20px rgba(0,0,0,0.05)', marginBottom: 20 },
  cardTitleRow:{ marginBottom: 22 },
  cardTitle:  { fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#1e1e1e', marginBottom: 4 },
  cardSub:    { fontSize: 13, color: '#8a7f72', fontWeight: 300 },
  emptyState: { fontSize: 14, color: '#a09488', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' },

  /* Usage breakdown */
  breakdownList:  { display: 'flex', flexDirection: 'column', gap: 18 },
  breakdownRow:   { display: 'flex', flexDirection: 'column', gap: 7 },
  breakdownMeta:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  breakdownLabel: { fontSize: 13, fontWeight: 500, color: '#5a5048' },
  breakdownCount: { fontSize: 14, fontWeight: 700 },
  barTrack:       { height: 6, background: '#f0ebe3', borderRadius: 100, overflow: 'hidden' },
  barFill:        { height: '100%', borderRadius: 100, transition: 'width 0.6s ease' },

  /* CRM teaser */
  crmCard:    { background: '#1e1e1e', borderRadius: 20, padding: '40px', marginBottom: 20, overflow: 'hidden' },
  crmInner:   { display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' },
  crmLeft:    { flex: '1 1 280px', minWidth: 0 },
  crmEyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4ade80', marginBottom: 12 },
  crmHeading: { fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(22px, 3vw, 30px)', color: '#fff', lineHeight: 1.2, marginBottom: 14 },
  crmBody:    { fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 300, lineHeight: 1.8, marginBottom: 22 },
  crmFeaturesGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: 28 },
  crmFeature: { fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 400 },
  crmCta:     { display: 'inline-block', background: '#fff', color: '#1e1e1e', borderRadius: 10, padding: '11px 22px', fontSize: 13, fontWeight: 700, textDecoration: 'none' },

  /* Pipeline mock card */
  crmRight:       { flex: '1 1 240px', minWidth: 220 },
  pipelineCard:   { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 22px', backdropFilter: 'blur(10px)' },
  pipelineHeader: { fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 },
  pipelineRows:   { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 },
  pipelineRow:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  pipelineClient: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  pipelineRowRight:{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  pipelineBadge:  { fontSize: 10, fontWeight: 700, borderRadius: 100, padding: '2px 8px', border: '1px solid' },
  pipelineValue:  { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600 },
  pipelineFooter: { borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' },
  pipelineWinRate:{ fontSize: 12, color: 'rgba(255,255,255,0.45)' },
  pipelineRevenue:{ fontSize: 12, color: 'rgba(255,255,255,0.45)' },

  /* Quick actions */
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  actionCard:  { display: 'block', borderRadius: 16, border: '1.5px solid', padding: '22px 20px', textDecoration: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  actionIcon:  { fontSize: 22, marginBottom: 12 },
  actionLabel: { fontFamily: "'DM Serif Display', serif", fontSize: 17, marginBottom: 6 },
  actionDesc:  { fontSize: 12, fontWeight: 300, lineHeight: 1.6 },
};
