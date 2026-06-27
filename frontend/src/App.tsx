import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MeetingLobby from "./pages/MeetingLobby";
import MeetingRoom from "./pages/MeetingRoom";

// ✅ ADD THIS
import MeetingHistory from "./pages/MeetingHistory";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* FIXED LOBBY */}
        <Route path="/lobby" element={<MeetingLobby />} />

        {/* MEETING ROOM */}
        <Route path="/meeting" element={<MeetingRoom />} />

        {/* ✅ HISTORY PAGE ADDED */}
        <Route path="/history" element={<MeetingHistory />} />

      </Routes>
    </BrowserRouter>
  );
}