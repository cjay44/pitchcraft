import { useState } from "react";
import { Link } from "react-router-dom";

const QUESTIONS = [
  {
    id: "q1", section: "Output Quality",
    type: "rating", label: "How good was the quality of the generated proposal / email?",
    sub: "1 = Poor, 5 = Excellent",
  },
  {
    id: "q2", section: "Output Quality",
    type: "text", label: "Did the output sound like something you'd actually send to a client?",
    placeholder: "e.g. Yes, mostly — I changed the opening line but kept the rest...",
  },
  {
    id: "q3", section: "Proposal Structure",
    type: "rating", label: "How well was the proposal structured for a real client conversation?",
    sub: "1 = Needs a lot of work, 5 = Pitch perfect",
  },
  {
    id: "q4", section: "Proposal Structure",
    type: "text", label: "Was anything missing that your clients typically expect to see?",
    placeholder: "e.g. I usually include a testimonials section...",
  },
  {
    id: "q5", section: "UX Flow",
    type: "rating", label: "How easy was the tool to use from start to finish?",
    sub: "1 = Confusing, 5 = Effortless",
  },
  {
    id: "q6", section: "UX Flow",
    type: "text", label: "Was there any moment where you felt stuck or unsure what to do?",
    placeholder: "e.g. I wasn't sure what to put in the Notes field at first...",
  },
  {
    id: "q7", section: "Willingness to Pay",
    type: "choice", label: "Based on what you experienced, would you pay $29/month for Pro?",
    options: ["Yes, absolutely", "Probably yes", "Maybe — depends on more features", "Probably not", "No"],
  },
  {
    id: "q8", section: "Willingness to Pay",
    type: "text", label: "What would make you definitely pay for the Pro version?",
    placeholder: "e.g. If it could send the proposal directly from the app...",
  },
  {
    id: "q9", section: "Overall",
    type: "rating", label: "Overall, how likely are you to recommend Pitchcraft to another freelancer?",
    sub: "1 = Not likely, 5 = Already telling people",
  },
  {
    id: "q10", section: "Overall",
    type: "text", label: "What's the one thing we should change or improve before public launch?",
    placeholder: "Your most honest feedback — we read every response...",
    tall: true,
  },
];

const SECTION_COLORS = {
  "Output Quality":     { bg: "#f0f7f4", border: "#b7ddd0", label: "#2D6A4F" },
  "Proposal Structure": { bg: "#f0f4ff", border: "#bcceff", label: "#1D4ED8" },
  "UX Flow":            { bg: "#fdf6ed", border: "#f5d9a8", label: "#B45309" },
  "Willingness to Pay": { bg: "#fdf0ef", border: "#f5c6c0", label: "#c0392b" },
  "Overall":            { bg: "#f5f1eb", border: "#d5cec4", label: "#1e1e1e" },
};

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      {[1, 2, 3, 4, 5].map(n => {
        const active = n <= (hovered ?? value);
        return (
          <button key={n} onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(null)}
            style={{ width: 44, height: 44, borderRadius: 10, border: `1.5px solid ${active ? "#1e1e1e" : "#e8e2d8"}`,
              background: active ? "#1e1e1e" : "#faf8f5", color: active ? "#fff" : "#a09488",
              fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "all 0.15s ease", fontFamily: "'DM Sans', sans-serif" }}>
            {n}
          </button>
        );
      })}
    </div>
  );
}

