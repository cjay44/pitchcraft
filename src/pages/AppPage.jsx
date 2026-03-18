import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TABS = ['Proposal', 'Follow-Up', 'Invoice'];
const MAX_NOTES = 500;
const FREE_LIMIT = 10;
const STORAGE_KEY = 'pc_usage';

const TAB_ACCENTS = {
  'Proposal':  { bg: '#f0f7f4', border: '#b7ddd0', badge: '#2D6A4F', label: '#2D6A4F' },
  'Follow-Up': { bg: '#f0f4ff', border: '#bcceff', badge: '#1D4ED8', label: '#1D4ED8' },
  'Invoice':   { bg: '#fdf6ed', border: '#f5d9a8', badge: '#B45309', label: '#B45309' },
};

// ── Tone definitions ─────────────────────────────────────────────────────────
const TONES = [
  {
    id: 'friendly',
    label: 'Friendly',
    emoji: '😊',
    description: 'Warm, conversational and approachable',
    color: '#2D6A4F',
    bg: '#f0f7f4',
    border: '#b7ddd0',
  },
  {
    id: 'professional',
    label: 'Professional',
    emoji: '💼',
    description: 'Polished, confident and business-ready',
    color: '#1e1e1e',
    bg: '#f5f1eb',
    border: '#d5cec4',
  },
  {
    id: 'bold',
    label: 'Bold',
    emoji: '⚡',
    description: 'Direct, punchy and memorable',
    color: '#B45309',
    bg: '#fdf6ed',
    border: '#f5d9a8',
  },
];

const TONE_MODIFIERS = {
  friendly: `TONE — FRIENDLY: Write like a skilled, warm professional having a real conversation. Use the client's name naturally. Sentences can be slightly longer and more relaxed. The client should feel like they're working with someone who genuinely cares about their project, not just completing a transaction. Avoid corporate phrases like "please do not hesitate to contact me." Contractions are fine. End on an encouraging, human note.`,
  professional: `TONE — PROFESSIONAL: Write with quiet authority. Every sentence should be precise and purposeful — no filler, no warmth-padding, but never cold. The client should feel they're dealing with a serious expert who respects their time. No contractions. Formal but not stiff. The proposal should feel like it came from someone who has done this many times and knows exactly what they're doing.`,
  bold: `TONE — BOLD: Write with maximum confidence and minimum words. Short sentences. Active voice only. No hedging phrases like "I believe" or "I think" — state things as facts. The investment section especially should be unapologetic and direct. The client should feel a sense of energy and momentum reading this. Every word must earn its place. Cut anything that doesn't add force.`,
};

