import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, tok } from "../utils/useTheme";
import { useInView, Navbar } from "../components/index.jsx";

const STATS = [
  { value: "2,400+", label: "Students placed"      },
  { value: "380+",   label: "Active mentors"        },
  { value: "94%",    label: "Doubt resolution rate" },
  { value: "48 hr",  label: "Avg. first response"   },
];
const HOW_STEPS = [
  { n: "01", icon: "🎯", title: "Tell us your goal",      body: "Register as a student. Share your interests, target companies, and where you're stuck. Takes 2 minutes." },
  { n: "02", icon: "✦",  title: "AI finds your mentor",   body: "Our model embeds your interests and a mentor's skills, then ranks by fit — not just popularity." },
  { n: "03", icon: "💬", title: "One real conversation",  body: "Chat 1-on-1. Ask doubts. Share your resume. Get honest, specific feedback — not generic advice." },
  { n: "04", icon: "↑",  title: "Grow, repeat",           body: "Rate your mentor, earn insights, switch when ready. Your profile becomes a proof of work." },
];
const FEATURES = [
  { icon: "✦", title: "AI mentor matching",  body: "Not a directory. Our model ranks mentors by fit — not just popularity." },
  { icon: "◈", title: "Resume grading",      body: "Upload your PDF. Mentors score it and highlight weak points directly." },
  { icon: "⌁", title: "Threaded doubts",     body: "Ask specific questions. Every resolved doubt boosts the mentor's score." },
  { icon: "⚑", title: "Trust signals",       body: "AI detects slackers and generic mentors. Fraud flags keep quality high." },
  { icon: "↯", title: "Real-time chat",      body: "1-on-1 WebSocket messages. Send resume, ask follow-ups, share links." },
  { icon: "⊕", title: "Both sides matter",   body: "Mentors build credibility. Students get traction." },
];
const TESTIMONIALS = [
  { q: "Rohit reviewed my resume in 2 hours. Got my Amazon call the next week.", name: "Siddharth M.", college: "NIT Trichy · 2024", i: "SM" },
  { q: "The popularity system keeps me honest as a mentor.",                      name: "Priya Sharma",  college: "Microsoft SDE · Mentor", i: "PS" },
  { q: "Got a detailed answer here in 40 min. Everywhere else I was ignored.",    name: "Ananya R.",     college: "BITS Pilani · 2025", i: "AR" },
];
const FLOAT_MENTORS = [
  { initials: "AK", name: "Amit Kumar",   company: "Google",    role: "SWE",        score: 880, bg: "#E1F5EE", color: "#0F6E56", skills: ["DSA", "Java"] },
  { initials: "PS", name: "Priya Sharma", company: "Microsoft", role: "ML Engineer", score: 740, bg: "#EEEDFE", color: "#3C3489", skills: ["ML", "Python"] },
];

