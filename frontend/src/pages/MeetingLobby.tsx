import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function MeetingLobby() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("id") || "";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    const start = async () => {
      const s = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    };

    start();
  }, []);

  const toggleMic = () => {
    stream?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMicOn((p) => !p);
  };

  const toggleCam = () => {
    stream?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setCamOn((p) => !p);
  };

  const joinMeeting = () => {
    navigate(`/meeting?id=${roomId}`, {
      state: { micOn, camOn },
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <video ref={videoRef} autoPlay playsInline style={styles.video} />

        <div style={{ marginTop: 10 }}>
          <button onClick={toggleMic}>Mic</button>
          <button onClick={toggleCam}>Cam</button>
        </div>

        <button onClick={joinMeeting} style={styles.join}>
          Join Meeting
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
  },
  card: {
    padding: 20,
    borderRadius: 12,
    background: "#111827",
  },
  video: {
    width: 400,
    borderRadius: 10,
  },
  join: {
    marginTop: 10,
    width: "100%",
    padding: 10,
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 8,
  },
};