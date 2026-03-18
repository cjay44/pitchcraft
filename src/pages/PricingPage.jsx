import { useState } from "react";
import { Link } from "react-router-dom";

const FREE_FEATURES = [
  { text: "10 generations per month", sub: "Shared across all 3 tools" },
  { text: "Proposal Generator" },
  { text: "Follow-Up Email Sequence" },
  { text: "Invoice Reminder Emails" },
  { text: "Copy to clipboard" },
  { text: "Plain text output" },
];

const FREE_RESTRICTIONS = [
  { text: "No saved history" },
  { text: "No brand voice profile" },
  { text: "No integrations" },
  { text: '"Made with Pitchcraft" watermark' },
];

const PRO_FEATURES = [
  { text: "Unlimited generations", sub: "Across all tools, forever" },
  { text: "Brand voice profile", sub: "Your tone, saved & reused" },
  { text: "30-day output history", sub: "Searchable and revisitable" },
  { text: "PDF export", sub: "Ready-to-send formatted proposals" },
  { text: "Direct email send", sub: "Via SendGrid integration" },
  { text: "Custom proposal templates" },
  { text: "Client profile saving" },
  { text: "Priority support" },
  { text: "No watermark" },
];

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "For freelancers just getting started",
    cta: "Start for free",
    ctaStyle: "outline",
    accent: "#6B6058",
    accentLight: "#f5f1eb",
    badge: null,
    features: FREE_FEATURES,
    restrictions: FREE_RESTRICTIONS,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "per month",
    tagline: "For established freelancers winning consistent work",
    cta: "Start Pro",
    ctaStyle: "solid",
    accent: "#2d3f55",
    accentLight: "#f0f0ee",
    badge: "Best plan",
    features: PRO_FEATURES,
    restrictions: [],
  }
];

