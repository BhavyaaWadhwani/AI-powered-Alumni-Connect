import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme, tok } from "../utils/useTheme";
import { Navbar, ResumeUploader, ResumeGrader, Input } from "../components/index.jsx";
import { resumeApi } from "../services/apiService";

export default function ResumeReviewPage() {
  const { isDark } = useTheme();
  const t = tok(isDark);
  const { user } = useSelector((s) => s.auth);
  const isMentor = user?.role === "MENTOR";
  const [mentorId, setMentorId] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const load = () => resumeApi.getFeedback(user?.id).then(({ data }) => setFeedbacks(data || [])).catch(() => {});
  useEffect(() => { load(); }, [user]);

  return (
    <div style={{ background: t.pageBg, minHeight: "100vh", fontFamily: "'DM Sans',system-ui" }}>
      <Navbar t={t} />
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px" }}>
        <h1 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "28px",
          fontWeight: 400, color: t.text, marginBottom: "8px" }}>Resume review</h1>
        <p style={{ fontSize: "14px", color: t.textFaint, marginBottom: "32px" }}>
          {isMentor ? "Review resumes submitted by students." : "Upload your resume to get feedback from a mentor."}
        </p>

        {!isMentor && (
          <div style={{ marginBottom: "32px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <Input label="Mentor ID to send to" t={t} value={mentorId}
              placeholder="Paste mentor ID" onChange={(e) => setMentorId(e.target.value)} />
            <ResumeUploader mentorId={mentorId} t={t} onUploaded={load} />
          </div>
        )}

        {feedbacks.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: t.textMuted }}>
              {isMentor ? "Graded resumes" : "Your resume feedback"}</p>
            {feedbacks.map((r) => (
              <div key={r.id} style={{ background: t.surfaceBg, border: `0.5px solid ${t.border}`,
                borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "28px" }}>📄</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: t.text }}>
                      {isMentor ? r.studentName : "Your resume"}</p>
                    <p style={{ fontSize: "11px", color: t.textTiny }}>
                      {r.gradedAt ? `Graded ${new Date(r.gradedAt).toLocaleDateString()}` : "Pending review"}</p>
                  </div>
                  {r.score != null && (
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "28px", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: 400,
                        color: r.score >= 70 ? t.accent : r.score >= 40 ? t.amber : t.danger }}>{r.score}</p>
                      <p style={{ fontSize: "10px", color: t.textFaint }}>/ 100</p>
                    </div>
                  )}
                </div>
                {(r.weakPoints || []).length > 0 && (
                  <div style={{ background: t.dangerBg, borderRadius: "8px", padding: "12px",
                    borderLeft: `3px solid ${t.danger}` }}>
                    <p style={{ fontSize: "11px", fontWeight: 500, color: t.danger, marginBottom: "8px" }}>⚠ Weak points</p>
                    <ul style={{ paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {r.weakPoints.map((wp, i) => (
                        <li key={i} style={{ fontSize: "12px", color: t.text, lineHeight: 1.5 }}>{wp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {r.feedback && (
                  <div style={{ background: t.accentBg, borderRadius: "8px", padding: "12px",
                    borderLeft: `3px solid ${t.accentSolid}` }}>
                    <p style={{ fontSize: "11px", fontWeight: 500, color: t.accent, marginBottom: "6px" }}>Mentor's feedback</p>
                    <p style={{ fontSize: "13px", color: t.text, lineHeight: 1.6 }}>{r.feedback}</p>
                  </div>
                )}
                {isMentor && !r.gradedAt && <ResumeGrader resume={r} t={t} onGraded={load} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
