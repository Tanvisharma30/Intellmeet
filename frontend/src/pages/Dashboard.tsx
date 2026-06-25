import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const createMeeting = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/meetings/create", {
        method: "POST",
        headers: {
          Authorization: token || "",
        },
      });

      const data = await res.json();

      navigate(`/meeting?id=${data.roomId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const joinMeeting = () => {
    const roomId = prompt("Enter Meeting ID");
    if (roomId) navigate(`/meeting?id=${roomId}`);
  };

  const scheduleMeeting = () => alert("Coming soon");
  const viewRecordings = () => alert("Coming soon");

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>IntellMeet</h2>

        <button style={styles.primaryBtn} onClick={createMeeting}>
          ➕ New Meeting
        </button>

        <button style={styles.secondaryBtn} onClick={scheduleMeeting}>
          📅 Schedule
        </button>

        <button style={styles.secondaryBtn} onClick={viewRecordings}>
          📁 Recordings
        </button>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div style={styles.main}>
        <h1>Welcome 👋</h1>
        <p>Start or join meetings instantly</p>

        <button onClick={createMeeting}>Start Instant Meeting</button>
        <button onClick={joinMeeting}>Join Meeting</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: "flex", height: "100vh", background: "#0f172a", color: "white" },
  sidebar: { width: 240, padding: 20, background: "#111827", display: "flex", flexDirection: "column", gap: 10 },
  logo: { marginBottom: 20 },
  primaryBtn: { padding: 10, background: "#2563eb", color: "white", border: "none" },
  secondaryBtn: { padding: 10, background: "transparent", color: "white", border: "1px solid gray" },
  logoutBtn: { marginTop: "auto", padding: 10, background: "red", color: "white" },
  main: { flex: 1, padding: 40 },
};