// ── System prompts ────────────────────────────────────────────────────────────
const getSystemPrompt = (key, tone = 'professional') => {
  const toneInstruction = TONE_MODIFIERS[tone] || TONE_MODIFIERS.professional;
  const base = {
    proposal: `You are an expert business writer who has written thousands of winning proposals for freelance designers. Your proposals feel personal, structured and easy to scan — the client should feel this was written specifically for them.

Write a compelling project proposal using the information provided. Format it for maximum readability — use clear headings with dividers, bullet points for deliverables, and a clean table layout for the investment breakdown.

Use this exact structure:

PROJECT OVERVIEW
━━━━━━━━━━━━━━━━
Write 2-3 sentences interpreting what the client wants to achieve and why it matters to their business. Reference the client by name. Show you understand their context — do not just restate the inputs.

SCOPE OF WORK
━━━━━━━━━━━━━
List every deliverable on its own line starting with •. Be specific to the project type. Include revision rounds. Example:
• Primary logo design (2 initial concept directions)
• Brand colour palette with hex codes
• Typography system with font pairing
• Brand guidelines document (8-10 pages)
• Final files in print and digital formats

TIMELINE
━━━━━━━━
Break into phases or weeks, one per line starting with •. Match the timeline provided. Example:
• Week 1-2    Discovery, research and initial concepts
• Week 3      Client feedback and refinements
• Week 4      Final artwork, file prep and delivery

INVESTMENT
━━━━━━━━━━
Use a two-column table layout — label on the left, value on the right, separated by multiple spaces. Never apologise for the price. Frame it as value. Example:
Total         $[amount]
Deposit       $[50%] due on project commencement
Balance       $[50%] due on final delivery
Payment       Bank transfer or credit card accepted

NEXT STEPS
━━━━━━━━━━
One single specific action for the client. Make it frictionless and concrete. Example: "To confirm this proposal, simply reply to this email and I'll have the contract and deposit invoice with you within 24 hours."

LENGTH: Scale to scope. Under $1,500: 250-320 words. $1,500-$8,000: 320-420 words. Over $8,000: 420-520 words.

${toneInstruction}

CRITICAL FORMATTING RULES:
- Every section heading must be ALL CAPS followed immediately by a ━━━ divider line (8+ characters)
- Use • to start every bullet point
- Use multiple spaces to create two-column alignment in the Investment section
- No markdown (no #, no **, no ___)
- Do not use the words "just" or "only" before a price`,

    followup: `You are an expert copywriter who writes follow-up emails for freelance designers. Your emails are short, human and never pushy — but strategically written to re-open conversations.

Write a 3-email follow-up sequence for a proposal that has not received a response. Each email must feel completely different — different angle, different energy, different reason to reply.

Format each email clearly with these exact labels and structure:

EMAIL 1 — DAY 3
━━━━━━━━━━━━━━━
Subject: [specific to the project, not generic]

[body — 2-3 sentences max. Warm and light. Assume they're just busy. Just checking the proposal arrived. Do not repeat anything from the proposal.]

EMAIL 2 — DAY 7
━━━━━━━━━━━━━━━
Subject: [lead with a value-add, not "following up"]

[body — 3-4 sentences. Open with one specific insight relevant to their project type — a design consideration, a useful question, or a relevant observation. Then lightly reference the proposal and invite a response.]

EMAIL 3 — DAY 14
━━━━━━━━━━━━━━━━
Subject: [direct and honest]

[body — 3-4 sentences. This is the last nudge. Mention your schedule is booking out. Give them first right of refusal. Leave the door open. Wish them well regardless.]

${toneInstruction}

CRITICAL: Output plain text only. No markdown, no **, no ##. Use the ━━━ dividers exactly as shown above.`,

    invoice: `You are an expert copywriter who writes invoice reminder emails for freelance designers. Professional, respectful, but with clear escalation — being owed money is serious.

Write 3 invoice reminder emails that escalate in firmness. Always reference the project name and invoice amount.

Format each reminder clearly with these exact labels and structure:

REMINDER 1 — 3 DAYS BEFORE DUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subject: [friendly, reference the invoice or project]

[body — 3 sentences. Warm and helpful. Include project name, invoice amount, due date, and how to pay.]

REMINDER 2 — 1 WEEK OVERDUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subject: [clear that payment is now overdue]

[body — 4 sentences. Professional and firm. State the invoice is overdue, the exact amount, how many days past due, payment details, and ask for confirmation of when payment will be made.]

REMINDER 3 — 2 WEEKS OVERDUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subject: Final notice — [project name] invoice

[body — 4-5 sentences. Direct and serious. State this is a final notice. Give exact amount and days overdue. Note that if payment is not received within 5 business days you will need to pursue other options. Provide payment details. Factual, not emotional. THIS EMAIL MUST BE FIRM regardless of the tone setting.]

${toneInstruction}
Note: tone applies to Reminders 1 and 2 only. Reminder 3 must always be firm and direct.

CRITICAL: Output plain text only. No markdown, no **. Use the ━━━ dividers exactly as shown above.`,
  };
  return base[key];
};

function buildUserPrompt(tab, form) {
  const { designerName, clientName, projectType, budget, timeline, notes } = form;
  const base = `Designer Name: ${designerName}\nClient Name: ${clientName}\nProject Type: ${projectType}\nBudget: ${budget || 'Not specified'}\nTimeline: ${timeline || 'Not specified'}\nAdditional Notes: ${notes || 'None'}`;
  if (tab === 'Proposal')  return `Generate a proposal with this info:\n${base}`;
  if (tab === 'Follow-Up') return `Generate a follow-up email sequence for a proposal sent to ${clientName} for a ${projectType} project. Designer name: ${designerName}.`;
  if (tab === 'Invoice')   return `Generate invoice reminder emails. Designer: ${designerName}, Client: ${clientName}, Project: ${projectType}, Amount: ${budget || 'as discussed'}.`;
}

function getUsage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const { count, month } = JSON.parse(raw);
    const now = new Date();
    return month === `${now.getFullYear()}-${now.getMonth()}` ? count : 0;
  } catch { return 0; }
}

function incrementUsage() {
  try {
    const now = new Date();
    const count = getUsage() + 1;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ count, month: `${now.getFullYear()}-${now.getMonth()}` }));
    return count;
  } catch { return 0; }
}

