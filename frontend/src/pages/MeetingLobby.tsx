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
  const [loading, setLoading] = useState(false);

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

  const toggleMic = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMicOn((p) => !p);
  };

  const toggleCam = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setCamOn((p) => !p);
  };

  const joinMeeting = () => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/meeting?id=${roomId}`);
    }, 700);
  };

  return (
    <div style={styles.page}>
      {/* TOP BAR */}
      <div style={styles.topbar}>
        <div>Meeting Preview</div>
        <div style={{ opacity: 0.6 }}>Room: {roomId}</div>
      </div>

      {/* BODY */}
      <div style={styles.container}>
        {/* VIDEO */}
        <div style={styles.videoBox}>
          <video ref={videoRef} autoPlay playsInline style={styles.video} />
          <div style={styles.label}>Camera preview</div>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.panel}>
          <div>
            <div style={styles.title}>Ready to join</div>
            <div style={styles.subtitle}>
              Check camera and microphone before entering
            </div>

            <div style={styles.controls}>
              <button style={btn} onClick={toggleCam}>
                Camera: {camOn ? "On" : "Off"}
              </button>

              <button style={btn} onClick={toggleMic}>
                Microphone: {micOn ? "On" : "Off"}
              </button>
            </div>
          </div>

          <button style={joinBtn} onClick={joinMeeting} disabled={loading}>
            {loading ? "Joining..." : "Join Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "radial-gradient(circle at top, #111827, #0f172a)",
    color: "white",
    fontFamily: "system-ui",
  },

  topbar: {
    padding: 14,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    justifyContent: "space-between",
  },

  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },

  videoBox: {
    width: 600,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 10,
  },

  video: {
    width: "100%",
    height: 380,
    borderRadius: 12,
    objectFit: "cover",
  },

  label: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.6,
  },

  panel: {
    width: 280,
    padding: 20,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.02)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 420,
  },

  title: {
    fontSize: 18,
    fontWeight: 600,
  },

  subtitle: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 6,
  },

  controls: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
};

const btn: React.CSSProperties = {
  padding: 10,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "transparent",
  color: "white",
  cursor: "pointer",
};

const joinBtn: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#3b82f6",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};