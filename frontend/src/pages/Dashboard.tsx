import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState<any[]>([]);

  const createMeeting = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    navigate(`/lobby?id=${roomId}`);
  };

  const joinMeeting = () => {
    const roomId = prompt("Enter Meeting ID");
    if (roomId) navigate(`/lobby?id=${roomId}`);
  };

  // ---------------- FETCH HISTORY ----------------
  useEffect(() => {
    fetch("http://localhost:5000/api/history/all")
      .then((res) => res.json())
      .then((data) => setMeetings(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>IntellMeet</div>

        <button style={styles.primaryBtn} onClick={createMeeting}>
          New Meeting
        </button>

        <button style={styles.secondaryBtn} onClick={joinMeeting}>
          Join Meeting
        </button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <h1 style={styles.title}>Welcome back 👋</h1>
        <p style={styles.subtitle}>Start or manage meetings</p>

        {/* QUICK ACTIONS */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Instant Meeting</h3>
            <button style={styles.cardBtn} onClick={createMeeting}>
              Start
            </button>
          </div>

          <div style={styles.card}>
            <h3>Join Meeting</h3>
            <button style={styles.cardBtn} onClick={joinMeeting}>
              Join
            </button>
          </div>
        </div>

        {/* HISTORY */}
        <div style={styles.history}>
          <h2>📅 Meeting History</h2>

          {meetings.length === 0 && (
            <p style={{ opacity: 0.6 }}>No meetings yet</p>
          )}

          {meetings.map((m) => (
            <div
              key={m._id}
              style={styles.historyCard}
              onClick={() => navigate(`/history?id=${m._id}`)} // ⭐ ADDED
            >
              <b>Room:</b> {m.roomId}

              <div style={styles.summary}>
                {m.summary?.slice(0, 120)}
              </div>

              <div style={styles.meta}>
                {new Date(m.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles: any = {
  page: {
    height: "100vh",
    display: "flex",
    background: "#0a0a0a",
    color: "white",
    overflow: "hidden",
  },

  sidebar: {
    width: 240,
    padding: 20,
    borderRight: "1px solid #1f1f1f",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  logo: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
  },

  main: {
    flex: 1,
    padding: 30,
    overflowY: "auto",
  },

  title: {
    fontSize: 24,
    marginBottom: 5,
  },

  subtitle: {
    opacity: 0.6,
    marginBottom: 20,
  },

  grid: {
    display: "flex",
    gap: 15,
  },

  card: {
    flex: 1,
    background: "#111",
    padding: 15,
    borderRadius: 10,
    border: "1px solid #222",
  },

  cardBtn: {
    marginTop: 10,
    padding: "6px 10px",
    background: "#3b82f6",
    border: "none",
    color: "white",
    borderRadius: 6,
  },

  primaryBtn: {
    padding: 10,
    background: "#3b82f6",
    border: "none",
    borderRadius: 8,
    color: "white",
  },

  secondaryBtn: {
    padding: 10,
    background: "transparent",
    border: "1px solid #333",
    borderRadius: 8,
    color: "white",
  },

  history: {
    marginTop: 30,
  },

  historyCard: {
    marginTop: 10,
    padding: 10,
    background: "#111",
    borderRadius: 8,
    border: "1px solid #222",
    cursor: "pointer", // ⭐ ADDED
  },

  summary: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 5,
  },

  meta: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 4,
  },
};