export default function FeedbackPage() {
  const [answers, setAnswers] = useState({});
  const [name, setName]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);

  const set = (id, val) => setAnswers(a => ({ ...a, [id]: val }));

  const completedCount = Object.keys(answers).length;
  const totalCount = QUESTIONS.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  const handleSubmit = () => {
    const required = QUESTIONS.filter(q => !answers[q.id]);
    if (required.length > 2) {
      alert("Please answer at least 8 of the 10 questions before submitting.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={s.page}>
        <div style={s.bgTexture} />
        <div style={s.thankYouWrap}>
          <div style={s.thankYouCard} className="pc-thankyou-card">
            <div style={s.thankYouIcon}>🙏</div>
            <h1 style={s.thankYouTitle}>Thank you, {name || "friend"}.</h1>
            <p style={s.thankYouBody}>Your feedback goes directly to the Pitchcraft team and will shape what we build next. We'll follow up personally once we've reviewed your responses.</p>
            <div style={s.thankYouStat}>
              <div style={s.statNum}>{completedCount}</div>
              <div style={s.statLabel}>questions answered</div>
            </div>
          </div>
        </div>
        
      </div>
    );
  }

  let lastSection = null;

  return (
    <div style={s.page}>
      <div style={s.bgTexture} />
<main style={s.main} className="pc-feedback-main">
        <div style={s.hero}>
          <h1 style={s.heroTitle}>Help us build something great.</h1>
          <p style={s.heroSub}>You're one of the first people to use Pitchcraft. Your feedback will directly shape the product before public launch. Be brutally honest — it's the most helpful thing you can do.</p>
        </div>

        {/* Name field */}
        <div style={s.card} className="pc-feedback-card">
          <label style={s.label}>Your first name <span style={s.req}>*</span></label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Sarah"
            style={s.input} />
        </div>

        {/* Questions */}
        {QUESTIONS.map((q, i) => {
          const isNewSection = q.section !== lastSection;
          lastSection = q.section;
          const col = SECTION_COLORS[q.section];
          return (
            <div key={q.id}>
              {isNewSection && (
                <div style={{ ...s.sectionLabel, color: col.label, background: col.bg, borderColor: col.border }}>
                  {q.section}
                </div>
              )}
              <div style={s.card} className="pc-feedback-card">
                <div style={s.qNum}>Q{i + 1}</div>
                <label style={s.qLabel}>{q.label}</label>
                {q.sub && <div style={s.qSub}>{q.sub}</div>}

                {q.type === "rating" && (
                  <StarRating value={answers[q.id] || 0} onChange={v => set(q.id, v)} />
                )}

                {q.type === "text" && (
                  <textarea value={answers[q.id] || ""} onChange={e => set(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    style={{ ...s.input, ...s.textarea, marginTop: 10, minHeight: q.tall ? 120 : 80 }} />
                )}

                {q.type === "choice" && (
                  <div style={s.choiceRow} className="pc-choice-row">
                    {q.options.map(opt => (
                      <button key={opt} onClick={() => set(q.id, opt)}
                        style={{ ...s.choiceBtn, ...(answers[q.id] === opt ? s.choiceBtnActive : {}) }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Submit */}
        <button onClick={handleSubmit} style={s.submitBtn}>
          Submit feedback →
        </button>
        <p style={s.submitNote}>Your responses are confidential and used only to improve Pitchcraft.</p>
      </main>
    </div>
  );
}

const s = {
  page:      { minHeight: "100vh", background: "#f5f1eb", fontFamily: "'DM Sans', sans-serif", position: "relative" },
  bgTexture: { position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle at 20% 20%, rgba(180,160,120,0.07) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 },
logoRow:   { display: "flex", alignItems: "center", gap: 12 },
logoText:  { fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#1e1e1e" },
  progressWrap:  { display: "flex", alignItems: "center", gap: 10 },
  progressTrack: { width: 120, height: 4, background: "#e8e2d8", borderRadius: 100 },
  progressFill:  { height: "100%", background: "#1e1e1e", borderRadius: 100, transition: "width 0.3s ease" },
  progressLabel: { fontSize: 12, color: "#8a7f72", fontWeight: 500 },
  main:      { position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto", padding: "56px 24px 80px", animation: "fadeUp 0.5s ease forwards" },
  hero:      { textAlign: "center", marginBottom: 40 },
  heroTitle: { fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px,5vw,40px)", color: "#1e1e1e", marginBottom: 14, lineHeight: 1.2 },
  heroSub:   { fontSize: 15, color: "#6b6058", lineHeight: 1.7, fontWeight: 300 },
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, border: "1.5px solid", display: "inline-block", marginBottom: 12, marginTop: 8 },
  card:      { background: "#fff", borderRadius: 16, padding: "24px 28px", boxShadow: "0 2px 20px rgba(0,0,0,0.05)", marginBottom: 16 },
  qNum:      { fontSize: 11, fontWeight: 700, color: "#a09488", letterSpacing: "0.06em", marginBottom: 6 },
  qLabel:    { fontSize: 16, fontWeight: 500, color: "#1e1e1e", lineHeight: 1.4, display: "block", marginBottom: 4, fontFamily: "'DM Serif Display', serif" },
  qSub:      { fontSize: 12, color: "#a09488", marginBottom: 4 },
  label:     { fontSize: 12, fontWeight: 600, color: "#5a5048", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 8 },
  req:       { color: "#c0392b" },
  input:     { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8e2d8", background: "#faf8f5", fontSize: 14, color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, transition: "all 0.15s ease" },
  textarea:  { display: "block", resize: "vertical", lineHeight: 1.6 },
  choiceRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 },
  choiceBtn: { padding: "9px 16px", borderRadius: 100, border: "1.5px solid #e8e2d8", background: "#faf8f5", color: "#6b6058", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" },
  choiceBtnActive: { background: "#1e1e1e", borderColor: "#1e1e1e", color: "#fff" },
  submitBtn: { width: "100%", padding: "16px", background: "#1e1e1e", color: "#f5f1eb", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em", marginBottom: 12 },
  submitNote:{ textAlign: "center", fontSize: 12, color: "#a09488" },
  thankYouWrap: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 24, position: "relative", zIndex: 1 },
  thankYouCard: { background: "#fff", borderRadius: 24, padding: "56px 48px", maxWidth: 480, textAlign: "center", boxShadow: "0 4px 40px rgba(0,0,0,0.08)" },
  thankYouIcon: { fontSize: 48, marginBottom: 24 },
  thankYouTitle:{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#1e1e1e", marginBottom: 16 },
  thankYouBody: { fontSize: 15, color: "#6b6058", lineHeight: 1.7, fontWeight: 300, marginBottom: 32 },
  thankYouStat: { background: "#f5f1eb", borderRadius: 16, padding: "20px 32px" },
  statNum:   { fontFamily: "'DM Serif Display', serif", fontSize: 48, color: "#1e1e1e" },
  statLabel: { fontSize: 13, color: "#8a7f72", marginTop: 4 },
};
