import { useNavigate } from "react-router-dom";
import { useTheme, tok } from "../utils/useTheme";
import { Navbar, AIOnboarding } from "../components/index.jsx";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = tok(isDark);
  return (
    <div style={{ background: t.pageBg, minHeight: "100vh", fontFamily: "'DM Sans',system-ui" }}>
      <Navbar t={t} />
      <AIOnboarding t={t} onComplete={() => navigate("/student-dashboard")} />
    </div>
  );
}
