import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout }        from "../store/authSlice";
import { setActivePeer, addMessage, setConnected } from "../store/chatSlice";
import { setAiRecommended, setOnboardingDone }     from "../store/mentorSlice";
import { fetchHistory }  from "../store/chatSlice";
import { chatApi, notificationApi, resumeApi, doubtApi, aiApi } from "../services/apiService";
import { wsClient }      from "../utils/websocket";
import { useTheme, tok } from "../utils/useTheme";
import { fetchRecommendations } from "../store/aiSlice";

/* ════ useInView ════ */
export function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

/* ════ Spinner ════ */
export function Spinner({ size = 20, color = "#5DCAA5" }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      border: "2px solid rgba(128,128,120,0.2)",
      borderTopColor: color,
      animation: "mc-spin .7s linear infinite",
      display: "inline-block",
    }} />
  );
}

/* ════ Input ════ */
export function Input({ label, t, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && <label style={{ fontSize: "12px", color: t.textMuted }}>{label}</label>}
      <input {...props} style={{
        background: t.inputBg, border: `0.5px solid ${t.border}`,
        borderRadius: "8px", padding: "10px 14px", fontSize: "13px",
        color: t.text, outline: "none", transition: "border-color .2s", width: "100%",
        ...props.style,
      }} />
    </div>
  );
}

/* ════ Button ════ */
export function Btn({ children, variant = "primary", t, style: s = {}, ...props }) {
  const base = {
    padding: "10px 20px", fontSize: "13px", fontWeight: 500,
    borderRadius: "8px", cursor: "pointer", border: "none",
    transition: "background .2s, transform .15s", ...s,
  };
  if (variant === "primary") return (
    <button {...props} className="mc-btn-primary"
      style={{ ...base, background: t.accentSolid, color: "#fff" }}>{children}</button>
  );
  if (variant === "ghost") return (
    <button {...props} className="mc-btn-ghost"
      style={{ ...base, background: "transparent", border: `0.5px solid ${t.borderSt}`, color: t.textMuted }}>{children}</button>
  );
  if (variant === "danger") return (
    <button {...props}
      style={{ ...base, background: t.dangerBg, color: t.danger, border: `0.5px solid ${t.danger}` }}>{children}</button>
  );
  return <button {...props} style={base}>{children}</button>;
}

/* ════ PopularityBadge ════ */
export function PopularityBadge({ score = 0, t }) {
  const tier = score >= 800 ? "🔥" : score >= 500 ? "⭐" : "●";
  return (
    <span style={{ fontSize: "11px", fontWeight: 500, color: t.accent,
      background: t.accentBg, padding: "3px 9px", borderRadius: "10px", flexShrink: 0 }}>
      {tier} {score}
    </span>
  );
}

/* ════ FlagBadge ════ */
export function FlagBadge({ type, t }) {
  const isSlacker = type === "SLACKER";
  return (
    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px",
      background: isSlacker ? t.amberBg : t.dangerBg,
      color: isSlacker ? t.amber : t.danger,
      fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "4px" }}>
      {isSlacker ? "⚠ Slacker" : "⛔ Fraud"}
    </span>
  );
}

