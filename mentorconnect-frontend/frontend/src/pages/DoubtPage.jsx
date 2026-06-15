import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme, tok } from "../utils/useTheme";
import { Navbar, DoubtThread, Input, Btn } from "../components/index.jsx";
import { doubtApi } from "../services/apiService";

export default function DoubtPage() {
  const { isDark } = useTheme();
  const t = tok(isDark);
  const { user } = useSelector((s) => s.auth);
  const isMentor = user?.role === "MENTOR";
  const [doubts, setDoubts]     = useState([]);
  const [question, setQuestion] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [posting, setPosting]   = useState(false);
  const [key, setKey]           = useState(0);

  useEffect(() => {
    const load = isMentor ? doubtApi.list(user.id) : doubtApi.mine();
    load.then(({ data }) => setDoubts(data)).catch(() => {});
  }, [user, key]);

  const post = async () => {
    if (!question.trim()) return;
    setPosting(true);
    try { await doubtApi.create({ question, mentorId }); setQuestion(""); setMentorId(""); setKey((k) => k + 1); }
    finally { setPosting(false); }
  };

  return (
    <div style={{ background: t.pageBg, minHeight: "100vh", fontFamily: "'DM Sans',system-ui" }}>
      <Navbar t={t} />
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px" }}>
        <h1 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "28px",
          fontWeight: 400, color: t.text, marginBottom: "28px" }}>
          {isMentor ? "Doubt inbox" : "My doubts"}
        </h1>
        {!isMentor && (
          <div style={{ background: t.surfaceBg, border: `0.5px solid ${t.border}`,
            borderRadius: "12px", padding: "24px", marginBottom: "24px",
            display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: t.text }}>Ask a new doubt</p>
            <Input label="Mentor ID" t={t} value={mentorId} placeholder="Paste mentor's ID"
              onChange={(e) => setMentorId(e.target.value)} />
            <div>
              <label style={{ fontSize: "12px", color: t.textMuted, display: "block", marginBottom: "6px" }}>Your question</label>
              <textarea value={question} rows={4} onChange={(e) => setQuestion(e.target.value)}
                placeholder="Be specific — what exactly are you stuck on?"
                style={{ width: "100%", background: t.inputBg, border: `0.5px solid ${t.border}`,
                  borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: t.text,
                  outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} />
            </div>
            <Btn variant="primary" t={t} onClick={post} style={{ alignSelf: "flex-end" }}>
              {posting ? "Posting…" : "Post doubt →"}
            </Btn>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {doubts.map((d) => (
            <DoubtThread key={d.id} doubt={d} isMentor={isMentor} t={t} onResolve={() => setKey((k) => k + 1)} />
          ))}
          {doubts.length === 0 && (
            <p style={{ fontSize: "13px", color: t.textFaint, textAlign: "center", padding: "40px" }}>
              {isMentor ? "No doubts in your inbox yet." : "You haven't asked any doubts yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