function OutputRenderer({ text }) {
  const lines = text.split('\n');
  const sections = [];
  let currentSection = null;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === '') { i++; continue; }
    // Detect ALL-CAPS section heading
    const isHeading = trimmed.length < 60 &&
      /^[A-Z][A-Z0-9\s\/\-\(\)]{2,}$/.test(trimmed) &&
      !/^[A-Z][a-z]/.test(trimmed);
    // Detect ━━━ or --- divider immediately after a heading
    const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
    const isDivider = /^[━─=\-]{3,}$/.test(nextLine);
    if (isHeading) {
      currentSection = { type: 'section', heading: trimmed, items: [] };
      sections.push(currentSection);
      i++; // skip heading
      if (isDivider) i++; // skip divider
      continue;
    }
    if (!currentSection) {
      currentSection = { type: 'section', heading: null, items: [] };
      sections.push(currentSection);
    }
    // Detect divider line on its own
    if (/^[━─=\-]{3,}$/.test(trimmed)) {
      currentSection.items.push({ type: 'divider' });
      i++;
      continue;
    }
    // Detect bullet: starts with • or - followed by space
    if (/^[•\-]\s/.test(trimmed)) {
      const text = trimmed.replace(/^[•\-]\s+/, '');
      // Detect timeline bullet: "• Week X  description" — tab/multiple spaces
      const timelineMatch = text.match(/^(Week[s]?\s[\d\-–]+|Phase\s\d+|Day\s\d+)\s{2,}(.+)$/i);
      if (timelineMatch) {
        currentSection.items.push({ type: 'timeline', week: timelineMatch[1], task: timelineMatch[2] });
      } else {
        currentSection.items.push({ type: 'bullet', text });
      }
      i++;
      continue;
    }
    // Detect investment table row: "Label    $value" or "Label    value"
    const invMatch = trimmed.match(/^([A-Za-z][A-Za-z\s\/\(\)]{1,30})\s{2,}(\$[\d,]+.*|[\d,]+.*)$/);
    if (invMatch) {
      currentSection.items.push({ type: 'tablerow', label: invMatch[1], value: invMatch[2] });
      i++;
      continue;
    }
    // Regular paragraph text
    currentSection.items.push({ type: 'text', text: trimmed });
    i++;
  }
  // Determine section type for smart rendering
  const renderSection = (sec, idx) => {
    const h = sec.heading ? sec.heading.toLowerCase() : '';
    const hasTableRows = sec.items.some(it => it.type === 'tablerow');
    const hasBullets = sec.items.some(it => it.type === 'bullet');
    const hasTimeline = sec.items.some(it => it.type === 'timeline');
    const isNextSteps = h.includes('next');
    const isInvestment = h.includes('invest') || h.includes('price') || h.includes('fee');
    return (
      <div key={idx} style={s.docSection}>
        {sec.heading && (
          <div style={s.docSectionHeader}>
            <span style={s.docSectionLabel}>{sec.heading}</span>
            <div style={s.docSectionRule} />
          </div>
        )}
        {isInvestment && hasTableRows ? (
          <div style={s.invTable}>
            {sec.items.filter(it => it.type === 'tablerow').map((it, j) => (
              <div key={j} style={{ ...s.invRow, ...(j === 0 ? s.invRowTotal : {}) }}>
                <span style={s.invLabel}>{it.label}</span>
                <span style={{ ...s.invValue, ...(j === 0 ? s.invValueTotal : {}) }}>{it.value}</span>
              </div>
            ))}
            {sec.items.filter(it => it.type === 'text').map((it, j) => (
              <div key={'t' + j} style={s.invRow}>
                <span style={{ ...s.invLabel, color: '#a09488' }}>{it.text}</span>
              </div>
            ))}
          </div>
        ) : hasTimeline ? (
          <div style={s.timelineTable}>
            {sec.items.filter(it => it.type === 'timeline').map((it, j) => (
              <div key={j} style={{ ...s.timelineRow, ...(j === sec.items.filter(x => x.type === 'timeline').length - 1 ? { borderBottom: 'none' } : {}) }}>
                <span style={s.timelineWeek}>{it.week}</span>
                <span style={s.timelineTask}>{it.task}</span>
              </div>
            ))}
          </div>
        ) : isNextSteps ? (
          <div style={s.nextStepsBox}>
            {sec.items.filter(it => it.type === 'text' || it.type === 'bullet').map((it, j) => (
              <p key={j} style={s.nextStepsText}>{it.text}</p>
            ))}
          </div>
        ) : (
          <>
            {sec.items.map((it, j) => {
              if (it.type === 'text')    return <p key={j} style={s.docBodyText}>{it.text}</p>;
              if (it.type === 'divider') return <div key={j} style={s.docDivider} />;
              if (it.type === 'bullet')  return (
                <div key={j} style={s.docBulletRow}>
                  <div style={s.docBulletDot} />
                  <span style={s.docBulletText}>{it.text}</span>
                </div>
              );
              if (it.type === 'tablerow') return (
                <div key={j} style={s.docTableRow}>
                  <span style={s.docTableLabel}>{it.label}</span>
                  <span style={s.docTableValue}>{it.value}</span>
                </div>
              );
              return null;
            })}
          </>
        )}
      </div>
    );
  };
  return <div style={s.docRoot}>{sections.map(renderSection)}</div>;
}

function UsageCounter({ used }) {
  const remaining = Math.max(FREE_LIMIT - used, 0);
  const pct = (used / FREE_LIMIT) * 100;
  const color = remaining <= 2 ? '#c0392b' : remaining <= 5 ? '#B45309' : '#2D6A4F';
  const bgColor = remaining <= 2 ? '#fdf0ef' : remaining <= 5 ? '#fdf6ed' : '#f0f7f4';
  return (
    <div style={{ ...s.usagePill, background: bgColor, borderColor: color + '33' }}>
      <div style={s.usageBarTrack}>
        <div style={{ ...s.usageBarFill, width: `${pct}%`, background: color }} />
      </div>
      <span style={{ ...s.usageText, color }}>
        {remaining === 0 ? 'Limit reached — upgrade to continue' : `${remaining} of ${FREE_LIMIT} free generations remaining`}
      </span>
      {remaining <= 5 && remaining > 0 && (
        <Link to="/pricing" style={{ ...s.usageUpgrade, color }}>Upgrade →</Link>
      )}
    </div>
  );
}