/* ════ NotificationBell ════ */
export function NotificationBell({ t }) {
  const [open, setOpen]     = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    notificationApi.getAll()
      .then(({ data }) => { setNotifs(data); setUnread(data.filter((n) => !n.read).length); })
      .catch(() => {});
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => { setOpen((o) => !o); if (unread) notificationApi.markRead().then(() => setUnread(0)); }}
        style={{ background: "transparent", border: "none", cursor: "pointer",
          color: t.textMuted, fontSize: "18px", position: "relative", padding: "4px" }}>
        🔔
        {unread > 0 && (
          <span style={{ position: "absolute", top: 0, right: 0, width: "16px", height: "16px",
            borderRadius: "50%", background: t.accentSolid, color: "#fff",
            fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: "42px", width: "280px",
          background: t.surfaceBg, border: `0.5px solid ${t.border}`, borderRadius: "10px",
          overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 200 }}>
          <p style={{ padding: "10px 14px", fontSize: "11px", fontWeight: 500,
            color: t.textFaint, borderBottom: `0.5px solid ${t.border}` }}>Notifications</p>
          {notifs.length === 0 && (
            <p style={{ padding: "14px", fontSize: "12px", color: t.textFaint, textAlign: "center" }}>
              No notifications
            </p>
          )}
          {notifs.slice(0, 6).map((n) => (
            <div key={n.id} style={{ padding: "10px 14px",
              borderBottom: `0.5px solid ${t.border}`,
              background: n.read ? "transparent" : t.accentBg }}>
              <p style={{ fontSize: "12px", color: t.text }}>{n.message}</p>
              <p style={{ fontSize: "10px", color: t.textFaint, marginTop: "2px" }}>{n.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════ Navbar ════ */
export function Navbar({ t }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role } = useSelector((s) => s.auth);
  const { toggle, isDark } = useTheme();

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", height: "60px", background: t.navBg,
      backdropFilter: "blur(14px)", borderBottom: `0.5px solid ${t.border}` }}>

      <span onClick={() => navigate("/")} style={{ fontSize: "16px", fontWeight: 500,
        color: t.text, cursor: "pointer", letterSpacing: "-0.02em" }}>
        Mentor<span style={{ color: t.accent }}>Connect</span>
      </span>

      <div style={{ display: "flex", gap: "28px" }}>
        {[["/#how", "How it works"], ["/mentors", "Mentors"], ["/#features", "Features"]].map(([href, label]) => (
          <span key={href} onClick={() => navigate(href)} className="mc-nav-link"
            style={{ fontSize: "13px", color: t.textMuted, cursor: "pointer" }}>{label}</span>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button onClick={toggle} title="Toggle theme" style={{ width: "34px", height: "34px",
          borderRadius: "8px", background: t.accentBg, border: `0.5px solid ${t.accentBorder}`,
          color: t.accent, fontSize: "16px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isDark ? "☀" : "☽"}
        </button>
        {user ? (
          <>
            <NotificationBell t={t} />
            <span onClick={() => navigate(role === "MENTOR" ? "/mentor-dashboard" : "/student-dashboard")}
              style={{ width: "34px", height: "34px", borderRadius: "50%", background: t.accentBg,
                color: t.accent, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
              {user.name?.slice(0, 2).toUpperCase()}
            </span>
            <Btn variant="ghost" t={t} style={{ padding: "6px 14px", fontSize: "12px" }}
              onClick={() => dispatch(logout())}>Logout</Btn>
          </>
        ) : (
          <>
            <Btn variant="ghost" t={t} style={{ padding: "6px 14px", fontSize: "12px" }}
              onClick={() => navigate("/login")}>Sign in</Btn>
            <Btn variant="primary" t={t} style={{ padding: "6px 14px", fontSize: "12px" }}
              onClick={() => navigate("/register")}>Get started</Btn>
          </>
        )}
      </div>
    </nav>
  );
}

/* ════ MentorCard ════ */
export function MentorCard({ mentor, t, onContact }) {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);
  const COLORS = [
    { bg: "#E1F5EE", color: "#0F6E56" }, { bg: "#EEEDFE", color: "#3C3489" },
    { bg: "#FAECE7", color: "#712B13" }, { bg: "#E6F1FB", color: "#185FA5" },
  ];
  const ac = COLORS[mentor.name?.charCodeAt(0) % 4];

  return (
    <div className="mc-hover-card"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: t.surfaceBg, border: `0.5px solid ${hov ? t.accentSolid : t.border}`,
        borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column",
        gap: "14px", transition: "border-color .2s, transform .2s", cursor: "pointer" }}>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0,
          background: ac.bg, color: ac.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: 500 }}>
          {mentor.name?.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: t.text,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mentor.name}</p>
          <p style={{ fontSize: "11px", color: t.textTiny, marginTop: "2px" }}>
            {mentor.company} · {mentor.role}</p>
        </div>
        <PopularityBadge score={mentor.popularityScore} t={t} />
      </div>

      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {(mentor.skills || []).map((s) => (
          <span key={s} style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "10px",
            background: t.pillBg, color: t.textFaint }}>{s}</span>
        ))}
      </div>

      <div style={{ height: "3px", background: t.border, borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ height: "3px", background: t.accentSolid,
          width: `${Math.min((mentor.popularityScore / 1000) * 100, 100)}%`,
          borderRadius: "2px", transition: "width 1s ease" }} />
      </div>

      {mentor.fraudFlag && <FlagBadge type="FRAUD" t={t} />}

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => navigate(`/mentor/${mentor.id}`)}
          style={{ flex: 1, padding: "8px", fontSize: "12px", background: "transparent",
            border: `0.5px solid ${t.border}`, borderRadius: "6px",
            color: t.textMuted, cursor: "pointer" }}>View profile</button>
        <button onClick={() => onContact?.(mentor)}
          style={{ flex: 1, padding: "8px", fontSize: "12px", background: t.accentBg,
            border: `0.5px solid ${t.accentBorder}`, borderRadius: "6px",
            color: t.accent, cursor: "pointer", fontWeight: 500 }}>Contact →</button>
      </div>
    </div>
  );
}

/* ════ MentorFilter ════ */
export function MentorFilter({ filters, onChange, t }) {
  const [local, setLocal] = useState(filters || {});
  return (
    <aside style={{ width: "220px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
      <p style={{ fontSize: "12px", fontWeight: 500, color: t.textMuted }}>Filters</p>
      <Input label="Company" t={t} placeholder="e.g. Google"
        value={local.company || ""}
        onChange={(e) => setLocal({ ...local, company: e.target.value })} />
      <Input label="Skill" t={t} placeholder="e.g. DSA"
        value={local.skill || ""}
        onChange={(e) => setLocal({ ...local, skill: e.target.value })} />
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "12px", color: t.textMuted }}>Min popularity</label>
        <input type="range" min="0" max="1000" step="50"
          value={local.minScore || 0}
          onChange={(e) => setLocal({ ...local, minScore: e.target.value })}
          style={{ accentColor: t.accentSolid }} />
        <span style={{ fontSize: "11px", color: t.textFaint }}>{local.minScore || 0}+ pts</span>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <Btn variant="primary" t={t} style={{ flex: 1, padding: "8px", fontSize: "12px" }}
          onClick={() => onChange(local)}>Apply</Btn>
        <Btn variant="ghost" t={t} style={{ flex: 1, padding: "8px", fontSize: "12px" }}
          onClick={() => { setLocal({}); onChange({}); }}>Reset</Btn>
      </div>
    </aside>
  );
}

/* ════ ChatBox ════ */
export function ChatBox({ peerId, peerName, t }) {
  const dispatch  = useDispatch();
  const { user }  = useSelector((s) => s.auth);
  const messages  = useSelector((s) => s.chat.messages);
  const connected = useSelector((s) => s.chat.connected);
  const [text, setText]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const subRef    = useRef(null);

  useEffect(() => { if (peerId) dispatch(fetchHistory(peerId)); }, [peerId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (!connected || !user) return;
    subRef.current = wsClient.subscribe(`/user/${user.id}/queue/messages`,
      (msg) => dispatch(addMessage(msg)));
    return () => subRef.current?.unsubscribe?.();
  }, [connected, user]);

  const send = () => {
    if (!text.trim() || !connected) return;
    const msg = { senderId: user.id, receiverId: peerId, content: text, type: "TEXT" };
    wsClient.send("/app/chat.send", msg);
    dispatch(addMessage({ ...msg, timestamp: new Date().toISOString(), own: true }));
    setText("");
  };

  const sendFile = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setLoading(true);
    const form = new FormData(); form.append("file", file); form.append("receiverId", peerId);
    try { const { data } = await chatApi.sendFile(form); dispatch(addMessage({ ...data, own: true })); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%",
      background: t.surfaceBg, borderRadius: "12px",
      border: `0.5px solid ${t.border}`, overflow: "hidden" }}>

      <div style={{ padding: "14px 20px", borderBottom: `0.5px solid ${t.border}`,
        display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%",
          background: t.accentBg, color: t.accent,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
          {peerName?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 500, color: t.text }}>{peerName}</p>
          <p style={{ fontSize: "10px", color: connected ? t.accent : t.textFaint }}>
            {connected ? "● Online" : "○ Connecting…"}</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px",
        display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.map((msg, i) => {
          const isOwn = msg.senderId === user?.id || msg.own;
          return (
            <div key={i} style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "70%", padding: "10px 14px",
                borderRadius: isOwn ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                background: isOwn ? t.accentSolid : t.surfaceBg2,
                color: isOwn ? "#fff" : t.text, fontSize: "13px", lineHeight: 1.5 }}>
                {msg.type === "FILE"
                  ? <a href={msg.fileUrl} target="_blank" rel="noreferrer"
                      style={{ color: isOwn ? "#fff" : t.accent }}>
                      📎 {msg.fileName || "Attachment"}
                    </a>
                  : msg.content}
                <p style={{ fontSize: "10px", marginTop: "4px", textAlign: "right",
                  color: isOwn ? "rgba(255,255,255,0.6)" : t.textTiny }}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: "12px 16px", borderTop: `0.5px solid ${t.border}`,
        display: "flex", gap: "8px", alignItems: "center" }}>
        <label style={{ cursor: "pointer", color: t.textMuted, fontSize: "18px" }}>
          📎 <input type="file" style={{ display: "none" }} onChange={sendFile} />
        </label>
        <input value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Type a message…"
          style={{ flex: 1, background: t.inputBg, border: `0.5px solid ${t.border}`,
            borderRadius: "8px", padding: "9px 14px", fontSize: "13px", color: t.text, outline: "none" }} />
        {loading ? <Spinner size={18} /> : (
          <button onClick={send} style={{ padding: "9px 16px", background: t.accentSolid,
            border: "none", borderRadius: "8px", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 500 }}>
            Send
          </button>
        )}
      </div>
    </div>
  );
}

