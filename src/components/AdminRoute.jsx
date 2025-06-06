import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isLoggedIn, logout, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  try {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    if (!decoded.role || decoded.role !== "admin") {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  } catch (err) {
    logout(); // Clear invalid token using auth context
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
