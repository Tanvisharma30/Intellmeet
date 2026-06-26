import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

export default function MeetingRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const roomId = searchParams.get("id") || "";

  // Lobby state
  const settings = (location.state as any) || {};
  const micOn = settings?.micOn ?? true;
  const camOn = settings?.camOn ?? true;

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const socket = useRef<any>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [participants, setParticipants] = useState<string[]>([]);
  const [messages, setMessages] = useState([{ sender: "System", text: "Welcome" }]);
  const [input, setInput] = useState("");

  const [isMuted, setIsMuted] = useState(!micOn);
  const [isCameraOff, setIsCameraOff] = useState(!camOn);
  const [isSharing, setIsSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  // SOCKET
  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      socket.current.emit("join-room", roomId);

      setParticipants((prev) => {
        if (prev.includes(socket.current.id)) return prev;
        return [...prev, socket.current.id];
      });
    });

    socket.current.on("user-connected", (id: string) => {
      setParticipants((prev) => [...new Set([...prev, id])]);
    });

    socket.current.on("user-disconnected", (id: string) => {
      setParticipants((prev) => prev.filter((p) => p !== id));

      const peer = peersRef.current.get(id);
      if (peer) peer.close();
      peersRef.current.delete(id);

      setRemoteStreams((prev) => {
        const copy = new Map(prev);
        copy.delete(id);
        return copy;
      });
    });

    socket.current.on("receive-message", (data: any) => {
      setMessages((prev) => [...prev, { sender: data.sender, text: data.message }]);
    });

    return () => socket.current.disconnect();
  }, [roomId]);

  // CAMERA INIT (IMPORTANT FIX)
  useEffect(() => {
    const startMedia = async () => {
      const s = await navigator.mediaDevices.getUserMedia({
        video: camOn,
        audio: micOn,
      });

      setStream(s);

      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    };

    startMedia();
  }, []);

  // CHAT
  const sendMessage = () => {
    if (!input.trim()) return;

    socket.current.emit("send-message", {
      roomId,
      message: input,
      sender: "You",
    });

    setMessages((p) => [...p, { sender: "You", text: input }]);
    setInput("");
  };

  // CONTROLS
  const toggleMute = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsMuted((p) => !p);
  };

  const toggleCamera = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsCameraOff((p) => !p);
  };

  const startShare = async () => {
    const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
    setStream(screen);
    if (videoRef.current) videoRef.current.srcObject = screen;
    setIsSharing(true);
  };

  const stopShare = async () => {
    const cam = await navigator.mediaDevices.getUserMedia({
      video: camOn,
      audio: micOn,
    });

    setStream(cam);
    if (videoRef.current) videoRef.current.srcObject = cam;
    setIsSharing(false);
  };

  // RECORDING
  const startRecording = () => {
    if (!stream) return;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `meeting-${roomId}.webm`;
      a.click();
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // LEAVE
  const leaveMeeting = () => {
    stream?.getTracks().forEach((t) => t.stop());

    socket.current.emit("leave-room", roomId);

    peersRef.current.forEach((p) => p.close());
    peersRef.current.clear();

    navigate("/dashboard");
  };

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
        <div style={styles.videoGrid}>
          <video ref={videoRef} autoPlay playsInline style={styles.video} />

          {[...remoteStreams.entries()].map(([id, s]) => (
            <video
              key={id}
              autoPlay
              playsInline
              ref={(el) => {
                if (el) el.srcObject = s;
              }}
              style={styles.video}
            />
          ))}
        </div>

        {/* SIDE */}
        <div style={styles.side}>

          {/* PARTICIPANTS */}
          <div style={styles.card}>
            <div style={styles.title}>Participants</div>
            {participants.map((p) => (
              <div key={p} style={{ opacity: 0.8 }}>{p}</div>
            ))}
          </div>

          {/* CHAT */}
          <div style={{ ...styles.card, flex: 1 }}>
            <div style={styles.chat}>
              {messages.map((m, i) => (
                <div key={i}>
                  <b style={{ fontSize: 12, opacity: 0.6 }}>{m.sender}</b>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>

            <div style={styles.chatBox}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={styles.input}
                placeholder="Message"
              />
              <button onClick={sendMessage} style={styles.btnBlue}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div style={styles.controls}>

        <button style={styles.btn} onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>

        <button style={styles.btn} onClick={toggleCamera}>
          {isCameraOff ? "Camera On" : "Camera Off"}
        </button>

        <button style={styles.btn} onClick={isSharing ? stopShare : startShare}>
          {isSharing ? "Stop Share" : "Share Screen"}
        </button>

        <button style={styles.btn} onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Stop Recording" : "Record"}
        </button>

        <button style={styles.danger} onClick={leaveMeeting}>
          Leave
        </button>
      </div>
    </div>
  );
}

/* VERCEL STYLE UI */
const styles: any = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "radial-gradient(circle at top, #0f172a, #020617)",
    color: "white",
    fontFamily: "system-ui",
  },

  top: {
    padding: 14,
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },

  body: {
    flex: 1,
    display: "flex",
    gap: 12,
    padding: 12,
  },

  videoGrid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 12,
  },

  video: {
    width: "100%",
    height: 240,
    borderRadius: 14,
    background: "#0b1220",
    objectFit: "cover",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  side: {
    width: 320,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 12,
  },

  title: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 8,
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    fontSize: 14,
  },

  chatBox: {
    display: "flex",
    marginTop: 10,
  },

  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
  },

  controls: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    padding: 12,
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },

  btn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent",
    color: "white",
  },

  btnBlue: {
    padding: "8px 12px",
    borderRadius: 8,
    background: "#3b82f6",
    border: "none",
    color: "white",
  },

  danger: {
    padding: "8px 12px",
    borderRadius: 8,
    background: "#ef4444",
    border: "none",
    color: "white",
  },
};