/* ════ DoubtThread ════ */
export function DoubtThread({ doubt, isMentor, t, onResolve }) {
  const [answer, setAnswer] = useState("");
  const [resolving, setResolving] = useState(false);

  const submit = async () => {
    if (!answer.trim()) return;
    setResolving(true);
    try { await doubtApi.resolve(doubt.id, answer); onResolve?.(); }
    finally { setResolving(false); }
  };

  return (
    <div style={{ background: t.surfaceBg, border: `0.5px solid ${t.border}`,
      borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <span style={{ fontSize: "20px" }}>❓</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "13px", color: t.text, lineHeight: 1.5 }}>{doubt.question}</p>
          <p style={{ fontSize: "10px", color: t.textFaint, marginTop: "4px" }}>
            {doubt.studentName} · {new Date(doubt.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span style={{ marginLeft: "auto", fontSize: "10px", padding: "2px 8px",
          borderRadius: "10px", height: "fit-content", flexShrink: 0,
          background: doubt.status === "RESOLVED" ? t.accentBg : t.amberBg,
          color: doubt.status === "RESOLVED" ? t.accent : t.amber }}>
          {doubt.status}
        </span>
      </div>
      {doubt.answer && (
        <div style={{ background: t.accentBg, borderRadius: "8px", padding: "12px",
          borderLeft: `3px solid ${t.accentSolid}` }}>
          <p style={{ fontSize: "11px", fontWeight: 500, color: t.accent, marginBottom: "6px" }}>Mentor's answer</p>
          <p style={{ fontSize: "13px", color: t.text, lineHeight: 1.5 }}>{doubt.answer}</p>
        </div>
      )}
      {isMentor && doubt.status === "OPEN" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer…" rows={3}
            style={{ background: t.inputBg, border: `0.5px solid ${t.border}`,
              borderRadius: "8px", padding: "10px 14px", fontSize: "13px",
              color: t.text, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
          <Btn variant="primary" t={t} onClick={submit} style={{ alignSelf: "flex-end" }}>
            {resolving ? "Submitting…" : "Resolve doubt ✓"}
          </Btn>
        </div>
      )}
    </div>
  );
}

/* ════ ResumeUploader ════ */
export function ResumeUploader({ mentorId, t, onUploaded }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const upload = async (file) => {
    if (!file || file.type !== "application/pdf") return alert("PDF files only");
    setUploading(true);
    const form = new FormData(); form.append("file", file); form.append("mentorId", mentorId);
    try { const { data } = await resumeApi.upload(form); setDone(true); onUploaded?.(data); }
    finally { setUploading(false); }
  };

  return (
    <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files[0]); }}
      style={{ border: `2px dashed ${dragging ? t.accentSolid : t.border}`,
        borderRadius: "12px", padding: "40px", textAlign: "center",
        background: dragging ? t.accentBg : t.surfaceBg, transition: "all .2s", cursor: "pointer" }}>
      {uploading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <Spinner size={28} /><p style={{ fontSize: "13px", color: t.textMuted }}>Uploading…</p>
        </div>
      ) : done ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "32px" }}>✅</span>
          <p style={{ fontSize: "13px", color: t.accent }}>Uploaded! Waiting for mentor review.</p>
        </div>
      ) : (
        <>
          <span style={{ fontSize: "36px", display: "block", marginBottom: "12px" }}>📄</span>
          <p style={{ fontSize: "14px", fontWeight: 500, color: t.text, marginBottom: "6px" }}>
            Drag & drop your resume (PDF)</p>
          <p style={{ fontSize: "12px", color: t.textFaint, marginBottom: "16px" }}>or click to browse</p>
          <label style={{ padding: "9px 20px", background: t.accentSolid, color: "#fff",
            borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: 500 }}>
            Browse PDF
            <input type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => upload(e.target.files[0])} />
          </label>
        </>
      )}
    </div>
  );
}

