import { useState } from 'react';
import { Link } from 'react-router-dom';

const PRO_FEATURES = [
  { icon: '🎙️', title: 'Brand voice profile',      body: 'Save your tone and style — every output sounds unmistakably you.' },
  { icon: '📂', title: '30-day output history',     body: 'Revisit and reuse every proposal, follow-up, and invoice you\'ve generated.' },
  { icon: '📄', title: 'PDF export',                body: 'Download ready-to-send, formatted proposals in one click.' },
  { icon: '✉️', title: 'Direct email send',          body: 'Send straight from Pitchcraft via SendGrid — no copy-paste required.' },
  { icon: '⚡', title: 'Streaming output',           body: 'Watch your content generate in real time, word by word.' },
  { icon: '🗂️', title: 'Custom templates',           body: 'Save your own proposal structures and reuse them across clients.' },
  { icon: '👤', title: 'Client profiles',            body: 'Store client details once, pre-fill every future generation.' },
  { icon: '∞',  title: 'Unlimited generations',     body: 'No caps, no monthly resets. Generate as much as you need.' },
];

export default function PricingPage() {
  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email.'); return; }
    setError('');
    setSubmitting(true);
    try {
      await fetch('/api/pro-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), betaCode: null, submittedAt: new Date().toISOString() }),
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={s.page}>
      <main style={s.main}>

        {/* Hero */}
        <div style={s.hero}>
          <div style={s.eyebrow}>Pitchcraft Pro</div>
          <h1 style={s.heroTitle}>More power.<br /><em style={s.heroItalic}>When you're ready.</em></h1>
          <p style={s.heroSub}>
            Pro is in active development — shaped by feedback from beta testers like you.
            When it launches, beta users get <strong>50% off their first 3 months</strong>.
          </p>
        </div>

        {/* Feature grid */}
        <div style={s.featureGrid}>
          {PRO_FEATURES.map((f, i) => (
            <div key={i} style={s.featureCard}>
              <div style={s.featureIcon}>{f.icon}</div>
              <div style={s.featureTitle}>{f.title}</div>
              <div style={s.featureBody}>{f.body}</div>
            </div>
          ))}
        </div>

        {/* Pricing card */}
        <div style={s.pricingCard}>
          <div style={s.pricingBadge}>Coming soon</div>
          <div style={s.pricingName}>Pitchcraft Pro</div>
          <div style={s.pricingPriceRow}>
            <span style={s.pricingAmount}>$29</span>
            <span style={s.pricingPeriod}>/month</span>
          </div>
          <div style={s.pricingAnnual}>or $278/year — save $70</div>
          <div style={s.pricingNote}>
            We're building Pro carefully so it's genuinely worth paying for.
            No launch date yet — but it's coming, and beta testers get first access at half price.
          </div>

          {/* Email capture */}
          {submitted ? (
            <div style={s.successState}>
              <div style={s.successIcon}>✓</div>
              <div style={s.successTitle}>You're on the list!</div>
              <div style={s.successBody}>We'll email you the moment Pro is ready — with your 50% discount code waiting.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={s.form}>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="your@email.com"
                style={s.emailInput}
              />
              <button type="submit" disabled={submitting} style={{ ...s.submitBtn, ...(submitting ? s.submitBtnDisabled : {}) }}>
                {submitting ? 'Saving...' : 'Notify me when Pro launches →'}
              </button>
              {error && <div style={s.formError}>{error}</div>}
              <div style={s.formMeta}>No commitment. No spam. Just a heads-up when it's ready.</div>
            </form>
          )}
        </div>

        {/* Beta reassurance */}
        <div style={s.betaNote}>
          <span style={s.betaDot} />
          <span>
            Already a beta tester? You have full access to everything right now — unlimited generations, no watermarks.{' '}
            <Link to="/" style={s.betaLink}>Get back to the app →</Link>
          </span>
        </div>

      </main>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#f5f1eb', fontFamily: "'DM Sans', sans-serif" },
  main: { maxWidth: 760, margin: '0 auto', padding: '72px 24px 100px' },

  hero: { textAlign: 'center', marginBottom: 64 },
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2D6A4F', marginBottom: 16 },
  heroTitle: { fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(38px, 6vw, 56px)', color: '#1e1e1e', lineHeight: 1.15, marginBottom: 20, fontWeight: 400 },
  heroItalic: { fontStyle: 'italic', color: '#2D6A4F' },
  heroSub: { fontSize: 16, color: '#6b6058', lineHeight: 1.7, fontWeight: 300, maxWidth: 520, margin: '0 auto' },

  featureGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 },
  featureCard: { background: '#fff', borderRadius: 16, padding: '24px 28px', border: '1.5px solid #e8e2d8' },
  featureIcon:  { fontSize: 22, marginBottom: 10 },
  featureTitle: { fontFamily: "'DM Serif Display', serif", fontSize: 16, color: '#1e1e1e', marginBottom: 6, fontWeight: 400 },
  featureBody:  { fontSize: 13, color: '#6b6058', lineHeight: 1.65, fontWeight: 300 },

  pricingCard: { background: '#1e1e1e', borderRadius: 24, padding: '48px 48px 44px', marginBottom: 32, position: 'relative' },
  pricingBadge: { display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B45309', background: '#fdf6ed', border: '1px solid #f5d9a8', padding: '3px 12px', borderRadius: 100, marginBottom: 20 },
  pricingName:  { fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 12 },
  pricingPriceRow: { display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 },
  pricingAmount:   { fontFamily: "'DM Serif Display', serif", fontSize: 56, color: '#fff', lineHeight: 1, fontWeight: 400 },
  pricingPeriod:   { fontSize: 18, color: 'rgba(255,255,255,0.5)', fontWeight: 300 },
  pricingAnnual:   { fontSize: 13, color: '#86efac', fontWeight: 500, marginBottom: 20 },
  pricingNote:     { fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontWeight: 300, marginBottom: 32, maxWidth: 480 },

  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  emailInput: { padding: '13px 16px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none' },
  submitBtn: { padding: '14px', background: '#fff', color: '#1e1e1e', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  submitBtnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  formError: { fontSize: 12, color: '#fca5a5' },
  formMeta:  { fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center' },

  successState: { textAlign: 'center', padding: '12px 0' },
  successIcon:  { width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: '#86efac', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  successTitle: { fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#fff', marginBottom: 10 },
  successBody:  { fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontWeight: 300 },

  betaNote: { display: 'flex', alignItems: 'flex-start', gap: 10, background: '#f0f7f4', border: '1.5px solid #b7ddd0', borderRadius: 12, padding: '14px 18px', fontSize: 13, color: '#2D6A4F', lineHeight: 1.6, fontWeight: 400 },
  betaDot:  { width: 8, height: 8, borderRadius: '50%', background: '#2D6A4F', flexShrink: 0, marginTop: 4 },
  betaLink: { color: '#2D6A4F', fontWeight: 600, textDecoration: 'underline', textDecorationColor: '#b7ddd0' },
};
