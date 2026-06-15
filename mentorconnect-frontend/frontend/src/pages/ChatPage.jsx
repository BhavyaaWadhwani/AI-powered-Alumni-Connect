import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme, tok } from "../utils/useTheme";
import { Navbar, ChatBox } from "../components/index.jsx";
import { wsClient } from "../utils/websocket";

export default function ChatPage() {
  const { mentorId } = useParams();
  const { isDark } = useTheme();
  const t = tok(isDark);
  const { activePeer } = useSelector((s) => s.chat);

  useEffect(() => {
    const token = localStorage.getItem("mc-token");
    if (token) wsClient.connect(token);
    return () => wsClient.disconnect();
  }, []);

  return (
    <div style={{ background: t.pageBg, minHeight: "100vh", fontFamily: "'DM Sans',system-ui" }}>
      <Navbar t={t} />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px",
        height: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
        <ChatBox peerId={mentorId} peerName={activePeer?.name || "Mentor"} t={t} />
      </div>
    </div>
  );
}
