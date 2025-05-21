import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    // console.log("Actual token:", token);
    console.log("Decoded token:", decoded); // Add this for debugging

    if (!decoded.role || decoded.role !== "admin") {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  } catch (err) {
    console.error("JWT decode error:", err);
    localStorage.removeItem("token"); // Clear invalid token
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
