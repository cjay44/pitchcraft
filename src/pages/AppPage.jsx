import { useState, useRef, useEffect } from 'react';

const TABS = ['Proposal', 'Follow-Up', 'Invoice'];
const MAX_NOTES = 500;

const TAB_ACCENTS = {
  'Proposal':  { bg: '#f0f7f4', border: '#b7ddd0', badge: '#2D6A4F', label: '#2D6A4F' },
  'Follow-Up': { bg: '#f0f4ff', border: '#bcceff', badge: '#1D4ED8', label: '#1D4ED8' },
  'Invoice':   { bg: '#fdf6ed', border: '#f5d9a8', badge: '#B45309', label: '#B45309' },
};

const TONES = [
  { id: 'friendly',     label: 'Friendly',     emoji: '😊', description: 'Warm and conversational', color: '#2D6A4F', bg: '#f0f7f4', border: '#b7ddd0' },
  { id: 'professional', label: 'Professional', emoji: '💼', description: 'Polished and business-ready', color: '#1e1e1e', bg: '#f5f1eb', border: '#d5cec4' },
  { id: 'bold',         label: 'Bold',         emoji: '⚡', description: 'Direct and punchy',         color: '#B45309', bg: '#fdf6ed', border: '#f5d9a8' },
];

const TONE_MODIFIERS = {
  friendly: `TONE — FRIENDLY: Write like a skilled, warm professional having a real conversation. Use the client's name naturally. Sentences can be slightly longer and more relaxed. The client should feel like they're working with someone who genuinely cares about their project, not just completing a transaction. Avoid corporate phrases like "please do not hesitate to contact me." Contractions are fine. End on an encouraging, human note.`,
  professional: `TONE — PROFESSIONAL: Write with quiet authority. Every sentence should be precise and purposeful — no filler, no warmth-padding, but never cold. The client should feel they're dealing with a serious expert who respects their time. No contractions. Formal but not stiff. The proposal should feel like it came from someone who has done this many times and knows exactly what they're doing.`,
  bold: `TONE — BOLD: Write with maximum confidence and minimum words. Short sentences. Active voice only. No hedging phrases like "I believe" or "I think" — state things as facts. The investment section especially should be unapologetic and direct. The client should feel a sense of energy and momentum reading this. Every word must earn its place. Cut anything that doesn't add force.`,
};

