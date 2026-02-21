import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import ATSScanner from "./pages/ATSScanner";
import AdminPanel from "./pages/AdminPanel";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (

    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 🔒 Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-builder"
        element={
          <ProtectedRoute>
            <ResumeBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ats-scanner"
        element={
          <ProtectedRoute>
            <ATSScanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-panel"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>

  );
}
