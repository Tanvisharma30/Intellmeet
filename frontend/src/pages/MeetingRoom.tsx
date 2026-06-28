import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

export default function MeetingRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("id") || "";

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const socket = useRef<any>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [participants, setParticipants] = useState<string[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  // STEP 3 (TASKS)
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskInput, setTaskInput] = useState("");

  // ---------------- SOCKET ----------------
  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      socket.current.emit("join-room", roomId);
    });

    socket.current.on("room-users", (users: string[]) => {
      setParticipants([...new Set(users)]);
    });

    socket.current.on("receive-message", (data: any) => {
      setMessages((p) => [...p, data]);
    });

    return () => socket.current.disconnect();
  }, [roomId]);

  // ---------------- CAMERA ----------------
  useEffect(() => {
    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    };

    start();
  }, []);

  // ---------------- TASK FETCH (STEP 3) ----------------
  useEffect(() => {
    fetch(`http://localhost:5000/api/tasks?roomId=${roomId}`)
      .then((res) => res.json())
      .then(setTasks)
      .catch(console.log);
  }, [roomId]);

  // ---------------- CHAT ----------------
  const sendMessage = () => {
    if (!input.trim()) return;

    socket.current.emit("send-message", {
      roomId,
      message: input,
      sender: user?.name || "You",
    });

    setMessages((p) => [...p, { sender: "You", message: input }]);
    setInput("");
  };

  // ---------------- CONTROLS ----------------
  const toggleMute = () => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsMuted((p) => !p);
  };

  const toggleCamera = () => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsCameraOff((p) => !p);
  };

  const startShare = async () => {
    const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
    streamRef.current = screen;
    if (videoRef.current) videoRef.current.srcObject = screen;
    setIsSharing(true);
  };

  const stopShare = async () => {
    const cam = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    streamRef.current = cam;
    if (videoRef.current) videoRef.current.srcObject = cam;
    setIsSharing(false);
  };

  // ---------------- TASK CREATE (STEP 3) ----------------
  const createTask = async () => {
    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId,
        title: taskInput,
        status: "todo",
      }),
    });

    const data = await res.json();
    setTasks((p) => [...p, data]);
    setTaskInput("");
  };

  // ---------------- RECORDING ----------------
  const startRecording = () => {
    if (!streamRef.current) return;

    const rec = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = rec;
    chunksRef.current = [];

    rec.ondataavailable = (e) => chunksRef.current.push(e.data);

    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `meeting-${roomId}.webm`;
      a.click();
    };

    rec.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // ---------------- AI ----------------
  const generateTranscript = async () => {
    try {
      setLoadingAI(true);

      const res = await fetch("http://localhost:5000/api/ai/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioText: messages.map((m) => m.message).join(" "),
        }),
      });

      const data = await res.json();
      setTranscript(data.transcript || "No transcript generated");
    } catch {
      setTranscript("Error generating transcript");
    } finally {
      setLoadingAI(false);
    }
  };

  const generateSummary = async () => {
    try {
      setLoadingAI(true);

      const res = await fetch("http://localhost:5000/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      const data = await res.json();

      setSummary(data.summary || "No summary generated");
      setActionItems(data.actionItems || []);
    } catch {
      setSummary("Error generating summary");
    } finally {
      setLoadingAI(false);
    }
  };

  // ---------------- STEP 4: SAVE MEETING ----------------
  const saveMeeting = async () => {
    try {
      await fetch("http://localhost:5000/api/history/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          transcript,
          summary,
          actionItems,
        }),
      });
    } catch (err) {
      console.log("Save failed");
    }
  };

  // ---------------- LEAVE MEETING (STEP 4) ----------------
  const leaveMeeting = async () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    socket.current.emit("leave-room", roomId);

    await saveMeeting();

    navigate("/dashboard");
  };

  return (
    <div style={styles.page}>
      <div style={styles.top}>
        <div>IntellMeet</div>
        <div>Room: {roomId}</div>
      </div>

      <div style={styles.body}>
        <div style={styles.videoArea}>
          <video ref={videoRef} autoPlay playsInline style={styles.video} />
        </div>

        <div style={styles.side}>

          <div style={styles.card}>
            <div>Participants ({participants.length})</div>
            {participants.map((p) => (
              <div key={p}>🟢 {p}</div>
            ))}
          </div>

          <div style={styles.card}>
            <div style={styles.chatBox}>
              {messages.map((m, i) => (
                <div key={i}>
                  <b>{m.sender}</b>: {m.message}
                </div>
              ))}
            </div>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.input}
              placeholder="Message..."
            />

            <button onClick={sendMessage} style={styles.btn}>
              Send
            </button>
          </div>

          <div style={styles.card}>
            <div>AI Features</div>

            <button onClick={generateTranscript} style={styles.btn}>
              AI Transcribe
            </button>

            <button onClick={generateSummary} style={styles.btn}>
              AI Summary
            </button>

            <div style={styles.aiBox}>
              {loadingAI && <p>Processing...</p>}
              {transcript && <p><b>Transcript:</b> {transcript}</p>}
              {summary && <p><b>Summary:</b> {summary}</p>}
              {actionItems.length > 0 && (
                <>
                  <b>Action Items:</b>
                  <ul>
                    {actionItems.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* TASKS (STEP 3) */}
          <div style={styles.card}>
            <div>Tasks</div>

            <input
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="New task..."
              style={styles.input}
            />

            <button onClick={createTask} style={styles.btn}>
              Add Task
            </button>

            <div style={{ marginTop: 10 }}>
              {tasks.map((t) => (
                <div key={t._id}>
                  <b>{t.title}</b> - {t.status}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div style={styles.controls}>
        <button onClick={toggleMute} style={styles.btn}>
          {isMuted ? "Unmute" : "Mute"}
        </button>

        <button onClick={toggleCamera} style={styles.btn}>
          {isCameraOff ? "Cam On" : "Cam Off"}
        </button>

        <button onClick={isSharing ? stopShare : startShare} style={styles.btn}>
          {isSharing ? "Stop Share" : "Share"}
        </button>

        <button onClick={isRecording ? stopRecording : startRecording} style={styles.btn}>
          {isRecording ? "Stop Rec" : "Record"}
        </button>

        <button onClick={leaveMeeting} style={styles.leave}>
          Leave
        </button>
      </div>
    </div>
  );
}

/* ---------------- STYLES (UNCHANGED, ONLY SAFE FIXS) ---------------- */
const styles: any = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0a0a0a",
    color: "white",
    overflow: "hidden",
  },

  top: {
    padding: 12,
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #1f1f1f",
  },

  body: {
    flex: 1,
    display: "flex",
    gap: 12,
    padding: 12,
    overflow: "hidden",
  },

  videoArea: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  video: {
    width: "95%",
    maxHeight: "75vh",
    borderRadius: 16,
    background: "#111",
  },

  side: {
    width: 320,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "auto",
  },

  card: {
    background: "#111",
    borderRadius: 12,
    padding: 12,
    border: "1px solid #222",
  },

  chatBox: {
    height: 140,
    overflowY: "auto",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    padding: 6,
    background: "#000",
    color: "white",
    border: "1px solid #333",
  },

  btn: {
    marginTop: 6,
    marginRight: 5,
    padding: "6px 10px",
    background: "transparent",
    border: "1px solid #333",
    color: "white",
    borderRadius: 6,
    cursor: "pointer",
  },

  leave: {
    padding: "6px 10px",
    background: "red",
    border: "none",
    color: "white",
    borderRadius: 6,
  },

  aiBox: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.85,
  },

  controls: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    padding: 10,
    borderTop: "1px solid #1f1f1f",
  },
};