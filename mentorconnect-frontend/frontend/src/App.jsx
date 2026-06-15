import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider } from "./utils/useTheme";
import "../src/styles/global.css";

import HomePage           from "./pages/HomePage";
import RegisterPage       from "./pages/RegisterPage";
import LoginPage          from "./pages/LoginPage";
import MentorSearchPage   from "./pages/MentorSearchPage";
import MentorProfilePage  from "./pages/MentorProfilePage";
import OnboardingPage     from "./pages/OnboardingPage";
import StudentDashboard   from "./pages/StudentDashboard";
import MentorDashboard    from "./pages/MentorDashboard";
import ChatPage           from "./pages/ChatPage";
import DoubtPage          from "./pages/DoubtPage";
import ResumeReviewPage   from "./pages/ResumeReviewPage";

function ProtectedRoute({ allowedRoles }) {
  const { token, role } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"           element={<HomePage />} />
          <Route path="/register"   element={<RegisterPage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/mentors"    element={<MentorSearchPage />} />
          <Route path="/mentor/:id" element={<MentorProfilePage />} />

          {/* Student only */}
          <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
            <Route path="/onboarding"        element={<OnboardingPage />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/chat/:mentorId"    element={<ChatPage />} />
            <Route path="/resume"            element={<ResumeReviewPage />} />
            <Route path="/doubts"            element={<DoubtPage />} />
          </Route>

          {/* Mentor only */}
          <Route element={<ProtectedRoute allowedRoles={["MENTOR"]} />}>
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
