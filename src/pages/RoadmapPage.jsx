import { useState } from 'react';
import { Link } from 'react-router-dom';

const PHASES = [
  {
    phase: 'Live now',
    status: 'live',
    color: '#2D6A4F',
    bg: '#f0f7f4',
    border: '#b7ddd0',
    items: [
      { title: 'Proposal Generator',        tag: 'Core', desc: 'AI-powered client proposals tailored to your project in seconds.' },
      { title: 'Follow-Up Email Sequence',  tag: 'Core', desc: 'A 3-email follow-up sequence spaced across 14 days, friendly never pushy.' },
      { title: 'Invoice Reminder Emails',   tag: 'Core', desc: 'Staged invoice reminders from friendly nudge to firm final notice.' },
      { title: 'Tone Selector',             tag: 'Core', desc: 'Choose Friendly, Professional or Bold before generating — the output genuinely sounds different.' },
      { title: 'Mobile responsive design',  tag: 'Core', desc: 'Works on any screen size, generate proposals from your phone.' },
    ],
  },
  {
    phase: 'In progress',
    status: 'progress',
    color: '#1D4ED8',
    bg: '#f0f4ff',
    border: '#bcceff',
    items: [
      { title: 'Streaming output',    tag: 'Core', desc: 'Watch your proposal write itself word by word.' },
      { title: 'PDF export',          tag: 'Pro',  desc: 'Download your proposal as a formatted PDF ready to attach to an email.' },
      { title: 'Proposal history',    tag: 'Pro',  desc: 'Save and revisit your last 30 days of generated proposals.' },
      { title: 'User accounts',       tag: 'Pro',  desc: 'Sign in to save your details across sessions.' },
    ],
  },
  {
    phase: 'Coming soon',
    status: 'soon',
    color: '#B45309',
    bg: '#fdf6ed',
    border: '#f5d9a8',
    items: [
      { title: 'Brand voice profile',       tag: 'Pro', desc: 'Save your tone, style and signature phrases so every output sounds authentically like you.' },
      { title: 'Direct email send',         tag: 'Pro', desc: 'Send proposals directly from Pitchcraft to your client\'s inbox.' },
      { title: 'Custom proposal templates', tag: 'Pro', desc: 'Save a structure you love and reuse it across projects.' },
      { title: 'Client profile saving',     tag: 'Pro', desc: 'Store client details so you never have to re-enter them.' },
      { title: 'Know which proposals win',  tag: 'Pro', desc: 'Track open rates, acceptance and win rate across your proposals — so you can see exactly what\'s landing with clients and write sharper pitches every time.' },
    ],
  },
  {
    phase: 'On the horizon',
    status: 'horizon',
    color: '#6B6058',
    bg: '#f5f1eb',
    border: '#d5cec4',
    items: [
      { title: 'Agency plan',                    tag: 'Agency', desc: 'Team seats, agentic intake form, human-in-the-loop review queue, white-label output and CRM-lite pipeline.' },
      { title: 'Agentic intake form',            tag: 'Agency', desc: 'Connect your lead form — Pitchcraft automatically drafts a proposal the moment a new enquiry lands.' },
      { title: 'Analytics dashboard',            tag: 'Agency', desc: 'Win rate, average response time, most used templates.' },
      { title: 'Zapier and Make integration',    tag: 'Agency', desc: 'Connect Pitchcraft to any tool in your stack via webhook.' },
      { title: 'Gmail and email integration',    tag: 'Agency', desc: 'Connect your actual email account so proposals send from your own address.' },
    ],
  },
];

const FILTERS = ['All features', 'Core', 'Pro', 'Agency'];

const STATUS_ICONS = {
  live:     '✓',
  progress: '◑',
  soon:     '◎',
  horizon:  '…',
};

function TagPill({ tag, color, bg, border }) {
  return (
    <span style={{ ...s.tag, color, background: bg, borderColor: border }}>{tag}</span>
  );
}

