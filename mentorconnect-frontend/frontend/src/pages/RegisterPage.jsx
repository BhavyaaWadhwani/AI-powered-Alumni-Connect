import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../store/authSlice";
import { useTheme, tok } from "../utils/useTheme";
import { Input, Btn, Spinner } from "../components/index.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const t = tok(isDark);
  const { loading, error } = useSelector((s) => s.auth);
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({ name:"", email:"", password:"", college:"", company:"", skills:"" });

  const submit = async () => {
    const result = await dispatch(registerThunk({
      ...form, role, skills: form.skills.split(",").map((s) => s.trim()),
    }));
    if (registerThunk.fulfilled.match(result)) {
      navigate(role === "MENTOR" ? "/mentor-dashboard" : "/onboarding");
    }
  };

  return (
    <div style={{ background: t.pageBg, minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", padding: "40px 20px",
      fontFamily: "'DM Sans',system-ui" }}>
      <div style={{ background: t.surfaceBg, border: `0.5px solid ${t.border}`,
        borderRadius: "14px", padding: "36px", maxWidth: "440px", width: "100%",
        display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontFamily: "'Instrument Serif',Georgia,serif",
            fontWeight: 400, color: t.text, marginBottom: "6px" }}>
            {step === 0 ? "Join MentorConnect" : `Register as ${role === "MENTOR" ? "Mentor" : "Student"}`}
          </h1>
          <p style={{ fontSize: "13px", color: t.textFaint }}>
            {step === 0 ? "Choose how you want to use the platform." : "Fill in your details to get started."}
          </p>
        </div>
        {error && (
          <div style={{ padding: "10px 14px", background: t.dangerBg,
            border: `0.5px solid ${t.danger}`, borderRadius: "8px",
            fontSize: "12px", color: t.danger }}>{error}</div>
        )}
        {step === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[["STUDENT","🎓","I want to find a mentor and get guidance"],
              ["MENTOR","💼","I want to mentor students and share experience"]].map(([r, icon, desc]) => (
              <div key={r} onClick={() => { setRole(r); setStep(1); }}
                style={{ padding: "16px", border: `0.5px solid ${role===r ? t.accentSolid : t.border}`,
                  borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px",
                  background: role===r ? t.accentBg : t.surfaceBg, transition: "all .2s" }}>
                <span style={{ fontSize: "24px" }}>{icon}</span>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: t.text }}>{r}</p>
                  <p style={{ fontSize: "12px", color: t.textFaint, marginTop: "2px" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <Input label="Full name" t={t} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" t={t} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Password" t={t} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {role === "STUDENT" && (
              <Input label="College" t={t} value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
            )}
            {role === "MENTOR" && (
              <>
                <Input label="Company" t={t} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <Input label="Skills (comma separated)" t={t} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
              </>
            )}
            <Btn variant="primary" t={t} onClick={submit} style={{ marginTop: "4px" }}>
              {loading ? <Spinner size={16} color="#fff" /> : "Create account →"}
            </Btn>
            <button onClick={() => setStep(0)} style={{ background: "transparent", border: "none",
              color: t.textFaint, fontSize: "12px", cursor: "pointer", textAlign: "left" }}>← Change role</button>
          </>
        )}
        <p style={{ fontSize: "12px", color: t.textFaint, textAlign: "center" }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={{ color: t.accent, cursor: "pointer" }}>Sign in</span>
        </p>
      </div>
    </div>
  );
}
