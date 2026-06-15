import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../store/authSlice";
import { useTheme, tok } from "../utils/useTheme";
import { Input, Btn, Spinner } from "../components/index.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const t = tok(isDark);
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async () => {
    const result = await dispatch(loginThunk(form));
    if (loginThunk.fulfilled.match(result)) {
      navigate(result.payload.user.role === "MENTOR" ? "/mentor-dashboard" : "/student-dashboard");
    }
  };

  return (
    <div style={{ background: t.pageBg, minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", padding: "40px 20px",
      fontFamily: "'DM Sans',system-ui" }}>
      <div style={{ background: t.surfaceBg, border: `0.5px solid ${t.border}`,
        borderRadius: "14px", padding: "36px", maxWidth: "400px", width: "100%",
        display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontFamily: "'Instrument Serif',Georgia,serif",
            fontWeight: 400, color: t.text, marginBottom: "6px" }}>Welcome back</h1>
          <p style={{ fontSize: "13px", color: t.textFaint }}>Sign in to continue</p>
        </div>
        {error && (
          <div style={{ padding: "10px 14px", background: t.dangerBg,
            border: `0.5px solid ${t.danger}`, borderRadius: "8px",
            fontSize: "12px", color: t.danger }}>{error}</div>
        )}
        <Input label="Email" t={t} type="email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Password" t={t} type="password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && submit()} />
        <Btn variant="primary" t={t} onClick={submit} style={{ marginTop: "4px" }}>
          {loading ? <Spinner size={16} color="#fff" /> : "Sign in →"}
        </Btn>
        <p style={{ fontSize: "12px", color: t.textFaint, textAlign: "center" }}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} style={{ color: t.accent, cursor: "pointer" }}>Register</span>
        </p>
      </div>
    </div>
  );
}