function RoadmapItem({ item, phase, isOpen, onToggle }) {
  return (
    <div
      style={{ ...s.item, borderColor: isOpen ? phase.border : '#f0ebe3', background: isOpen ? phase.bg : '#faf8f5' }}
      onClick={onToggle}
    >
      <div style={s.itemTop}>
        <div style={s.itemLeft}>
          <TagPill tag={item.tag} color={phase.color} bg={phase.bg} border={phase.border} />
          <span style={s.itemTitle}>{item.title}</span>
        </div>
        <span style={{ ...s.itemChevron, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>›</span>
      </div>
      {isOpen && (
        <div style={s.itemDesc}>{item.desc}</div>
      )}
    </div>
  );
}

function PhaseSection({ phase, filter, openItems, toggleItem }) {
  const filtered = filter === 'All features'
    ? phase.items
    : phase.items.filter(i => i.tag === filter);

  if (filtered.length === 0) return null;

  return (
    <div style={s.phaseSection}>
      <div style={s.phaseHeader}>
        <div style={{ ...s.phaseStatusBadge, background: phase.bg, borderColor: phase.border, color: phase.color }}>
          <span>{STATUS_ICONS[phase.status]}</span>
          <span>{phase.phase}</span>
        </div>
        <span style={s.phaseCount}>{filtered.length} feature{filtered.length !== 1 ? 's' : ''}</span>
      </div>
      <div style={s.itemList}>
        {filtered.map((item, i) => {
          const key = `${phase.status}-${i}`;
          return (
            <RoadmapItem
              key={key}
              item={item}
              phase={phase}
              isOpen={!!openItems[key]}
              onToggle={() => toggleItem(key)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const [filter, setFilter]       = useState('All features');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (key) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={s.page}>
      <div style={s.bgTexture} />
      <main style={s.main}>

        <div style={s.hero}>
          <h1 style={s.heroTitle}>What we're building</h1>
          <p style={s.heroSub}>Pitchcraft is moving fast. Here's where we're at and where we're headed — shaped by feedback from designers like you.</p>
        </div>

        {/* Beta tester callout */}
        <div style={s.betaCallout}>
          <div style={s.betaCalloutLeft}>
            <span style={s.betaCalloutIcon}>🙏</span>
            <div>
              <div style={s.betaCalloutTitle}>Beta testers shape this list</div>
              <div style={s.betaCalloutDesc}>Every piece of feedback moves features up, down or off the list entirely. If you want something here, tell us.</div>
            </div>
          </div>
          <Link to="/feedback" style={s.betaCalloutLink}>Leave feedback →</Link>
        </div>

        {/* Filter pills */}
        <div style={s.filterRow}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...s.filterPill,
                background:  filter === f ? '#1e1e1e' : '#fff',
                color:       filter === f ? '#fff'    : '#6b6058',
                borderColor: filter === f ? '#1e1e1e' : '#e8e2d8',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Phases */}
        {PHASES.map(phase => (
          <PhaseSection
            key={phase.status}
            phase={phase}
            filter={filter}
            openItems={openItems}
            toggleItem={toggleItem}
          />
        ))}

        {/* Footer note */}
        <div style={s.footerNote}>
          <div style={s.footerNoteTitle}>A note on timelines</div>
          <p style={s.footerNoteText}>
            We don't publish dates because shipping something right matters more than shipping it fast.
            Items move between phases based on complexity, demand, and what we learn from beta feedback.
          </p>
          <p style={s.footerNoteText}>
            <strong style={{ color: '#5a5048' }}>Pro</strong> features will be included in the Pitchcraft Pro plan ($29/month) — unlimited generations, your brand voice baked in, and everything you need to run your freelance business without the admin overhead.
            {' '}<strong style={{ color: '#5a5048' }}>Agency</strong> features are for studios and teams who need multi-seat access, CRM-lite pipelines, and white-label output.
          </p>
        </div>

      </main>
    </div>
  );
}

const s = {
  page:      { minHeight: '100vh', background: '#f5f1eb', position: 'relative', overflowX: 'hidden' },
  bgTexture: { position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(180,160,120,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(120,100,80,0.06) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 },
  main:      { position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px' },

  hero:      { marginBottom: 32, textAlign: 'center' },
  heroTitle: { fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px, 5vw, 44px)', color: '#1e1e1e', lineHeight: 1.15, marginBottom: 12 },
  heroSub:   { fontSize: 15, color: '#6b6058', fontWeight: 300, lineHeight: 1.7, maxWidth: 500, margin: '0 auto' },

  betaCallout:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', background: '#fff', border: '1.5px solid #e8e2d8', borderRadius: 16, padding: '20px 24px', marginBottom: 28 },
  betaCalloutLeft: { display: 'flex', alignItems: 'flex-start', gap: 14 },
  betaCalloutIcon: { fontSize: 22, flexShrink: 0, lineHeight: 1 },
  betaCalloutTitle:{ fontSize: 14, fontWeight: 700, color: '#1e1e1e', marginBottom: 4 },
  betaCalloutDesc: { fontSize: 13, color: '#6b6058', fontWeight: 300, lineHeight: 1.5 },
  betaCalloutLink: { fontSize: 13, fontWeight: 700, color: '#1e1e1e', background: '#f5f1eb', border: '1.5px solid #e8e2d8', borderRadius: 10, padding: '10px 18px', whiteSpace: 'nowrap', flexShrink: 0 },

  filterRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 },
  filterPill:{ padding: '7px 18px', borderRadius: 100, border: '1.5px solid', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.18s ease', fontFamily: "'DM Sans', sans-serif" },

  phaseSection: { marginBottom: 28 },
  phaseHeader:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  phaseStatusBadge: { display: 'flex', alignItems: 'center', gap: 8, border: '1.5px solid', borderRadius: 100, padding: '5px 14px', fontSize: 13, fontWeight: 700 },
  phaseCount:   { fontSize: 12, color: '#a09488', fontWeight: 500 },

  itemList: { display: 'flex', flexDirection: 'column', gap: 8 },
  item:     { border: '1.5px solid', borderRadius: 12, padding: '14px 18px', cursor: 'pointer', transition: 'all 0.18s ease' },
  itemTop:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  itemLeft: { display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 },
  itemTitle:{ fontSize: 14, fontWeight: 500, color: '#1e1e1e' },
  itemChevron: { fontSize: 20, color: '#a09488', transition: 'transform 0.2s ease', flexShrink: 0, lineHeight: 1 },
  itemDesc: { fontSize: 13, color: '#6b6058', lineHeight: 1.6, fontWeight: 300, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)' },

  tag: { fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', border: '1.5px solid', borderRadius: 100, padding: '2px 9px', flexShrink: 0 },

  footerNote:     { background: '#fff', borderRadius: 20, padding: '28px 32px', boxShadow: '0 2px 20px rgba(0,0,0,0.04)', marginTop: 12 },
  footerNoteTitle:{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#1e1e1e', marginBottom: 12 },
  footerNoteText: { fontSize: 13, color: '#6b6058', lineHeight: 1.8, fontWeight: 300, marginBottom: 10 },
};
