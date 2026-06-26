import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const createMeeting = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    navigate(`/lobby?id=${roomId}`);
  };

  const joinMeeting = () => {
    const roomId = prompt("Enter Meeting ID");
    if (roomId && roomId.trim() !== "") {
      navigate(`/lobby?id=${roomId}`);
    }
  };

  const scheduleMeeting = () => {
    alert("Schedule feature coming soon");
  };

  const viewRecordings = () => {
    alert("Recordings feature coming soon");
  };

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

        <button style={styles.secondaryBtn}>Schedule</button>
        <button style={styles.secondaryBtn}>Recordings</button>

        <div style={{ marginTop: "auto" }}>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>
          Start or join meetings instantly
        </p>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Start Instant Meeting</div>
            <div style={styles.cardText}>Create a room and invite others</div>
            <button style={styles.cardBtn} onClick={createMeeting}>
              Start
            </button>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Join Meeting</div>
            <div style={styles.cardText}>Enter a meeting ID</div>
            <button style={styles.cardBtn} onClick={joinMeeting}>
              Join
            </button>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Schedule</div>
            <div style={styles.cardText}>Plan meetings ahead</div>
            <button style={styles.cardBtn}>
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    height: "100vh",
    display: "flex",
    background: "radial-gradient(circle at top, #111827, #0f172a)",
    color: "white",
    fontFamily: "system-ui",
  },

  sidebar: {
    width: 260,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(10px)",
  },

  logo: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 30,
  },

  main: {
    flex: 1,
    padding: 40,
  },

  title: {
    fontSize: 28,
    margin: 0,
  },

  subtitle: {
    opacity: 0.6,
    marginTop: 8,
    marginBottom: 30,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },

  card: {
    padding: 20,
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  cardTitle: {
    fontWeight: 600,
    marginBottom: 6,
  },

  cardText: {
    opacity: 0.6,
    fontSize: 13,
    marginBottom: 12,
  },

  cardBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
  },

  primaryBtn: {
    padding: 10,
    background: "#3b82f6",
    border: "none",
    borderRadius: 10,
    color: "white",
    marginBottom: 10,
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: 10,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "white",
    marginBottom: 10,
    cursor: "pointer",
  },

  logoutBtn: {
    padding: 10,
    background: "#ef4444",
    border: "none",
    borderRadius: 10,
    color: "white",
    width: "100%",
    cursor: "pointer",
  },
};