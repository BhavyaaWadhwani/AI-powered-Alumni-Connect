import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme, tok } from "../utils/useTheme";
import { NotificationBell, DoubtThread, ResumeGrader } from "../components/index.jsx";
import { doubtApi, resumeApi } from "../services/apiService";

export default function MentorDashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = tok(isDark);
  const { user } = useSelector((s) => s.auth);
  const [doubts, setDoubts] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    doubtApi.list(user.id).then(({ data }) => setDoubts(data)).catch(() => {});
    resumeApi.getFeedback(user.id).then(({ data }) => setResumes(data || [])).catch(() => {});
  }, [user, key]);

  const NAV = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "doubts",    icon: "❓", label: "Doubt inbox", badge: doubts.filter((d) => d.status === "OPEN").length },
    { id: "resumes",   icon: "📄", label: "Resume queue" },
    { id: "messages",  icon: "💬", label: "Messages" },
    { id: "profile",   icon: "👤", label: "My profile" },
  ];
  const openDoubts = doubts.filter((d) => d.status === "OPEN");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr",
      minHeight: "100vh", background: t.pageBg, fontFamily: "'DM Sans',system-ui" }}>
      <aside style={{ background: t.surfaceBg, borderRight: `0.5px solid ${t.border}`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: `0.5px solid ${t.border}`, marginBottom: "8px" }}>
          <span style={{ fontSize: "15px", fontWeight: 500, color: t.text }}>Mentor<span style={{ color: t.accent }}>Connect</span></span>
        </div>
        {NAV.map((item) => (
          <div key={item.id}
            onClick={() => { setActiveNav(item.id); if (item.id !== "dashboard") navigate(`/${item.id}`); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "9px 20px", fontSize: "13px", cursor: "pointer",
              background: activeNav === item.id ? t.accentBg : "transparent",
              color: activeNav === item.id ? t.accent : t.textMuted,
              borderLeft: `2px solid ${activeNav === item.id ? t.accentSolid : "transparent"}`,
              fontWeight: activeNav === item.id ? 500 : 400, transition: "all .15s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>{item.icon}</span> {item.label}
            </div>
            {item.badge > 0 && (
              <span style={{ fontSize: "10px", background: t.accentSolid, color: "#fff",
                borderRadius: "10px", padding: "1px 7px" }}>{item.badge}</span>
            )}
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: "20px", borderTop: `0.5px solid ${t.border}` }}>
          <p style={{ fontSize: "12px", color: t.textFaint }}>{user?.name}</p>
          <p style={{ fontSize: "11px", color: t.textTiny }}>{user?.company}</p>
        </div>
      </aside>

      <main style={{ padding: "32px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 500, color: t.text }}>Mentor dashboard</h1>
            <p style={{ fontSize: "13px", color: t.textFaint, marginTop: "2px" }}>{openDoubts.length} open doubts waiting</p>
          </div>
          <NotificationBell t={t} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "28px" }}>
          {[
            { label: "Open doubts",    value: openDoubts.length },
            { label: "Resolved",       value: doubts.filter((d) => d.status === "RESOLVED").length },
            { label: "Resume reviews", value: resumes.length },
            { label: "Popularity",     value: user?.popularityScore || 0 },
          ].map((s) => (
            <div key={s.label} style={{ background: t.surfaceBg, border: `0.5px solid ${t.border}`, borderRadius: "10px", padding: "16px 18px" }}>
              <p style={{ fontSize: "11px", color: t.textFaint, marginBottom: "4px" }}>{s.label}</p>
              <p style={{ fontSize: "26px", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: 400, color: t.text }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "28px" }}>
          <p style={{ fontSize: "13px", fontWeight: 500, color: t.textMuted, marginBottom: "12px" }}>Doubt inbox — resolve to earn points</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {openDoubts.slice(0, 5).map((d) => (
              <DoubtThread key={d.id} doubt={d} isMentor t={t} onResolve={() => setKey((k) => k + 1)} />
            ))}
            {openDoubts.length === 0 && (
              <p style={{ padding: "24px", textAlign: "center", fontSize: "13px", color: t.textFaint,
                background: t.surfaceBg, border: `0.5px solid ${t.border}`, borderRadius: "8px" }}>
                All caught up! No open doubts.</p>
            )}
          </div>
        </div>

        {resumes.filter((r) => !r.gradedAt).length > 0 && (
          <div>
            <p style={{ fontSize: "13px", fontWeight: 500, color: t.textMuted, marginBottom: "12px" }}>Resume review queue</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {resumes.filter((r) => !r.gradedAt).map((r) => (
                <div key={r.id} style={{ background: t.surfaceBg, border: `0.5px solid ${t.border}`, borderRadius: "10px", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "24px" }}>📄</span>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: t.text }}>{r.studentName}'s resume</p>
                      <p style={{ fontSize: "11px", color: t.textTiny }}>Uploaded {new Date(r.uploadedAt).toLocaleDateString()}</p>
                    </div>
                    <a href={r.fileUrl} target="_blank" rel="noreferrer"
                      style={{ marginLeft: "auto", fontSize: "12px", color: t.accent,
                        padding: "6px 12px", border: `0.5px solid ${t.accentBorder}`, borderRadius: "6px" }}>
                      View PDF ↗</a>
                  </div>
                  <ResumeGrader resume={r} t={t} onGraded={() => setKey((k) => k + 1)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
