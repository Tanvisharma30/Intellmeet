import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>IntellMeet</h2>

        <button style={styles.primaryBtn} onClick={() => navigate("/lobby")}>
          ➕ New Meeting
        </button>

        <button style={styles.secondaryBtn}>📅 Schedule</button>
        <button style={styles.secondaryBtn}>📁 Recordings</button>

        <div style={{ marginTop: "auto" }}>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div style={styles.main}>
        <h1 style={styles.title}>Welcome Back 👋</h1>
        <p style={styles.subtitle}>
          Start or join meetings instantly with your team
        </p>

        {/* Cards */}
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <h3>Start Instant Meeting</h3>
            <p>Quickly start a video call</p>
            <button
              style={styles.cardBtn}
              onClick={() => navigate("/lobby")}
            >
              Start
            </button>
          </div>

          <div style={styles.card}>
            <h3>Join Meeting</h3>
            <p>Enter meeting room</p>
            <button style={styles.cardBtn}>Join</button>
          </div>

          <div style={styles.card}>
            <h3>Schedule</h3>
            <p>Plan future meetings</p>
            <button style={styles.cardBtn}>View</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial",
    background: "#0f172a",
    color: "white",
  },

  sidebar: {
    width: "240px",
    background: "#111827",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  logo: {
    marginBottom: "20px",
  },

  primaryBtn: {
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "10px",
    background: "transparent",
    color: "#cbd5e1",
    border: "1px solid #334155",
    borderRadius: "8px",
    cursor: "pointer",
  },

  logoutBtn: {
    padding: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
  },

  main: {
    flex: 1,
    padding: "40px",
  },

  title: {
    fontSize: "28px",
    marginBottom: "8px",
  },

  subtitle: {
    color: "#94a3b8",
    marginBottom: "30px",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
  },

  cardBtn: {
    marginTop: "10px",
    padding: "8px 12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
