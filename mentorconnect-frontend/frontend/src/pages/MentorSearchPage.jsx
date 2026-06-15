import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMentors } from "../store/mentorSlice";
import { setActivePeer } from "../store/chatSlice";
import { useTheme, tok } from "../utils/useTheme";
import { Navbar, MentorCard, MentorFilter, Spinner } from "../components/index.jsx";

export default function MentorSearchPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const t = tok(isDark);
  const { list: mentors, aiRecommended, loading } = useSelector((s) => s.mentor);
  const [filters, setFilters] = useState({});

  useEffect(() => { dispatch(fetchMentors(filters)); }, [filters]);

  const handleContact = (mentor) => {
    dispatch(setActivePeer({ id: mentor.id, name: mentor.name }));
    navigate(`/chat/${mentor.id}`);
  };

  return (
    <div style={{ background: t.pageBg, minHeight: "100vh", fontFamily: "'DM Sans',system-ui" }}>
      <Navbar t={t} />
      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "32px",
          fontWeight: 400, color: t.text, marginBottom: "8px" }}>Find a mentor</h1>
        <p style={{ fontSize: "14px", color: t.textFaint, marginBottom: "32px" }}>
          Browse mentors matched to your profile. AI-ranked by fit.</p>

        {aiRecommended.length > 0 && (
          <div style={{ marginBottom: "36px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, color: t.accent,
              textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "12px" }}>
              ✦ AI recommended for you</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
              {aiRecommended.slice(0, 3).map((m) => (
                <MentorCard key={m.id} mentor={m} t={t} onContact={handleContact} />
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "28px" }}>
          <MentorFilter filters={filters} onChange={setFilters} t={t} />
          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
                <Spinner size={32} /></div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
                {mentors.map((m) => (
                  <MentorCard key={m.id} mentor={m} t={t} onContact={handleContact} />
                ))}
                {mentors.length === 0 && (
                  <p style={{ color: t.textFaint, fontSize: "13px", gridColumn: "1/-1",
                    textAlign: "center", padding: "40px" }}>No mentors found. Try adjusting filters.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
