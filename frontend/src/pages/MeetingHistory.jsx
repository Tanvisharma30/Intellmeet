import { useEffect, useState } from "react";

export default function MeetingHistory() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch("http://localhost:5000/api/history");
      const data = await res.json();
      setHistory(data.history);
    };

    fetchHistory();
  }, []);

  return (
    <div style={styles.page}>
      <h2>Meeting History</h2>

      {history.length === 0 && <p>No meetings yet</p>}

      {history.map((m) => (
        <div key={m.id} style={styles.card}>
          <h4>Room: {m.roomId}</h4>
          <p><b>Summary:</b> {m.summary}</p>
          <p style={{ opacity: 0.6 }}>
            {new Date(m.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

const styles: any = {
  page: {
    padding: 20,
    color: "white",
    background: "#0a0a0a",
    minHeight: "100vh",
  },
  card: {
    padding: 12,
    border: "1px solid #222",
    borderRadius: 10,
    marginTop: 10,
  },
};