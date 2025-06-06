import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectRoute({ children }) {
    const { isLoggedIn, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or your loading component
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