const getSystemPrompt = (key, tone = 'professional') => {
  const toneInstruction = TONE_MODIFIERS[tone] || TONE_MODIFIERS.professional;
  const base = {
    proposal: `You are an expert business writer who has written thousands of winning proposals for freelance designers. Your proposals feel personal, not templated — the client should feel like this was written specifically for them.
Write a compelling project proposal for a freelance designer using the information provided. The proposal should make the client feel understood and confident in moving forward.
STRUCTURE — use these five sections as plain capitalized headings on their own line:
PROJECT OVERVIEW
Summarise what the client is trying to achieve and why this project matters to their business. Reference the client by name and demonstrate you understand their context. Do not just restate what they told you — interpret it and show understanding.
SCOPE OF WORK
List the specific deliverables clearly. Be concrete and specific to the project type. Each deliverable should be a separate line. Do not use bullet characters — just one deliverable per line. Include revision rounds where appropriate.
TIMELINE
Give a realistic week-by-week or phase-based breakdown that matches the timeline provided. If no timeline is given, propose a sensible one based on the scope. End with a final delivery date or launch milestone.
INVESTMENT
State the total investment confidently. Do not apologise for the price. Frame it in terms of value delivered. If a budget is provided, use it. If not, write "Investment: To be confirmed following scope discussion." Include a brief note on payment terms (e.g. 50% upfront, 50% on completion). Never use the words "just" or "only" before a price.
NEXT STEPS
Give one single clear action the client needs to take. For example: "To move forward, reply to confirm you're happy with this proposal and I'll send the contract and first invoice within 24 hours." Make it frictionless and specific — not vague like "get in touch."
LENGTH: Scale to the scope. A small project under $1,500 needs 200-300 words. A mid-range project $1,500-$8,000 needs 300-400 words. A large project over $8,000 needs 400-500 words. Never pad, never truncate.
${toneInstruction}
CRITICAL: Output plain text only. No markdown whatsoever — no #, no **, no ___, no ---, no asterisks, no dashes as bullets. Section headings are plain capitalized text on their own line followed by one blank line.`,
    followup: `You are an expert copywriter who writes follow-up emails for freelance designers. Your emails are short, human and never pushy — but they are strategically written to re-open conversations.
Write a 3-email follow-up sequence for a proposal that has not received a response. Each email must feel completely different from the others — different angle, different energy, different reason to reply.
EMAIL 1 — Day 3: The gentle nudge
Strategy: assume good intent, they're probably just busy. Very short. Warm and light. Just checking it arrived.
Subject line: specific to the project, not generic. E.g. "[Client name] — just checking in on the proposal"
Body: 2-3 sentences maximum. Do not repeat anything from the proposal. Just acknowledge you sent it and invite a quick reply.
EMAIL 2 — Day 7: The value-add
Strategy: give them something useful before asking for anything. Add one small, specific insight relevant to their project type — a design consideration, a question that helps clarify scope, or a relevant observation about their industry. This makes you memorable and demonstrates expertise.
Subject line: lead with the value, not the follow-up
Body: 3-4 sentences. One sentence of value-add specific to their project type, one light callback to the proposal, one clear invitation to respond.
EMAIL 3 — Day 14: The door-closer
Strategy: create gentle natural scarcity without being aggressive. Your schedule is filling up. You want to give them first right of refusal before moving on. Leave the door open but make it clear this is the last nudge.
Subject line: direct and honest
Body: 3-4 sentences. Acknowledge this is your last follow-up. Mention your schedule is booking out. Tell them the door is still open. Wish them well regardless.
${toneInstruction}
Format each email exactly like this — label on its own line, then subject, then a blank line, then body:
Email 1 — Day 3:
Subject: [subject line]
[body]
CRITICAL: Output plain text only. No markdown, no **, no ##, no ---.`,
    invoice: `You are an expert copywriter who writes invoice reminder emails for freelance designers. Your emails are professional and respectful, but they escalate clearly — being owed money is serious and the emails should reflect that without being rude.
Write 3 invoice reminder emails that escalate in firmness. Always reference the project name and invoice amount in each email.
REMINDER 1 — 3 Days Before Due: Friendly heads-up
Tone: warm and helpful. Assume they'll pay without issue. Just making sure it's on their radar.
Include: project name, invoice amount, due date, and how to pay.
Subject: friendly, reference the invoice or project
Body: 3 sentences. Mention the invoice, the amount, the due date, and how to pay. Keep it light.
REMINDER 2 — 1 Week Overdue: Polite but firm
Tone: professional and clear. No longer assuming an oversight — this needs attention. More direct than Reminder 1.
Include: project name, exact amount owed, how many days overdue, payment details.
Subject: clear that payment is now overdue
Body: 4 sentences. Acknowledge the invoice is overdue. State the amount clearly. Provide payment details again. Ask them to confirm when payment will be made.
REMINDER 3 — 2 Weeks Overdue: Final notice
Tone: direct and serious. This is a final notice before further action. Professional but unambiguous. Do not soften this — even with a Friendly tone instruction, this email must be firm.
Include: project name, total amount, days overdue.
Subject: include the words "Final notice"
Body: 4-5 sentences. State this is a final notice. Give the exact amount and days overdue. Note that if payment is not received within 5 business days you will need to pursue other options. Provide payment details one final time. Keep it factual, not emotional.
${toneInstruction}
Note on tone: The tone instruction applies to warmth and word choice in Reminders 1 and 2 only. Reminder 3 must always be firm and direct regardless of tone setting.
Format each reminder exactly like this — label on its own line, then subject, then a blank line, then body:
Reminder 1 — 3 Days Before Due:
Subject: [subject line]
[body]
CRITICAL: Output plain text only. No markdown, no **, no ##, no ---.`,
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

function OutputRenderer({ text }) {
  return (
    <div style={s.outputText}>
      {text.split('\n').map((line, i) => {
        const trimmed = line.trim();
        const isHeader = trimmed.length > 0 && trimmed.length < 65 &&
          (trimmed.endsWith(':') || /^[A-Z][A-Z\s\-\/]{4,}$/.test(trimmed));
        if (trimmed === '') return <div key={i} style={{ height: 12 }} />;
        if (isHeader)       return <div key={i} style={s.outputSectionHeader}>{trimmed}</div>;
        return                     <div key={i} style={s.outputLine}>{line}</div>;
      })}
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

function BetaWelcomeModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);

  const handleInterest = () => {
    setSubmitted(true);
    fetch('/api/pro-interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betaCode: 'CRAFT2026', submittedAt: new Date().toISOString() }),
    }).catch(() => {});
  };

  return (
    <div style={s.modalOverlay} onClick={onClose}>
      <div style={{ ...s.modalCard, textAlign: 'left', padding: '36px 40px', maxWidth: 460, position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 18, color: '#a09488', cursor: 'pointer', lineHeight: 1, padding: 4 }}>✕</button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0f7f4', color: '#2D6A4F', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>✓</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#1e1e1e', marginBottom: 12 }}>You're on the list!</div>
            <div style={{ fontSize: 14, color: '#6b6058', lineHeight: 1.7, fontWeight: 300, marginBottom: 28 }}>We'll be in touch when Pro launches. Your 50% discount is reserved.</div>
            <button onClick={onClose} style={{ width: '100%', padding: '14px', background: '#1e1e1e', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Start crafting →</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2D6A4F', marginBottom: 10 }}>Welcome to the beta 🎉</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#1e1e1e', lineHeight: 1.3, marginBottom: 14 }}>Thank you for helping shape Pitchcraft</div>
            <div style={{ fontSize: 14, color: '#6b6058', lineHeight: 1.7, fontWeight: 300, marginBottom: 0 }}>
              You now have unlimited generations and no watermarks for the next 28 days. Nothing is set in stone yet — Pitchcraft is still being built, and your feedback directly shapes what we ship next.
            </div>
            <div style={{ borderTop: '1px solid #e8e2d8', margin: '20px 0' }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e1e1e', marginBottom: 10 }}>Early access offer</div>
            <div style={{ fontSize: 14, color: '#6b6058', lineHeight: 1.7, fontWeight: 300, marginBottom: 20 }}>
              As a beta tester, you'll get 50% off Pro for your first 3 months when we launch. That's $14.50/month instead of $29 — locked in for life as long as you stay subscribed.
            </div>
            <button onClick={handleInterest} style={{ width: '100%', padding: '14px', background: '#2D6A4F', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>
              Yes, I'm interested in Pro →
            </button>
            <div style={{ fontSize: 11, color: '#a09488', textAlign: 'center', marginBottom: 12 }}>No commitment. We'll reach out when Pro is ready.</div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#a09488', fontSize: 12, cursor: 'pointer', padding: '4px 8px' }}>Maybe later</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ToneSelector({ tone, setTone, loading }) {
  return (
    <div style={s.toneSelectorRow}>
      <span style={s.toneLabel}>Tone</span>
      <div style={s.tonePills}>
        {TONES.map(t => {
          const active = tone === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              disabled={loading}
              title={t.description}
              style={{
                ...s.tonePill,
                background:   active ? t.color : '#f5f1eb',
                color:        active ? '#fff'   : '#5a5048',
                borderColor:  active ? t.color  : '#e8e2d8',
                boxShadow:    active ? `0 2px 8px ${t.color}40` : 'none',
                opacity:      loading ? 0.5 : 1,
                cursor:       loading ? 'not-allowed' : 'pointer',
              }}
            >
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AppPage({ isBeta, activateBeta }) {
  const [activeTab, setActiveTab]     = useState('Proposal');
  const [form, setForm]               = useState({ designerName: '', clientName: '', projectType: '', budget: '', timeline: '', notes: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [output, setOutput]           = useState('');
  const [editedOutput, setEditedOutput] = useState('');
  const [isEditing, setIsEditing]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [copied, setCopied]           = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [betaInput, setBetaInput]       = useState('');
  const [betaError, setBetaError]       = useState(false);
  const [showBetaWelcome, setShowBetaWelcome] = useState(false);
  const [tone, setTone]               = useState('professional');
  const outputRef   = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (output && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [output]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [editedOutput]);

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
    setEditedOutput('');
    setIsEditing(false);
    setGlobalError('');
    setFieldErrors({});
    setShowSuccess(false);
  };

  const handleActivateBeta = () => {
    const success = activateBeta(betaInput);
    if (!success) { setBetaError(true); return; }
    setBetaError(false);
    setShowBetaWelcome(true);
  };

  const handleGenerate = async () => {
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
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1000,
          system: getSystemPrompt(systemKey, tone),
          messages: [{ role: 'user', content: buildUserPrompt(activeTab, form) }],
        }),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const text = data.content?.map(b => b.text || '').join('') || 'No response received.';
      setOutput(text);
      setEditedOutput(text);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err) {
      setGlobalError(!navigator.onLine
        ? 'No internet connection. Check your network and try again.'
        : 'Something went wrong. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const text = editedOutput;
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
      {showBetaWelcome && <BetaWelcomeModal onClose={() => setShowBetaWelcome(false)} />}

      <main style={s.main} className="pc-main">
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

        {/* Card */}
        <div style={s.card} className="pc-card">
          <div style={s.tabRow}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => handleTabSwitch(tab)} disabled={loading}
                style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}), ...(loading ? s.tabDisabled : {}) }}>
                {tab}
              </button>
            ))}
          </div>
          <p style={s.tabDesc}>{tabDescriptions[activeTab]}</p>

          <div style={s.formGrid} className="pc-form-grid">
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

          <button onClick={handleGenerate} disabled={loading}
            style={{ ...s.generateBtn, ...(loading ? s.generateBtnDisabled : {}) }}>
            {loading
              ? <span style={s.loadingRow}><span style={s.spinner} />Generating your {activeTab.toLowerCase()}...</span>
              : `Generate ${activeTab}`}
          </button>
        </div>

        <SuccessToast show={showSuccess} tab={activeTab} />

        {output || loading ? (
          <div ref={outputRef} style={{ ...s.outputCard, borderTop: `3px solid ${accent.border}` }}>
            <div style={{ ...s.outputHeaderRow, background: accent.bg }} className="pc-output-header">
              <div style={s.outputTitleRow}>
                <span style={{ ...s.outputBadge, background: accent.badge }}>{activeTab}</span>
                <span style={s.outputTitle}>Output</span>
              </div>
              {output && (
                <div style={s.outputActions}>
                  {editedOutput !== output && (
                    <button onClick={() => setEditedOutput(output)} style={s.resetBtn}>Reset</button>
                  )}
                  <button onClick={handleCopy} style={{ ...s.copyBtn, color: copied ? accent.label : '#5a5048' }}>
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
            <div style={s.outputBody} className="pc-output-body">
              {loading ? (
                <div style={s.skeleton}>
                  {[100, 85, 92, 70, 88, 60].map((w, i) => (
                    <div key={i} style={{ ...s.skeletonLine, width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              ) : (
                <>
                  <div style={s.editPromptBar}>
                    <div style={s.editPromptLeft}>
                      <span>✏️</span>
                      <span style={s.editPromptText}>This is your draft — click to edit before you copy or send</span>
                    </div>
                    <span style={{ fontSize: 12, color: isEditing ? '#2D6A4F' : '#a09488', fontWeight: isEditing ? 600 : 400 }}>
                      {isEditing ? 'Editing...' : 'Click to edit'}
                    </span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={editedOutput}
                    onChange={e => setEditedOutput(e.target.value)}
                    onFocus={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                    rows={1}
                    style={{ ...s.editableOutput, border: isEditing ? '1.5px solid #d5cec4' : 'none' }}
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          <EmptyState tab={activeTab} />
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
  outputBody:      { padding: '28px 32px' },
  outputActions:   { display: 'flex', alignItems: 'center', gap: 10 },
  resetBtn:        { background: 'none', border: 'none', color: '#a09488', fontSize: 12, cursor: 'pointer', padding: '4px 8px' },
  editPromptBar:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#faf8f5', border: '1.5px dashed #d5cec4', borderRadius: 8, padding: '10px 14px', marginBottom: 14 },
  editPromptLeft:  { display: 'flex', alignItems: 'center', gap: 8 },
  editPromptText:  { fontSize: 13, color: '#6b6058' },
  editableOutput:  { width: '100%', height: 'auto', overflow: 'hidden', border: 'none', background: 'transparent', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.8, color: '#1e1e1e', resize: 'none', outline: 'none', padding: '16px', boxSizing: 'border-box', borderRadius: 8, cursor: 'text', display: 'block' },
  outputText:      { fontFamily: "'DM Sans', sans-serif" },
  outputSectionHeader: { fontSize: 12, fontWeight: 700, color: '#1e1e1e', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 24, marginBottom: 8 },
  outputLine:      { fontSize: 14, lineHeight: 1.8, color: '#3a3028', fontWeight: 300 },
  skeleton:        { display: 'flex', flexDirection: 'column', gap: 10 },
  skeletonLine:    { height: 14, background: 'linear-gradient(90deg, #f0ebe3 25%, #e8e2d8 50%, #f0ebe3 75%)', borderRadius: 4, animation: 'shimmer 1.4s ease infinite' },
  modalOverlay:    { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard:       { background: '#fff', borderRadius: 24, padding: '48px 40px', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  toneSelectorRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, flexWrap: 'wrap' },
  toneLabel:       { fontSize: 12, fontWeight: 600, color: '#5a5048', letterSpacing: '0.04em', textTransform: 'uppercase', flexShrink: 0 },
  tonePills:       { display: 'flex', gap: 8, flexWrap: 'wrap' },
  tonePill:        { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 100, border: '1.5px solid', fontSize: 13, fontWeight: 600, transition: 'all 0.18s ease', fontFamily: "'DM Sans', sans-serif" },
};