function EmptyState({ tab }) {
  const hints = {
    'Proposal':  { icon: '✦', title: 'Ready to draft your proposal', body: 'Fill in your details above and we\'ll write a polished, professional proposal tailored to your client in seconds.' },
    'Follow-Up': { icon: '✉', title: 'Never let a lead go cold', body: 'Add your project details and we\'ll craft a 3-email follow-up sequence spaced perfectly across 14 days.' },
    'Invoice':   { icon: '◎', title: 'Get paid without the awkwardness', body: 'Tell us the basics and we\'ll write 3 invoice reminder emails — from friendly nudge to firm final notice.' },
  };
  const h = hints[tab];
  return (
    <div style={s.emptyState}>
      <div style={s.emptyIcon}>{h.icon}</div>
      <div style={s.emptyTitle}>{h.title}</div>
      <div style={s.emptyBody}>{h.body}</div>
    </div>
  );
}

function SuccessToast({ show, tab }) {
  return (
    <div style={{ ...s.toast, opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(8px)', pointerEvents: show ? 'auto' : 'none' }}>
      <span style={s.toastDot} />
      Your {tab.toLowerCase()} is ready — review and send when you're happy with it
    </div>
  );
}

function UpgradeModal({ onClose }) {
  return (
    <div style={s.modalOverlay} onClick={onClose}>
      <div style={s.modalCard} onClick={e => e.stopPropagation()}>
        <div style={s.modalIcon}>⚡</div>
        <div style={s.modalTitle}>You've used all 10 free generations</div>
        <div style={s.modalBody}>Upgrade to Pro for unlimited proposals, follow-ups, and invoice reminders — plus brand voice, PDF export, and more.</div>
        <Link to="/pricing" style={s.modalCta} onClick={onClose}>See Pro plan — $29/month</Link>
        <button style={s.modalDismiss} onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}


// ── Send to Client Modal ──────────────────────────────────────────────────────
// ── Tone Selector ─────────────────────────────────────────────────────────────
function ToneSelector({ tone, setTone, loading }) {
  return (
    <div style={ts.wrap}>
      <div style={ts.label}>Tone</div>
      <div style={ts.pills}>
        {TONES.map(t => {
          const active = tone === t.id;
          return (
            <button
              key={t.id}
              onClick={() => !loading && setTone(t.id)}
              disabled={loading}
              title={t.description}
              style={{
                ...ts.pill,
                background: active ? t.color : '#faf8f5',
                borderColor: active ? t.color : '#e8e2d8',
                color: active ? '#fff' : '#6b6058',
                transform: active ? 'translateY(-1px)' : 'translateY(0)',
                boxShadow: active ? `0 4px 12px ${t.color}33` : 'none',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              <span style={{ fontSize: 14 }}>{t.emoji}</span>
              <span style={{ fontWeight: active ? 600 : 400 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const ts = {
  wrap:  { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  label: { fontSize: 12, fontWeight: 600, color: '#5a5048', letterSpacing: '0.04em', textTransform: 'uppercase', flexShrink: 0 },
  pills: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  pill:  {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 16px', borderRadius: 100,
    border: '1.5px solid', fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.18s ease',
  },
};

export default function AppPage({ isBeta, activateBeta }) {
  const [activeTab, setActiveTab]     = useState('Proposal');
  const [tone, setTone]               = useState('professional');
  const [form, setForm]               = useState({ designerName: '', clientName: '', projectType: '', budget: '', timeline: '', notes: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [output, setOutput]           = useState('');
  const [loading, setLoading]         = useState(false);
  const [copied, setCopied]           = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [usage, setUsage]             = useState(getUsage);
  const [betaInput, setBetaInput]     = useState('');
  const [betaError, setBetaError]     = useState(false);
  const outputRef = useRef(null);

  useEffect(() => {
    if (output && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [output]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'notes' && value.length > MAX_NOTES) return;
    setForm({ ...form, [name]: value });
    if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleTabSwitch = (tab) => {
    if (loading) return;
    setActiveTab(tab);
    setOutput('');
    setGlobalError('');
    setFieldErrors({});
    setShowSuccess(false);
  };

  const handleActivateBeta = () => {
    const success = activateBeta(betaInput);
    if (!success) { setBetaError(true); return; }
    setBetaError(false);
    fetch('/api/register-beta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        betaCode: 'CRAFT2026',
        name: form.designerName || '',
        email: '',
      }),
    }).catch(() => {});
  };

  const effectiveLimit = isBeta ? 999 : FREE_LIMIT;
  const atLimit = usage >= effectiveLimit;

  const handleGenerate = async () => {
    if (atLimit) { setShowUpgrade(true); return; }
    const errors = {};
    if (!form.designerName.trim()) errors.designerName = true;
    if (!form.clientName.trim())   errors.clientName   = true;
    if (!form.projectType.trim())  errors.projectType  = true;
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setGlobalError('Please fill in the required fields highlighted below.');
      return;
    }
    setFieldErrors({});
    setGlobalError('');
    setOutput('');
    setShowSuccess(false);
    setLoading(true);
    const systemKey = activeTab === 'Proposal' ? 'proposal' : activeTab === 'Follow-Up' ? 'followup' : 'invoice';
    const systemPrompt = getSystemPrompt(systemKey, tone);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: 'user', content: buildUserPrompt(activeTab, form) }],
        }),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const text = data.content?.map(b => b.text || '').join('') || 'No response received.';
      const newCount = incrementUsage();
      setUsage(newCount);
      setOutput(text);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      if (newCount >= FREE_LIMIT && !isBeta) setTimeout(() => setShowUpgrade(true), 1500);
    } catch (err) {
      setGlobalError(!navigator.onLine
        ? 'No internet connection. Check your network and try again.'
        : 'Something went wrong. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const text = output + (isBeta ? '' : '\n\n— Made with Pitchcraft (pitchcraft.io)');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => fallbackCopy(text));
    } else { fallbackCopy(text); }
  };

  const fallbackCopy = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(el);
    el.focus(); el.select();
    try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (e) { console.error('Copy failed', e); }
    finally { document.body.removeChild(el); }
  };

  const notesLen = form.notes.length;
  const accent   = TAB_ACCENTS[activeTab];
  const tabDescriptions = {
    'Proposal':  'Generate a polished client proposal',
    'Follow-Up': 'Create a 3-email follow-up sequence',
    'Invoice':   'Draft professional invoice reminders',
  };

  return (
    <div style={s.page}>
      <div style={s.bgTexture} />
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      <main style={s.main}>
        {/* Hero */}
        <div style={s.hero}>
          <h1 style={s.heroTitle}>Win more clients.<br />Less writing.</h1>
          <p style={s.heroSub}>AI-generated proposals, follow-ups, and invoices — tailored to your project in seconds. You review. You send.</p>
        </div>

        {/* Beta banner / code entry */}
        {isBeta ? (
          <div style={s.betaBanner}>
            <span style={s.betaDot} />
            <span style={s.betaText}>Beta access active — unlimited generations · Expires in 4 weeks</span>
            <span style={s.betaThankYou}>Thank you for helping shape Pitchcraft 🙏</span>
          </div>
        ) : (
          <div style={s.betaEntry}>
            <span style={s.betaEntryLabel}>Have a beta code?</span>
            <input value={betaInput} onChange={e => { setBetaInput(e.target.value); setBetaError(false); }}
              onKeyDown={e => e.key === 'Enter' && handleActivateBeta()}
              placeholder="Enter code"
              style={{ ...s.betaInput, ...(betaError ? { borderColor: '#f5a0a0' } : {}) }} />
            <button onClick={handleActivateBeta} style={s.betaBtn}>Activate</button>
            {betaError && <span style={s.betaErrMsg}>Invalid code — check your invite email</span>}
          </div>
        )}

        {/* Usage counter */}
        {!isBeta && <UsageCounter used={usage} />}

        {/* Card */}
        <div style={s.card}>
          <div style={s.tabRow}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => handleTabSwitch(tab)} disabled={loading}
                style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}), ...(loading ? s.tabDisabled : {}) }}>
                {tab}
              </button>
            ))}
          </div>
          <p style={s.tabDesc}>{tabDescriptions[activeTab]}</p>

          <div style={s.formGrid}>
            {[
              { name: 'designerName', label: 'Your Name', placeholder: 'e.g. Sarah Chen', required: true },
              { name: 'clientName',   label: 'Client Name', placeholder: 'e.g. Bloom Studio', required: true },
              { name: 'projectType',  label: 'Project Type', placeholder: 'e.g. Brand identity & logo design', required: true },
              { name: 'budget',       label: 'Budget', placeholder: 'e.g. $2,500' },
              { name: 'timeline',     label: 'Timeline', placeholder: 'e.g. 3 weeks' },
            ].map(field => (
              <div key={field.name} style={s.fieldGroup}>
                <label style={s.label}>{field.label}{field.required && <span style={s.required}> *</span>}</label>
                <input name={field.name} value={form[field.name]} onChange={handleChange}
                  placeholder={field.placeholder}
                  style={{ ...s.input, ...(fieldErrors[field.name] ? s.inputError : {}) }} />
                {fieldErrors[field.name] && <span style={s.fieldError}>Required</span>}
              </div>
            ))}

            <div style={{ ...s.fieldGroup, gridColumn: '1 / -1' }}>
              <div style={s.labelRow}>
                <label style={s.label}>Additional Notes</label>
                <span style={{ ...s.charCounter, color: notesLen >= MAX_NOTES ? '#c0392b' : notesLen >= MAX_NOTES * 0.8 ? '#B45309' : '#b0a99a' }}>
                  {notesLen} / {MAX_NOTES}
                </span>
              </div>
              <textarea name="notes" value={form.notes} onChange={handleChange}
                placeholder="Any special requirements, client context, or tone preferences..."
                style={{ ...s.input, ...s.textarea }} />
            </div>
          </div>

          {globalError && (
            <div style={s.errorBanner}>
              <span style={s.errorIcon}>!</span>{globalError}
            </div>
          )}

          <ToneSelector tone={tone} setTone={setTone} loading={loading} />

          <button onClick={handleGenerate} disabled={loading || atLimit}
            style={{ ...s.generateBtn, ...(loading || atLimit ? s.generateBtnDisabled : {}) }}>
            {loading
              ? <span style={s.loadingRow}><span style={s.spinner} />Generating your {activeTab.toLowerCase()}...</span>
              : atLimit ? 'Upgrade to Pro to continue' : `Generate ${activeTab}`}
          </button>
        </div>

        <SuccessToast show={showSuccess} tab={activeTab} />

        {output || loading ? (
          <div ref={outputRef} style={{ ...s.outputCard, borderTop: `3px solid ${accent.border}` }}>
            <div style={{ ...s.outputHeaderRow, background: accent.bg }}>
              <div style={s.outputTitleRow}>
                <span style={{ ...s.outputBadge, background: accent.badge }}>{activeTab}</span>
                <span style={s.outputTitle}>Output</span>
              </div>
              {output && (
                <button onClick={handleCopy} style={{ ...s.copyBtn, color: copied ? accent.label : '#5a5048' }}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <div style={s.outputBody}>
              {loading ? (
                <div style={s.skeleton}>
                  {[100, 85, 92, 70, 88, 60].map((w, i) => (
                    <div key={i} style={{ ...s.skeletonLine, width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              ) : (
                <>
                  <OutputRenderer text={output} />
                  {!isBeta && (
                    <div style={s.watermark}>
                      Made with <Link to="/" style={s.watermarkLink}>Pitchcraft</Link> · Free plan ·{' '}
                      <Link to="/pricing" style={s.watermarkLink}>Upgrade to remove</Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <EmptyState tab={activeTab} />
        )}

        {/* Pricing teaser */}
        {!isBeta && (
          <div style={s.pricingTeaser}>
            <div style={s.pricingTeaserInner}>
              <div style={s.pricingTeaserLeft}>
                <div style={s.pricingTeaserLabel}>Pitchcraft Pro</div>
                <div style={s.pricingTeaserTitle}>Unlimited generations.<br />Your voice. Your brand.</div>
                <div style={s.pricingTeaserBody}>Brand voice profile, 30-day history, PDF export, direct email send, and no watermark.</div>
              </div>
              <div style={s.pricingTeaserRight}>
                <div style={s.pricingPrice}>$29<span style={s.pricingPeriod}>/mo</span></div>
                <Link to="/pricing" style={s.pricingCta}>See Pro plan</Link>
                <div style={s.pricingMeta}>No contracts · Cancel anytime</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const s = {
  page:      { minHeight: '100vh', background: '#f5f1eb', position: 'relative', overflowX: 'hidden' },
  bgTexture: { position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(180,160,120,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(120,100,80,0.06) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 },
  main:      { position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px', animation: 'fadeUp 0.5s ease forwards' },
  hero:      { textAlign: 'center', marginBottom: 28 },
  heroTitle: { fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(36px, 6vw, 52px)', color: '#1e1e1e', lineHeight: 1.15, marginBottom: 14 },
  heroSub:   { fontSize: 16, color: '#6b6058', lineHeight: 1.6, fontWeight: 300, maxWidth: 480, margin: '0 auto' },
  betaBanner:{ display: 'flex', alignItems: 'center', gap: 10, background: '#f0f7f4', border: '1.5px solid #b7ddd0', borderRadius: 12, padding: '10px 16px', marginBottom: 16, flexWrap: 'wrap' },
  betaDot:   { width: 8, height: 8, borderRadius: '50%', background: '#2D6A4F', flexShrink: 0 },
  betaText:  { fontSize: 13, fontWeight: 600, color: '#2D6A4F', flex: 1 },
  betaThankYou: { fontSize: 12, color: '#5a9e7a', fontStyle: 'italic' },
  betaEntry: { display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1.5px solid #e8e2d8', borderRadius: 12, padding: '10px 14px', marginBottom: 16, flexWrap: 'wrap' },
  betaEntryLabel: { fontSize: 13, color: '#6b6058', fontWeight: 500 },
  betaInput: { flex: 1, minWidth: 120, padding: '7px 12px', borderRadius: 8, border: '1.5px solid #e8e2d8', background: '#faf8f5', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', letterSpacing: '0.06em' },
  betaBtn:   { padding: '7px 16px', borderRadius: 8, background: '#1e1e1e', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600 },
  betaErrMsg:{ fontSize: 11, color: '#c0392b', width: '100%' },
  usagePill: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 12, border: '1.5px solid', marginBottom: 20, flexWrap: 'wrap' },
  usageBarTrack: { width: 80, height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 100, flexShrink: 0 },
  usageBarFill:  { height: '100%', borderRadius: 100, transition: 'width 0.4s ease' },
  usageText:     { fontSize: 13, fontWeight: 500, flex: 1 },
  usageUpgrade:  { fontSize: 12, fontWeight: 700 },
  card:      { background: '#fff', borderRadius: 20, padding: '36px 40px', boxShadow: '0 2px 40px rgba(0,0,0,0.06)', marginBottom: 20 },
  tabRow:    { display: 'flex', gap: 8, marginBottom: 8 },
  tab:       { padding: '8px 20px', borderRadius: 100, border: '1.5px solid #e8e2d8', background: 'transparent', color: '#8a7f72', fontSize: 14, fontWeight: 500 },
  tabActive: { background: '#1e1e1e', borderColor: '#1e1e1e', color: '#fff' },
  tabDisabled: { opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' },
  tabDesc:   { fontSize: 13, color: '#a09488', marginBottom: 28, fontWeight: 300 },
  formGrid:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 24px', marginBottom: 24 },
  fieldGroup:{ display: 'flex', flexDirection: 'column', gap: 4 },
  labelRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  label:     { fontSize: 12, fontWeight: 600, color: '#5a5048', letterSpacing: '0.04em', textTransform: 'uppercase' },
  required:  { color: '#c0392b' },
  charCounter: { fontSize: 11, transition: 'color 0.2s ease' },
  input:     { padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e8e2d8', background: '#faf8f5', fontSize: 14, color: '#1e1e1e', fontFamily: "'DM Sans', sans-serif", fontWeight: 400, transition: 'all 0.15s ease' },
  inputError:{ borderColor: '#f5a0a0', background: '#fdf8f8' },
  fieldError:{ fontSize: 11, color: '#c0392b', marginTop: 2, fontWeight: 500 },
  textarea:  { resize: 'vertical', minHeight: 90, lineHeight: 1.5, width: '100%' },
  errorBanner: { display: 'flex', alignItems: 'center', gap: 10, color: '#c0392b', fontSize: 13, marginBottom: 16, padding: '10px 14px', background: '#fdf0ef', borderRadius: 8, border: '1px solid #f5c6c0' },
  errorIcon:   { width: 18, height: 18, borderRadius: '50%', background: '#c0392b', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 },
  generateBtn: { width: '100%', padding: '14px', background: '#1e1e1e', color: '#f5f1eb', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, letterSpacing: '0.02em' },
  generateBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  loadingRow:{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 },
  spinner:   { width: 16, height: 16, border: '2px solid rgba(245,241,235,0.3)', borderTop: '2px solid #f5f1eb', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' },
  toast:     { display: 'flex', alignItems: 'center', gap: 10, background: '#f0f7f4', border: '1.5px solid #b7ddd0', borderRadius: 12, padding: '12px 18px', fontSize: 13, color: '#2D6A4F', fontWeight: 500, marginBottom: 20, transition: 'opacity 0.3s ease, transform 0.3s ease' },
  toastDot:  { width: 8, height: 8, borderRadius: '50%', background: '#2D6A4F', flexShrink: 0 },
  emptyState:{ textAlign: 'center', padding: '48px 32px', background: '#fff', borderRadius: 20, boxShadow: '0 2px 20px rgba(0,0,0,0.04)', marginBottom: 28, border: '1.5px dashed #d5cec4' },
  emptyIcon: { fontSize: 28, marginBottom: 16, color: '#a09488' },
  emptyTitle:{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#1e1e1e', marginBottom: 10 },
  emptyBody: { fontSize: 14, color: '#8a7f72', lineHeight: 1.7, fontWeight: 300, maxWidth: 380, margin: '0 auto' },
  outputCard:{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 40px rgba(0,0,0,0.06)', marginBottom: 28, animation: 'fadeUp 0.4s ease forwards' },
  outputHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid rgba(0,0,0,0.06)' },
  outputTitleRow:  { display: 'flex', alignItems: 'center', gap: 10 },
  outputBadge:     { color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 100 },
  outputTitle:     { fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#1e1e1e' },
  copyBtn:         { padding: '7px 18px', borderRadius: 100, border: '1.5px solid #e8e2d8', background: 'transparent', fontSize: 13, fontWeight: 500, transition: 'all 0.2s ease', cursor: 'pointer' },
  outputBody:      { padding: '20px 24px' },
  docRoot:         { fontFamily: "'DM Sans', sans-serif", padding: '4px 0' },
  docSection:      { marginBottom: 24 },
  docSectionHeader:{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  docSectionLabel: { fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a09488', whiteSpace: 'nowrap' },
  docSectionRule:  { flex: 1, height: '0.5px', background: '#e8e2d8' },
  docBodyText:     { fontSize: 14, lineHeight: 1.8, color: '#1e1e1e', fontWeight: 400, marginBottom: 8 },
  docDivider:      { height: '0.5px', background: '#e8e2d8', margin: '12px 0' },
  docBulletRow:    { display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 7 },
  docBulletDot:    { width: 5, height: 5, borderRadius: '50%', background: '#a09488', flexShrink: 0, marginTop: 8 },
  docBulletText:   { fontSize: 14, lineHeight: 1.75, color: '#1e1e1e', fontWeight: 400 },
  docTableRow:     { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0', borderBottom: '0.5px solid #f0ebe3' },
  docTableLabel:   { fontSize: 13, color: '#6b6058', fontWeight: 500 },
  docTableValue:   { fontSize: 14, color: '#1e1e1e', fontWeight: 500, textAlign: 'right' },
  invTable:        { border: '1.5px solid #e8e2d8', borderRadius: 12, overflow: 'hidden' },
  invRow:          { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid #f0ebe3' },
  invRowTotal:     { background: '#f5f1eb' },
  invLabel:        { fontSize: 13, color: '#6b6058' },
  invValue:        { fontSize: 14, color: '#1e1e1e', fontWeight: 500 },
  invValueTotal:   { fontSize: 16, fontWeight: 700, color: '#1e1e1e' },
  timelineTable:   { border: '1.5px solid #e8e2d8', borderRadius: 12, overflow: 'hidden' },
  timelineRow:     { display: 'flex', gap: 16, alignItems: 'baseline', padding: '9px 16px', borderBottom: '1px solid #f0ebe3' },
  timelineWeek:    { fontSize: 12, color: '#a09488', fontWeight: 600, minWidth: 80, flexShrink: 0 },
  timelineTask:    { fontSize: 14, color: '#1e1e1e', lineHeight: 1.6 },
  nextStepsBox:    { borderLeft: '3px solid #2D6A4F', paddingLeft: 16, background: '#f9fdf9', borderRadius: '0 8px 8px 0', padding: '14px 16px' },
  nextStepsText:   { fontSize: 14, lineHeight: 1.75, color: '#1e1e1e', fontWeight: 400 },
  watermark:       { marginTop: 28, paddingTop: 16, borderTop: '1px solid #f0ebe3', fontSize: 12, color: '#b0a99a', textAlign: 'center' },
  watermarkLink:   { color: '#8a7f72', fontWeight: 500, textDecoration: 'underline', textDecorationColor: '#d5cec4' },
  skeleton:        { display: 'flex', flexDirection: 'column', gap: 10 },
  skeletonLine:    { height: 14, background: 'linear-gradient(90deg, #f0ebe3 25%, #e8e2d8 50%, #f0ebe3 75%)', borderRadius: 4, animation: 'shimmer 1.4s ease infinite' },
  pricingTeaser:   { background: '#1e1e1e', borderRadius: 20, padding: '40px' },
  pricingTeaserInner: { display: 'flex', gap: 40, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' },
  pricingTeaserLeft:  { flex: 1, minWidth: 200 },
  pricingTeaserLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#86efac', marginBottom: 10 },
  pricingTeaserTitle: { fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#fff', lineHeight: 1.25, marginBottom: 12 },
  pricingTeaserBody:  { fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontWeight: 300 },
  pricingTeaserRight: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flexShrink: 0 },
  pricingPrice:    { fontFamily: "'DM Serif Display', serif", fontSize: 48, color: '#fff', lineHeight: 1 },
  pricingPeriod:   { fontSize: 18, color: 'rgba(255,255,255,0.5)', fontWeight: 300 },
  pricingCta:      { background: '#fff', color: '#1e1e1e', borderRadius: 12, padding: '13px 28px', fontSize: 14, fontWeight: 700, display: 'block', textAlign: 'center' },
  pricingMeta:     { fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' },
  modalOverlay:    { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard:       { background: '#fff', borderRadius: 24, padding: '48px 40px', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalIcon:       { fontSize: 36, marginBottom: 20 },
  modalTitle:      { fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1e1e1e', marginBottom: 14, lineHeight: 1.3 },
  modalBody:       { fontSize: 14, color: '#6b6058', lineHeight: 1.7, fontWeight: 300, marginBottom: 28 },
  modalCta:        { display: 'block', background: '#1e1e1e', color: '#f5f1eb', borderRadius: 12, padding: '14px 24px', fontSize: 15, fontWeight: 600, marginBottom: 12, textAlign: 'center' },
  modalDismiss:    { background: 'transparent', border: 'none', color: '#a09488', fontSize: 13, cursor: 'pointer', width: '100%', padding: '8px' },
};