/* ════ ResumeGrader ════ */
export function ResumeGrader({ resume, t, onGraded }) {
  const [score, setScore]       = useState(resume.score || 50);
  const [feedback, setFeedback] = useState(resume.feedback || "");
  const [weakPoints, setWeak]   = useState((resume.weakPoints || []).join("\n"));
  const [saving, setSaving]     = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await resumeApi.grade(resume.id, {
        score, feedback, weakPoints: weakPoints.split("\n").filter(Boolean),
      });
      onGraded?.();
    } finally { setSaving(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <label style={{ fontSize: "12px", color: t.textMuted }}>Resume score</label>
          <span style={{ fontSize: "16px", fontWeight: 500,
            color: score >= 70 ? t.accent : score >= 40 ? t.amber : t.danger }}>{score}/100</span>
        </div>
        <input type="range" min="0" max="100" value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          style={{ width: "100%", accentColor: t.accentSolid }} />
      </div>
      <div>
        <label style={{ fontSize: "12px", color: t.textMuted, display: "block", marginBottom: "6px" }}>
          Weak points <span style={{ color: t.danger }}>(one per line)</span>
        </label>
        <textarea value={weakPoints} onChange={(e) => setWeak(e.target.value)} rows={4}
          placeholder={"Weak summary section\nNo quantified achievements"}
          style={{ width: "100%", background: t.inputBg, border: `0.5px solid ${t.border}`,
            borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: t.text,
            outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} />
      </div>
      <div>
        <label style={{ fontSize: "12px", color: t.textMuted, display: "block", marginBottom: "6px" }}>Overall feedback</label>
        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={5}
          placeholder="Your detailed written feedback…"
          style={{ width: "100%", background: t.inputBg, border: `0.5px solid ${t.border}`,
            borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: t.text,
            outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} />
      </div>
      <Btn variant="primary" t={t} onClick={save}>{saving ? "Saving…" : "Submit grade ✓"}</Btn>
    </div>
  );
}

/* ════ AIOnboarding ════ */
export function AIOnboarding({ t, onComplete }) {
  const dispatch = useDispatch();
  const [step, setStep]   = useState(0);
  const [data, setData]   = useState({ interests: "", targetCompanies: "", skills: "", goal: "" });
  const [loading, setLoading] = useState(false);

  const STEPS = [
    { key: "interests",       label: "What are your interests?",           placeholder: "DSA, Machine Learning, Web Dev…" },
    { key: "targetCompanies", label: "Which companies are you targeting?", placeholder: "Google, Amazon, Microsoft…"       },
    { key: "skills",          label: "Current skills you have",            placeholder: "Java, React, SQL…"                },
    { key: "goal",            label: "What do you need most help with?",   placeholder: "Resume review, mock interviews…"  },
  ];

  const next = async () => {
    if (step < STEPS.length - 1) { setStep(step + 1); return; }
    setLoading(true);
    try {
      const result = await dispatch(fetchRecommendations(data));
      dispatch(setOnboardingDone());
      onComplete?.();
    } finally { setLoading(false); }
  };

  const cur = STEPS[step];

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 0",
      display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%",
            background: i <= step ? t.accentSolid : t.border, transition: "background .3s" }} />
        ))}
      </div>
      <div style={{ background: t.surfaceBg, border: `0.5px solid ${t.border}`,
        borderRadius: "14px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <p style={{ fontSize: "11px", color: t.accent, textTransform: "uppercase",
            letterSpacing: ".08em", marginBottom: "6px" }}>Step {step + 1} of {STEPS.length}</p>
          <h3 style={{ fontSize: "18px", fontWeight: 500, color: t.text }}>{cur.label}</h3>
        </div>
        <textarea value={data[cur.key]} rows={3} placeholder={cur.placeholder}
          onChange={(e) => setData({ ...data, [cur.key]: e.target.value })}
          style={{ background: t.inputBg, border: `0.5px solid ${t.border}`,
            borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: t.text,
            outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {step > 0 && <Btn variant="ghost" t={t} onClick={() => setStep(step - 1)}>← Back</Btn>}
          <Btn variant="primary" t={t} style={{ marginLeft: "auto" }} onClick={next}>
            {loading ? <Spinner size={16} color="#fff" /> : step === STEPS.length - 1 ? "Find my mentors →" : "Next →"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
