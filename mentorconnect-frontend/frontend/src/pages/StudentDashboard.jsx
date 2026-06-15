import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme, tok } from "../utils/useTheme";
import { Navbar, NotificationBell, MentorCard } from "../components/index.jsx";
import { doubtApi, resumeApi } from "../services/apiService";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = tok(isDark);
  const { user } = useSelector((s) => s.auth);
  const { recommended } = useSelector((s) => s.ai);
  const [doubts, setDoubts] = useState([]);
  const [resume, setResume] = useState(null);
  const [activeNav, setActiveNav] = useState("dashboard");

  useEffect(() => {
    doubtApi.mine().then(({ data }) => setDoubts(data)).catch(() => {});
    if (user?.id) resumeApi.getFeedback(user.id).then(({ data }) => setResume(data?.[0])).catch(() => {});
  }, [user]);

  const NAV = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "mentors",   icon: "🔍", label: "Find Mentor" },
    { id: "doubts",    icon: "❓", label: "My Doubts" },
    { id: "resume",    icon: "📄", label: "Resume" },
    { id: "messages",  icon: "💬", label: "Messages" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr",
      minHeight: "100vh", background: t.pageBg, fontFamily: "'DM Sans',system-ui" }}>
      <aside style={{ background: t.surfaceBg, borderRight: `0.5px solid ${t.border}`,
        display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: `0.5px solid ${t.border}`, marginBottom: "8px" }}>
          <span style={{ fontSize: "15px", fontWeight: 500, color: t.text }}>
            Mentor<span style={{ color: t.accent }}>Connect</span></span>
        </div>
        {NAV.map((item) => (
          <div key={item.id}
            onClick={() => { setActiveNav(item.id); if (item.id !== "dashboard") navigate(`/${item.id}`); }}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 20px",
              fontSize: "13px", cursor: "pointer",
              background: activeNav === item.id ? t.accentBg : "transparent",
              color: activeNav === item.id ? t.accent : t.textMuted,
              borderLeft: `2px solid ${activeNav === item.id ? t.accentSolid : "transparent"}`,
              fontWeight: activeNav === item.id ? 500 : 400, transition: "all .15s" }}>
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: "20px", borderTop: `0.5px solid ${t.border}` }}>
          <p style={{ fontSize: "12px", color: t.textFaint }}>{user?.name || "Student"}</p>
          <p style={{ fontSize: "11px", color: t.textTiny }}>{user?.college}</p>
        </div>
      </aside>

      <main style={{ padding: "32px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 500, color: t.text }}>
              Good morning, {user?.name?.split(" ")[0]} 👋</h1>
            <p style={{ fontSize: "13px", color: t.textFaint, marginTop: "2px" }}>Here's what's happening</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <NotificationBell t={t} />
            <div style={{ width: "34px", height: "34px", borderRadius: "50%",
              background: t.accentBg, color: t.accent, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 500 }}>
              {user?.name?.slice(0, 2).toUpperCase() || "ST"}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "28px" }}>
          {[
            { label: "Doubts asked",  value: doubts.length, sub: "total" },
            { label: "Resolved",      value: doubts.filter((d) => d.status === "RESOLVED").length, sub: "answered" },
            { label: "Resume score",  value: resume?.score ? `${resume.score}/100` : "—", sub: "latest grade" },
          ].map((s) => (
            <div key={s.label} style={{ background: t.surfaceBg,
              border: `0.5px solid ${t.border}`, borderRadius: "10px", padding: "16px 18px" }}>
              <p style={{ fontSize: "11px", color: t.textFaint, marginBottom: "4px" }}>{s.label}</p>
              <p style={{ fontSize: "26px", fontFamily: "'Instrument Serif',Georgia,serif",
                fontWeight: 400, color: t.text }}>{s.value}</p>
              <p style={{ fontSize: "11px", color: t.accent, marginTop: "2px" }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {recommended.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: t.textMuted, marginBottom: "12px" }}>✦ Recommended mentors</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
              {recommended.slice(0, 4).map((m) => (
                <MentorCard key={m.id} mentor={m} t={t} onContact={() => navigate(`/chat/${m.id}`)} />
              ))}
            </div>
          </div>
        )}

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: t.textMuted }}>Recent doubts</p>
            <span onClick={() => navigate("/doubts")} style={{ fontSize: "12px", color: t.accent, cursor: "pointer" }}>View all →</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {doubts.slice(0, 4).map((d) => (
              <div key={d.id} style={{ background: t.surfaceBg, border: `0.5px solid ${t.border}`,
                borderRadius: "8px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                  background: d.status === "RESOLVED" ? t.accentSolid : t.amber }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.question}</p>
                  <p style={{ fontSize: "11px", color: t.textTiny, marginTop: "2px" }}>→ {d.mentorName}</p>
                </div>
                <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px",
                  background: d.status === "RESOLVED" ? t.accentBg : t.amberBg,
                  color: d.status === "RESOLVED" ? t.accent : t.amber, flexShrink: 0 }}>{d.status}</span>
              </div>
            ))}
            {doubts.length === 0 && (
              <p style={{ padding: "24px", textAlign: "center", fontSize: "13px", color: t.textFaint,
                background: t.surfaceBg, border: `0.5px solid ${t.border}`, borderRadius: "8px" }}>
                No doubts yet. <span onClick={() => navigate("/mentors")} style={{ color: t.accent, cursor: "pointer" }}>Find a mentor →</span>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
