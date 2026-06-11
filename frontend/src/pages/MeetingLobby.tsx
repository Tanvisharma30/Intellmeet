import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState("");

  const joinMeeting = () => {
    if (!meetingId.trim()) return;

    navigate(`/meeting?id=${meetingId}`);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "20px",
          background: "#111827",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>Join Meeting</h2>

        <input
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
          placeholder="Enter Meeting ID"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "none",
          }}
        />

        <button
          onClick={joinMeeting}
          style={{
            width: "100%",
            padding: "10px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
}