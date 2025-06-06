import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";

import "./index.css";
import DashboardPage from "./pages/DashboardPage";
import ProtectRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectRoute>
                  <DashboardPage />
                </ProtectRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
