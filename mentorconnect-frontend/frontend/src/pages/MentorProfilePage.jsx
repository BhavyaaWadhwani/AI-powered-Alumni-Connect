import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMentorById } from "../store/mentorSlice";
import { useTheme, tok } from "../utils/useTheme";
import { Navbar, PopularityBadge, FlagBadge, Btn, Spinner } from "../components/index.jsx";

export default function MentorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const t = tok(isDark);
  const { selectedMentor: mentor } = useSelector((s) => s.mentor);

  useEffect(() => { dispatch(fetchMentorById(id)); }, [id]);

  if (!mentor) return (
    <div style={{ background: t.pageBg, minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}><Spinner size={36} /></div>
  );

  return (
    <div style={{ background: t.pageBg, minHeight: "100vh", fontFamily: "'DM Sans',system-ui" }}>
      <Navbar t={t} />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px" }}>
        <div style={{ background: t.surfaceBg, border: `0.5px solid ${t.border}`,
          borderRadius: "14px", padding: "32px", marginBottom: "20px",
          display: "flex", gap: "24px", alignItems: "flex-start" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", flexShrink: 0,
            background: t.accentBg, color: t.accent, fontSize: "22px", fontWeight: 500,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            {mentor.name?.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: 500, color: t.text }}>{mentor.name}</h1>
              {mentor.fraudFlag && <FlagBadge type="FRAUD" t={t} />}
              <PopularityBadge score={mentor.popularityScore} t={t} />
            </div>
            <p style={{ fontSize: "14px", color: t.textMuted, marginBottom: "12px" }}>
              {mentor.company} · {mentor.role}</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              {(mentor.skills || []).map((s) => (
                <span key={s} style={{ fontSize: "11px", padding: "3px 10px",
                  borderRadius: "10px", background: t.accentBg, color: t.accent }}>{s}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Btn variant="primary" t={t} onClick={() => navigate(`/chat/${mentor.id}`)}>
                Chat with {mentor.name?.split(" ")[0]} →
              </Btn>
              <Btn variant="ghost" t={t} onClick={() => navigate(`/doubts?mentorId=${mentor.id}`)}>
                Ask a doubt
              </Btn>
            </div>
          </div>
        </div>

        {(mentor.achievements || []).length > 0 && (
          <div style={{ background: t.surfaceBg, border: `0.5px solid ${t.border}`,
            borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: 500, color: t.textMuted,
              marginBottom: "14px", textTransform: "uppercase", letterSpacing: ".06em" }}>Achievements</p>
            {mentor.achievements.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                <span style={{ color: t.accent }}>✦</span>
                <p style={{ fontSize: "13px", color: t.text, lineHeight: 1.5 }}>{a}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
          {[
            { label: "Doubts resolved", value: mentor.resolvedDoubtCount || 0 },
            { label: "Popularity score", value: mentor.popularityScore || 0 },
            { label: "Reviews", value: (mentor.reviewList || []).length },
          ].map((stat) => (
            <div key={stat.label} style={{ background: t.surfaceBg,
              border: `0.5px solid ${t.border}`, borderRadius: "10px",
              padding: "20px", textAlign: "center" }}>
              <p style={{ fontSize: "28px", fontFamily: "'Instrument Serif',Georgia,serif",
                fontWeight: 400, color: t.text, marginBottom: "4px" }}>{stat.value}</p>
              <p style={{ fontSize: "12px", color: t.textFaint }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
