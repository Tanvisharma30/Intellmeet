import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

export default function MeetingRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const roomId = searchParams.get("id") || "";
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const settings = (location.state as any) || {
    micOn: true,
    camOn: true,
  };

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const socket = useRef<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const streamRef = useRef<MediaStream | null>(null);

  // State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState<string[]>([]);

  const [isMuted, setIsMuted] = useState(!settings.micOn);
  const [isCameraOff, setIsCameraOff] = useState(!settings.camOn);
  const [isSharing, setIsSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // ---------------- SOCKET ----------------
  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      socket.current.emit("join-room", roomId);
    });

    socket.current.on("room-users", (users: string[]) => {
      setParticipants(users);
    });

    socket.current.on("receive-message", (data: any) => {
      setMessages((p) => [...p, data]);
    });

    socket.current.on("user-typing", (name: string) => {
      setTyping((p) => [...new Set([...p, name])]);

      setTimeout(() => {
        setTyping((p) => p.filter((x) => x !== name));
      }, 1500);
    });

    return () => socket.current.disconnect();
  }, [roomId]);

  // ---------------- CAMERA INIT (IMPORTANT FIX) ----------------
  useEffect(() => {
    const start = async () => {
      const s = await navigator.mediaDevices.getUserMedia({
        video: settings.camOn,
        audio: settings.micOn,
      });

      streamRef.current = s;
      setStream(s);

      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    };

    start();
  }, []);

  // ---------------- CHAT ----------------
  const sendMessage = () => {
    if (!input.trim()) return;

    socket.current.emit("send-message", {
      roomId,
      message: input,
      sender: user?.name || "User",
    });

    setMessages((p) => [...p, { sender: "You", message: input }]);
    setInput("");
  };

  // ---------------- CONTROLS ----------------
  const toggleMute = () => {
    const s = streamRef.current;
    if (!s) return;

    s.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsMuted((p) => !p);
  };

  const toggleCamera = () => {
    const s = streamRef.current;
    if (!s) return;

    s.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsCameraOff((p) => !p);
  };

  // ---------------- SCREEN SHARE ----------------
  const startShare = async () => {
    const screen = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    streamRef.current = screen;
    setStream(screen);

    if (videoRef.current) videoRef.current.srcObject = screen;
    setIsSharing(true);
  };

  const stopShare = async () => {
    const cam = await navigator.mediaDevices.getUserMedia({
      video: settings.camOn,
      audio: settings.micOn,
    });

    streamRef.current = cam;
    setStream(cam);

    if (videoRef.current) videoRef.current.srcObject = cam;
    setIsSharing(false);
  };

  // ---------------- RECORDING ----------------
  const startRecording = () => {
    const s = streamRef.current;
    if (!s) return;

    const rec = new MediaRecorder(s);
    mediaRecorderRef.current = rec;
    chunksRef.current = [];

    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

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

  // ---------------- LEAVE ----------------
  const leaveMeeting = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    socket.current.emit("leave-room", roomId);
    navigate("/dashboard");
  };

  // ---------------- UI ----------------
  return (
    <div style={styles.page}>
      {/* TOP BAR */}
      <div style={styles.top}>
        <div style={{ fontWeight: 600 }}>IntellMeet</div>
        <div style={{ opacity: 0.6 }}>Room: {roomId}</div>
      </div>

      {/* BODY */}
      <div style={styles.body}>
        {/* VIDEO */}
        <div style={styles.videoArea}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={styles.video}
          />
        </div>

        {/* SIDE PANEL */}
        <div style={styles.side}>
          <div style={styles.card}>
            <div style={styles.title}>Participants ({participants.length})</div>
            {participants.map((p) => (
              <div key={p}>{p}</div>
            ))}
          </div>

          <div style={styles.card}>
            <div style={{ height: 220, overflowY: "auto" }}>
              {messages.map((m, i) => (
                <div key={i}>
                  <b>{m.sender}</b>: {m.message}
                </div>
              ))}
            </div>

            {typing.length > 0 && (
              <div style={{ fontSize: 12, opacity: 0.6 }}>
                {typing.join(", ")} typing...
              </div>
            )}

            <div style={styles.chatInput}>
              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);

                  socket.current.emit("typing", {
                    roomId,
                    name: user?.name || "User",
                  });
                }}
                style={styles.input}
                placeholder="Message..."
              />
              <button onClick={sendMessage} style={styles.send}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
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
const styles: any = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0a0a0a",
    color: "white",
    fontFamily: "system-ui",
  },

  top: {
    padding: 14,
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #1f1f1f",
  },

  body: {
    flex: 1,
    display: "flex",
    gap: 12,
    padding: 12,
  },

  videoArea: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  video: {
    width: "95%",
    borderRadius: 16,
    background: "#111",
  },

  side: {
    width: 320,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  card: {
    background: "#111",
    borderRadius: 12,
    padding: 12,
    border: "1px solid #222",
  },

  title: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 8,
  },

  chatInput: {
    display: "flex",
    marginTop: 10,
    gap: 8,
  },

  input: {
    flex: 1,
    background: "#000",
    border: "1px solid #222",
    color: "white",
    padding: 6,
    borderRadius: 6,
  },

  send: {
    background: "#3b82f6",
    border: "none",
    color: "white",
    padding: "6px 10px",
    borderRadius: 6,
  },

  controls: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    padding: 12,
    borderTop: "1px solid #1f1f1f",
  },

  btn: {
    padding: "8px 12px",
    borderRadius: 8,
    background: "transparent",
    border: "1px solid #333",
    color: "white",
  },

  leave: {
    padding: "8px 12px",
    borderRadius: 8,
    background: "#ef4444",
    border: "none",
    color: "white",
  },
};