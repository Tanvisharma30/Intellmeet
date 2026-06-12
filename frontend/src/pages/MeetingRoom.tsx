import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

export default function MeetingRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("id") || "";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const socket = useRef<any>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  const [messages, setMessages] = useState([
    { sender: "System", text: "Welcome to meeting" },
  ]);

  const [input, setInput] = useState("");

  const [peers, setPeers] = useState<any[]>([]);

  // ---------------- SOCKET ----------------
  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      console.log("Socket connected:", socket.current.id);

      socket.current.emit("join-room", roomId);
    });

    // RECEIVE MESSAGE
    socket.current.on("receive-message", (data: any) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: data.sender,
          text: data.message,
        },
      ]);
    });

    socket.current.on("user-connected", (id: string) => {
      setMessages((prev) => [
        ...prev,
        { sender: "System", text: `User joined: ${id}` },
      ]);
    });

    socket.current.on("user-disconnected", (id: string) => {
      setMessages((prev) => [
        ...prev,
        { sender: "System", text: `User left: ${id}` },
      ]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [roomId]);

  // ---------------- CAMERA ----------------
  useEffect(() => {
    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(s);

        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.log("Camera error:", err);
      }
    };

    startCamera();
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // ---------------- CHAT SEND (FIXED PROPERLY) ----------------
  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = input;

    // ✔ SHOW IN UI INSTANTLY
    setMessages((prev) => [
      ...prev,
      { sender: "You", text: msg },
    ]);

    // ✔ SEND TO SERVER
    socket.current.emit("send-message", {
      roomId,
      message: msg,
    });

    setInput("");
  };

  // ---------------- CONTROLS (UNCHANGED) ----------------
  const toggleMute = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsMuted((p) => !p);
  };

  const toggleCamera = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsCameraOn((p) => !p);
  };

  const startShare = async () => {
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      setStream(screen);
      setIsSharing(true);

      if (videoRef.current) {
        videoRef.current.srcObject = screen;
      }

      screen.getVideoTracks()[0].onended = stopShare;
    } catch (err) {
      console.log(err);
    }
  };

  const stopShare = async () => {
    try {
      const cam = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(cam);
      setIsSharing(false);

      if (videoRef.current) {
        videoRef.current.srcObject = cam;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const leaveMeeting = () => {
    stream?.getTracks().forEach((t) => t.stop());
    socket.current?.disconnect();
    navigate("/dashboard");
  };

  // ---------------- UI (UNCHANGED) ----------------
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0f172a",
        color: "white",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid gray",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h3>Meeting Room</h3>
        <span>Room: {roomId}</span>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* VIDEO */}
        <div style={{ flex: 3 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* CHAT */}
        <div
          style={{
            width: "300px",
            borderLeft: "1px solid gray",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, padding: "10px" }}>
            {messages.map((m, i) => (
              <p key={i}>
                <b>{m.sender}:</b> {m.text}
              </p>
            ))}
          </div>

          <div style={{ display: "flex", padding: "10px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="message..."
              style={{ flex: 1 }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div
        style={{
          padding: "10px",
          borderTop: "1px solid gray",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <button onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>

        <button onClick={toggleCamera}>
          {isCameraOn ? "Camera Off" : "Camera On"}
        </button>

        <button onClick={isSharing ? stopShare : startShare}>
          {isSharing ? "Stop Share" : "Share Screen"}
        </button>

        <button
          onClick={leaveMeeting}
          style={{ background: "red", color: "white" }}
        >
          Leave
        </button>
      </div>
    </div>
  );
}