function Check({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="7.5" cy="7.5" r="7.5" fill={color} fillOpacity="0.12" />
      <path d="M4.5 7.5L6.5 9.5L10.5 5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="7.5" cy="7.5" r="7.5" fill="#D5CEC4" fillOpacity="0.4" />
      <path d="M5.5 5.5L9.5 9.5M9.5 5.5L5.5 9.5" stroke="#A09488" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FeatureItem({ text, sub, accent, restricted, darkCard }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "12px 0", borderBottom: `1px solid ${darkCard ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}` }}>
      {restricted ? <Cross /> : <Check color={accent} />}
      <div>
        <div style={{
          fontSize: 14,
          color: restricted ? (darkCard ? "rgba(255,255,255,0.35)" : "#A09488") : (darkCard ? "#ffffff" : "#1e1e1e"),
          fontWeight: restricted ? 400 : 500,
          textDecoration: restricted ? "line-through" : "none",
          fontFamily: "'Lora', serif",
        }}>{text}</div>
        {sub && !restricted && (
          <div style={{ fontSize: 11, color: darkCard ? "rgba(255,255,255,0.55)" : "#8a7f72", marginTop: 1, fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [hovered, setHovered] = useState(null);

  const getPrice = (tier) => {
    if (tier.price === "$0") return "$0";
    const num = parseInt(tier.price.replace("$", ""));
    return annual ? `$${Math.round(num * 0.8)}` : tier.price;
  };

  return (
    <div style={s.page}>
      {/* Header */}
<main style={s.main} className="pc-pricing-main">

        {/* Hero */}
        <div style={s.hero} className="pc-hero">
          <div style={s.eyebrow}>Simple, transparent pricing</div>
          <h1 style={s.heroTitle}>
            Pay for what<br />
            <em style={s.heroItalic}>you actually use.</em>
          </h1>
          <p style={s.heroSub}>
            Start free. Upgrade when you're ready.<br />
            No contracts. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div style={s.toggleRow}>
            <span style={{ ...s.toggleLabel, color: !annual ? "#1e1e1e" : "#a09488" }}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              style={{ ...s.toggleTrack, background: annual ? "#1e1e1e" : "#d5cec4" }}
              aria-label="Toggle annual billing"
            >
              <span style={{ ...s.toggleThumb, transform: annual ? "translateX(20px)" : "translateX(2px)" }} />
            </button>
            <span style={{ ...s.toggleLabel, color: annual ? "#1e1e1e" : "#a09488" }}>
              Annual
              <span style={s.saveBadge}>Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div style={s.cardsRow} className="pc-cards-row">
          {TIERS.map((tier, idx) => {
            const isHovered = hovered === tier.id;
            const isPro = tier.id === "pro";
            return (
              <div
                key={tier.id}
                onMouseEnter={() => setHovered(tier.id)}
                onMouseLeave={() => setHovered(null)}
                className="pc-pricing-card"
              style={{
                  ...s.card,
                  ...(isPro ? s.cardFeatured : {}),
                  borderColor: isPro ? "#3d5470" : isHovered ? "#c5bdb3" : "#e8e2d8",
                  transform: isPro ? "translateY(-8px)" : isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isPro
                    ? "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)"
                    : isHovered
                    ? "0 12px 40px rgba(0,0,0,0.08)"
                    : "0 2px 20px rgba(0,0,0,0.05)",
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                {/* Badge */}
                {tier.badge && (
                  <div style={{ ...s.badge, background: isPro ? "#ffffff" : tier.accent, color: isPro ? "#1a2332" : "#ffffff" }}>
                    {tier.badge}
                  </div>
                )}

                {/* Tier header */}
                <div style={s.cardHeader}>
                  <div style={{ ...s.tierName, color: isPro ? "rgba(255,255,255,0.55)" : tier.accent }}>{tier.name}</div>
                  <div style={s.priceRow}>
                    <span style={{ ...s.price, color: isPro ? "#ffffff" : "#1e1e1e" }}>{getPrice(tier)}</span>
                    <span style={{ ...s.pricePeriod, color: isPro ? "rgba(255,255,255,0.7)" : "#8a7f72" }}>/ {annual && tier.price !== "$0" ? "mo, billed annually" : tier.period}</span>
                  </div>
                  {annual && tier.price !== "$0" && (
                    <div style={{ fontSize: 11, color: isPro ? "#86efac" : "#2D6A4F", fontWeight: 600, marginTop: 4 }}>
                      You save ${Math.round(parseInt(tier.price.replace("$","")) * 12 * 0.2)}/year
                    </div>
                  )}
                  <p style={{ ...s.tagline, color: isPro ? "rgba(255,255,255,0.75)" : "#8a7f72" }}>{tier.tagline}</p>
                </div>

                {/* CTA */}
                <div>
                  <button style={{
                    ...s.ctaBtn,
                    ...(tier.ctaStyle === "solid" ? { background: "#ffffff", color: "#1a2332", border: "2px solid #ffffff", fontWeight: 700 } : {}),
                    ...(tier.ctaStyle === "outline" ? { background: "transparent", color: "#1e1e1e", border: "1.5px solid #d5cec4" } : {}),
                    ...(tier.ctaStyle === "accent" ? { background: tier.accent, color: "#fff", border: "none" } : {}),
                  }}>
                    {tier.cta}
                  </button>
                </div>

                {/* Divider */}
                <div style={{ ...s.divider, borderColor: isPro ? "rgba(255,255,255,0.15)" : "#f0ebe3" }} />

                {/* Features */}
                <div style={s.featureList}>
                  {tier.features.map((f, i) => (
                    <FeatureItem key={i} text={f.text} sub={f.sub} accent={isPro ? "#ffffff" : tier.accent} darkCard={isPro} />
                  ))}
                  {tier.restrictions.map((f, i) => (
                    <FeatureItem key={`r${i}`} text={f.text} accent={tier.accent} restricted darkCard={isPro} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>


        {/* Coming soon teaser */}
        <div style={s.comingSoon} className="pc-coming-soon">
          <div style={s.comingSoonInner}>
            <span style={s.comingSoonTag}>Coming soon</span>
            <div style={s.comingSoonTitle}>Agency plan — launching later in 2026</div>
            <div style={s.comingSoonBody}>Team seats, agentic intake form connection, human-in-the-loop review queue, white-label output, and a CRM-lite pipeline. Built for design studios ready to scale. <span style={{fontWeight: 600, color: "#1e1e1e"}}>Join the waitlist →</span></div>
          </div>
        </div>

        {/* FAQ strip */}
        <div style={s.faqRow} className="pc-faq-row">
          {[
            { q: "Can I change plans anytime?", a: "Yes — upgrade, downgrade, or cancel anytime. No lock-in." },
            { q: "What counts as a generation?", a: "Each proposal, follow-up sequence, or invoice reminder is one generation." },
            { q: "Is the watermark visible to clients?", a: "Yes, on free plans. A small footer line reads 'Made with Pitchcraft'." },
            { q: "Do unused generations roll over?", a: "No — the 10 free generations reset on the 1st of each month." },
          ].map((item, i) => (
            <div key={i} style={s.faqItem}>
              <div style={s.faqQ}>{item.q}</div>
              <div style={s.faqA}>{item.a}</div>
            </div>
          ))}
        </div>

      </main>
<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#f5f1eb",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  grain: {
    position: "fixed", inset: "-50%",
    width: "200%", height: "200%",
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
    pointerEvents: "none", zIndex: 0,
    animation: "grain 8s steps(2) infinite",
  },
logoRow:  { display: "flex", alignItems: "center", gap: 10 },
logoText: { fontFamily: "'Lora', serif", fontSize: 18, color: "#1e1e1e", fontWeight: 500 },

  main: {
    position: "relative", zIndex: 1,
    maxWidth: 1100, margin: "0 auto",
    padding: "80px 32px 120px",
  },

  hero: { textAlign: "center", marginBottom: 72, animation: "fadeUp 0.6s ease forwards" },
  eyebrow: {
    fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "#8a7f72",
    marginBottom: 20,
  },
  heroTitle: {
    fontFamily: "'Lora', serif",
    fontSize: "clamp(42px, 6vw, 64px)",
    color: "#1e1e1e", lineHeight: 1.1,
    marginBottom: 20, fontWeight: 500,
  },
  heroItalic: { fontStyle: "italic", color: "#2D6A4F" },
  heroSub: {
    fontSize: 17, color: "#6b6058", lineHeight: 1.65,
    fontWeight: 300, marginBottom: 36,
  },

  toggleRow: { display: "flex", alignItems: "center", gap: 12, justifyContent: "center" },
  toggleLabel: { fontSize: 14, fontWeight: 500, transition: "color 0.2s", fontFamily: "'DM Sans', sans-serif" },
  toggleTrack: {
    width: 44, height: 24, borderRadius: 100,
    border: "none", position: "relative",
    transition: "background 0.25s ease", padding: 0,
    flexShrink: 0,
  },
  toggleThumb: {
    position: "absolute", top: 2,
    width: 20, height: 20, borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    transition: "transform 0.22s ease",
    display: "block",
  },
  saveBadge: {
    marginLeft: 8, fontSize: 10, fontWeight: 700,
    letterSpacing: "0.06em", textTransform: "uppercase",
    background: "#2D6A4F", color: "#fff",
    padding: "2px 8px", borderRadius: 100,
  },

  cardsRow: {
    display: "flex", gap: 24, alignItems: "stretch",
    justifyContent: "center", marginBottom: 64,
    flexWrap: "wrap",
  },
  card: {
    background: "#fff", borderRadius: 24,
    border: "1.5px solid #e8e2d8",
    padding: "36px 32px 40px",
    width: 360, flexShrink: 0,
    position: "relative",
    display: "flex", flexDirection: "column",
    transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
    animation: "fadeUp 0.5s ease forwards",
    opacity: 0,
    animationFillMode: "forwards",
  },
  cardFeatured: {
    background: "#1a2332",
    borderColor: "#2d3f55",
  },

  badge: {
    position: "absolute", top: -12, left: "50%",
    transform: "translateX(-50%)",
    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "#fff",
    padding: "4px 14px", borderRadius: 100,
    whiteSpace: "nowrap",
  },

  cardHeader: { marginBottom: 24, minHeight: 140 },
  tierName: {
    fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", marginBottom: 12,
    fontFamily: "'DM Sans', sans-serif",
  },
  priceRow: { display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 },
  price: {
    fontFamily: "'Lora', serif",
    fontSize: 48, fontWeight: 500, color: "#1e1e1e",
    lineHeight: 1,
  },
  pricePeriod: { fontSize: 13, color: "#8a7f72", fontWeight: 400 },
  tagline: { fontSize: 13, color: "#8a7f72", marginTop: 10, lineHeight: 1.5, fontWeight: 300 },

  ctaBtn: {
    width: "100%", padding: "13px",
    borderRadius: 12, fontSize: 14, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.02em", marginBottom: 24,
  },

  divider: { borderTop: "1px solid", marginBottom: 24 },
  featureList: { marginTop: 4 },


  comingSoon: {
    background: "#fff",
    borderRadius: 20,
    border: "1.5px solid #e8e2d8",
    padding: "28px 36px",
    marginBottom: 56,
    boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
  },
  comingSoonInner: { display: "flex", flexDirection: "column", gap: 10 },
  comingSoonTag: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "#B45309",
    background: "#fdf6ed", border: "1px solid #f5d9a8",
    padding: "3px 12px", borderRadius: 100,
    alignSelf: "flex-start",
  },
  comingSoonTitle: {
    fontFamily: "'Lora', serif", fontSize: 18,
    color: "#1e1e1e", fontWeight: 500,
  },
  comingSoonBody: { fontSize: 14, color: "#6b6058", lineHeight: 1.7, fontWeight: 300 },

    faqRow: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "24px 48px",
  },
  faqItem: {},
  faqQ: {
    fontFamily: "'Lora', serif", fontSize: 15,
    color: "#1e1e1e", marginBottom: 6, fontWeight: 500,
  },
  faqA: { fontSize: 13, color: "#6b6058", lineHeight: 1.65, fontWeight: 300 },

  footerLogo: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 12 },
  footerLine: { color: "#8a7f72", marginBottom: 8, fontStyle: "italic", fontFamily: "'Lora', serif" },
  footerMeta: { color: "#b0a99a", letterSpacing: "0.04em", fontSize: 11 },
};
