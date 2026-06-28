import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function MeetingDetails() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [meeting, setMeeting] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/history/all")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((m) => m._id === id);
        setMeeting(found);
      });
  }, [id]);

  if (!meeting) {
    return <div style={{ color: "white", padding: 20 }}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <h2>📌 Meeting Details</h2>

      <div style={styles.card}>
        <b>Room:</b> {meeting.roomId}
      </div>

      <div style={styles.card}>
        <b>Summary:</b>
        <p>{meeting.summary}</p>
      </div>

      <div style={styles.card}>
        <b>Transcript:</b>
        <p>{meeting.transcript}</p>
      </div>

      <div style={styles.card}>
        <b>Action Items:</b>
        <ul>
          {meeting.actionItems?.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 20,
    background: "#0a0a0a",
    color: "white",
    minHeight: "100vh",
  },
  card: {
    background: "#111",
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    border: "1px solid #222",
  },
};