export default function HomePage() {
  const navigate   = useNavigate();
  const { isDark } = useTheme();
  const t          = tok(isDark);
  const [heroV, setHeroV]  = useState(false);
  const [statsRef, statsV] = useInView();
  const [howRef, howV]     = useInView();
  const [featRef, featV]   = useInView();
  const [testRef, testV]   = useInView();
  const [ctaRef, ctaV]     = useInView();

  useEffect(() => { const id = setTimeout(() => setHeroV(true), 80); return () => clearTimeout(id); }, []);

  const S = (extra = {}) => ({ ...extra }); // style helper passthrough

  return (
    <div style={{ background: t.pageBg, color: t.text, minHeight: "100vh",
      fontFamily: "'DM Sans',system-ui", overflowX: "hidden", transition: "background .3s,color .3s" }}>
      <Navbar t={t} />

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "92vh", display: "flex",
        alignItems: "center", padding: "80px 40px 60px", overflow: "hidden", background: t.pageBg }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
          backgroundSize: "48px 48px" }} />
        <div aria-hidden style={{ position: "absolute", top: "10%", left: "32%",
          width: "520px", height: "520px", borderRadius: "50%",
          background: `radial-gradient(circle,${t.orb} 0%,transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "580px",
          opacity: heroV ? 1 : 0, transform: heroV ? "translateY(0)" : "translateY(28px)",
          transition: "opacity .7s ease, transform .7s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "5px 14px", marginBottom: "28px",
            background: t.accentBg, border: `0.5px solid ${t.accentBorder}`,
            borderRadius: "20px", fontSize: "12px", color: t.accent }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%",
              background: t.accent, animation: "mc-pulse 2s ease infinite" }} />
            AI-powered · 1-on-1 mentorship
          </div>
          <h1 style={{ fontFamily: "'Instrument Serif',Georgia,serif",
            fontSize: "clamp(40px,5.5vw,68px)", fontWeight: 400,
            lineHeight: 1.1, color: t.text, letterSpacing: "-0.02em", marginBottom: "24px" }}>
            The mentor you<br />
            <span style={{ color: t.accent, fontStyle: "italic" }}>actually needed</span><br />
            during placement.
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.65, color: t.textFaint,
            maxWidth: "460px", marginBottom: "36px" }}>
            Find seniors placed at your dream companies. Chat directly, ask doubts,
            get your resume graded — no group chats, no generic advice.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
            <button className="mc-btn-primary" onClick={() => navigate("/register")}
              style={{ padding: "12px 28px", fontSize: "14px", fontWeight: 500,
                background: t.accentSolid, border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer" }}>
              Find your mentor →
            </button>
            <button className="mc-btn-ghost" onClick={() => navigate("/register?role=mentor")}
              style={{ padding: "12px 28px", fontSize: "14px", background: "transparent",
                border: `0.5px solid ${t.borderSt}`, borderRadius: "8px", color: t.textMuted, cursor: "pointer" }}>
              Become a mentor
            </button>
          </div>
          <p style={{ fontSize: "12px", color: t.textTiny }}>Free to join · No cold DMs · Real feedback</p>
        </div>

        {/* Floating cards */}
        <div aria-hidden style={{ position: "absolute", right: "6%", top: "50%",
          transform: "translateY(-50%)", display: "flex", flexDirection: "column",
          gap: "14px", zIndex: 2, opacity: heroV ? 1 : 0, transition: "opacity 1s ease .4s" }}>
          {FLOAT_MENTORS.map((m, i) => (
            <div key={m.name} style={{ display: "flex", alignItems: "center", gap: "12px",
              background: t.surfaceBg2, border: `0.5px solid ${t.border}`,
              borderRadius: "12px", padding: "14px 18px", width: "300px",
              marginTop: i === 1 ? "32px" : "0",
              animation: `mc-float ${5 + i}s ease-in-out infinite`, animationDelay: `${i * 0.6}s` }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                background: m.bg, color: m.color, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "13px", fontWeight: 500 }}>{m.initials}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: 500, color: t.textSub }}>{m.name}</p>
                <p style={{ fontSize: "11px", color: t.textFaint }}>{m.company} · {m.role}</p>
                <div style={{ display: "flex", gap: "4px", marginTop: "5px" }}>
                  {m.skills.map((s) => (
                    <span key={s} style={{ fontSize: "10px", padding: "2px 7px",
                      borderRadius: "10px", background: t.pillBg, color: t.pillText }}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{ fontSize: "18px", fontWeight: 500, color: t.accent, display: "block" }}>{m.score}</span>
                <span style={{ fontSize: "10px", color: t.textTiny }}>pts</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ borderTop: `0.5px solid ${t.border}`,
        borderBottom: `0.5px solid ${t.border}`, padding: "40px", background: t.pageBg }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center",
              padding: "20px", borderRight: `0.5px solid ${t.borderGrid}`,
              opacity: statsV ? 1 : 0, transform: statsV ? "translateY(0)" : "translateY(20px)",
              transition: `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s` }}>
              <span style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "40px",
                fontWeight: 400, color: t.text, lineHeight: 1, marginBottom: "6px" }}>{s.value}</span>
              <span style={{ fontSize: "12px", color: t.textFaint, textAlign: "center" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" ref={howRef} style={{ padding: "80px 40px", background: t.pageBg }}>
        <p style={{ fontSize: "11px", fontWeight: 500, color: t.accent, letterSpacing: ".1em",
          textTransform: "uppercase", marginBottom: "12px" }}>How it works</p>
        <h2 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)",
          fontWeight: 400, color: t.text, letterSpacing: "-0.02em", lineHeight: 1.2,
          marginBottom: "48px", maxWidth: "560px" }}>
          Four steps to your first real conversation
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px",
          background: t.borderGrid, border: `0.5px solid ${t.borderGrid}`,
          borderRadius: "12px", overflow: "hidden" }}>
          {HOW_STEPS.map((step, i) => (
            <div key={step.n} style={{ padding: "32px 28px", background: t.pageBg,
              opacity: howV ? 1 : 0, transform: howV ? "translateY(0)" : "translateY(24px)",
              transition: `opacity .5s ease ${i * 0.12}s, transform .5s ease ${i * 0.12}s` }}>
              <p style={{ fontSize: "11px", fontWeight: 500, color: t.accentSolid,
                letterSpacing: ".06em", marginBottom: "16px" }}>{step.n}</p>
              <span style={{ fontSize: "24px", display: "block", marginBottom: "14px" }}>{step.icon}</span>
              <h3 style={{ fontSize: "15px", fontWeight: 500, color: t.text,
                marginBottom: "10px", lineHeight: 1.3 }}>{step.title}</h3>
              <p style={{ fontSize: "13px", color: t.textFaint, lineHeight: 1.6 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" ref={featRef} style={{ padding: "80px 40px", background: t.altBg }}>
        <p style={{ fontSize: "11px", fontWeight: 500, color: t.accent, letterSpacing: ".1em",
          textTransform: "uppercase", marginBottom: "12px" }}>Platform features</p>
        <h2 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)",
          fontWeight: 400, color: t.text, letterSpacing: "-0.02em", lineHeight: 1.2,
          marginBottom: "48px", maxWidth: "560px" }}>
          Everything built for placement season
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px",
          background: t.borderGrid, border: `0.5px solid ${t.borderGrid}`,
          borderRadius: "12px", overflow: "hidden" }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} style={{ padding: "32px 28px", background: t.altBg,
              opacity: featV ? 1 : 0, transform: featV ? "translateY(0)" : "translateY(20px)",
              transition: `opacity .4s ease ${i * 0.08}s, transform .4s ease ${i * 0.08}s` }}>
              <span style={{ fontSize: "20px", display: "block", marginBottom: "14px", color: t.accent }}>{f.icon}</span>
              <h3 style={{ fontSize: "14px", fontWeight: 500, color: t.text, marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontSize: "13px", color: t.textFaint, lineHeight: 1.6 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section ref={testRef} style={{ padding: "80px 40px", background: t.pageBg }}>
        <p style={{ fontSize: "11px", fontWeight: 500, color: t.accent, letterSpacing: ".1em",
          textTransform: "uppercase", marginBottom: "12px" }}>What people say</p>
        <h2 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(28px,3.5vw,44px)",
          fontWeight: 400, color: t.text, letterSpacing: "-0.02em", lineHeight: 1.2,
          marginBottom: "48px", maxWidth: "560px" }}>Stories from both sides</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
          {TESTIMONIALS.map((item, i) => (
            <div key={item.name} style={{ background: t.surfaceBg, border: `0.5px solid ${t.border}`,
              borderRadius: "12px", padding: "24px", display: "flex",
              flexDirection: "column", justifyContent: "space-between", gap: "20px",
              opacity: testV ? 1 : 0, transform: testV ? "translateY(0)" : "translateY(20px)",
              transition: `opacity .5s ease ${i * 0.12}s, transform .5s ease ${i * 0.12}s` }}>
              <p style={{ fontSize: "14px", lineHeight: 1.65, color: t.textMuted,
                fontStyle: "italic", fontFamily: "'Instrument Serif',Georgia,serif" }}>"{item.q}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%",
                  background: t.accentBg, color: t.accent, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 500 }}>{item.i}</div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: t.text }}>{item.name}</p>
                  <p style={{ fontSize: "11px", color: t.textTiny, marginTop: "2px" }}>{item.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section ref={ctaRef} style={{ padding: "80px 40px", display: "flex",
        justifyContent: "center", background: t.altBg }}>
        <div style={{ position: "relative", textAlign: "center", maxWidth: "640px",
          width: "100%", padding: "60px 40px", background: t.surfaceBg,
          border: `0.5px solid ${t.border}`, borderRadius: "20px", overflow: "hidden",
          opacity: ctaV ? 1 : 0, transform: ctaV ? "scale(1)" : "scale(.97)",
          transition: "opacity .6s ease, transform .6s ease" }}>
          <div aria-hidden style={{ position: "absolute", top: "-60px", left: "50%",
            transform: "translateX(-50%)", width: "300px", height: "300px", borderRadius: "50%",
            background: `radial-gradient(circle,${t.orb} 0%,transparent 70%)`, pointerEvents: "none" }} />
          <p style={{ fontSize: "11px", color: t.accent, letterSpacing: ".1em",
            textTransform: "uppercase", marginBottom: "16px", position: "relative" }}>Ready?</p>
          <h2 style={{ fontFamily: "'Instrument Serif',Georgia,serif",
            fontSize: "clamp(26px,3vw,38px)", fontWeight: 400, color: t.text,
            letterSpacing: "-0.02em", lineHeight: 1.25, marginBottom: "18px", position: "relative" }}>
            Stop waiting for placement season<br />to figure things out.
          </h2>
          <p style={{ fontSize: "14px", color: t.textFaint, lineHeight: 1.65,
            marginBottom: "36px", position: "relative" }}>
            Join 2,400+ students who got real guidance from people<br />
            actually sitting inside the companies they wanted.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center",
            flexWrap: "wrap", position: "relative" }}>
            <button className="mc-btn-primary" onClick={() => navigate("/register")}
              style={{ padding: "12px 28px", fontSize: "14px", fontWeight: 500,
                background: t.accentSolid, border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer" }}>
              Start as a student →
            </button>
            <button className="mc-btn-ghost" onClick={() => navigate("/register?role=mentor")}
              style={{ padding: "12px 28px", fontSize: "14px", background: "transparent",
                border: `0.5px solid ${t.borderSt}`, borderRadius: "8px", color: t.textMuted, cursor: "pointer" }}>
              Join as a mentor
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `0.5px solid ${t.border}`, padding: "28px 40px",
        background: t.pageBg, display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <span style={{ fontSize: "14px", fontWeight: 500, color: t.text }}>
          Mentor<span style={{ color: t.accent }}>Connect</span>
        </span>
        <span style={{ fontSize: "12px", color: t.textGhost }}>Built for students who mean it.</span>
        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" style={{ fontSize: "12px", color: t.textTiny }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
