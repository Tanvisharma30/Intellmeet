import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("token", "demo-token");
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
      }}
    >
      <div
        style={{
          width: "360px",
          padding: "25px",
          background: "rgba(17, 24, 39, 0.9)",
          borderRadius: "14px",
          border: "1px solid #7c3aed55",
          boxShadow: "0 0 30px rgba(124, 58, 237, 0.25)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* TITLE */}
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Welcome Back
        </h2>

        {/* INPUTS */}
        <input
          placeholder="Email"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #374151",
            background: "#111827",
            color: "white",
            outline: "none",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "18px",
            borderRadius: "8px",
            border: "1px solid #374151",
            background: "#111827",
            color: "white",
            outline: "none",
          }}
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: "#7c3aed",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        {/* FOOTER */}
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          No account?{" "}
          <Link
            to="/register"
            style={{ color: "#a78bfa", textDecoration: "none" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}