import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MeetingLobby from "./pages/MeetingLobby";
import MeetingRoom from "./pages/MeetingRoom";
import MeetingHistory from "./pages/MeetingHistory";
import MeetingDetails from "./pages/MeetingDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/lobby" element={<MeetingLobby />} />

        <Route path="/meeting" element={<MeetingRoom />} />

        

        <Route path="/history/:id" element={<MeetingDetails />} />
      </Routes>
    </BrowserRouter>
  );
}