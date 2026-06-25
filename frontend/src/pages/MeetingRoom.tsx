import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

export default function MeetingRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("id") || "";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const socket = useRef<any>(null);

  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());

  const [stream, setStream] = useState<MediaStream | null>(null);

  const [messages, setMessages] = useState([
    { sender: "System", text: "Welcome to meeting" },
  ]);

  const [input, setInput] = useState("");

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  // SOCKET
  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      socket.current.emit("join-room", roomId);
    });

    socket.current.on("receive-message", (data: any) => {
      setMessages((prev) => [
        ...prev,
        { sender: data.sender, text: data.message },
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

    socket.current.on("offer", async ({ offer, from }) => {
      const peer = new RTCPeerConnection(servers);
      peersRef.current.set(from, peer);

      stream?.getTracks().forEach((t) => peer.addTrack(t, stream));

      peer.ontrack = (e) => {
        setRemoteStreams((prev) => {
          const updated = new Map(prev);
          updated.set(from, e.streams[0]);
          return updated;
        });
      };

      await peer.setRemoteDescription(offer);

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.current.emit("answer", { answer, to: from });
    });

    socket.current.on("answer", async ({ answer, from }) => {
      const peer = peersRef.current.get(from);
      if (peer) await peer.setRemoteDescription(answer);
    });

    socket.current.on("ice-candidate", async ({ candidate, from }) => {
      const peer = peersRef.current.get(from);
      if (peer && candidate) await peer.addIceCandidate(candidate);
    });

    return () => socket.current.disconnect();
  }, [roomId, stream]);

  // CAMERA
  useEffect(() => {
    const start = async () => {
      const s = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(s);

      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    };

    start();
  }, []);

  // SEND CHAT
  const sendMessage = () => {
    if (!input.trim()) return;

    socket.current.emit("send-message", {
      roomId,
      message: input,
    });

    setMessages((p) => [...p, { sender: "You", text: input }]);

    setInput("");
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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 10 }}>Room: {roomId}</div>

      <div style={{ display: "flex", flex: 1 }}>
        <video ref={videoRef} autoPlay playsInline style={{ width: "50%" }} />

        {[...remoteStreams.entries()].map(([id, s]) => (
          <video
            key={id}
            autoPlay
            playsInline
            ref={(el) => {
              if (el) el.srcObject = s;
            }}
            style={{ width: "50%" }}
          />
        ))}

        <div style={{ width: 300 }}>
          {messages.map((m, i) => (
            <p key={i}>
              <b>{m.sender}</b>: {m.text}
            </p>
          ))}

          <input value={input} onChange={(e) => setInput(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      <button onClick={leaveMeeting}>Leave</button>
    </div>
  );
}