// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const DashboardPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token); // decode token to get user info
      setUser(decoded);
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
    </div>
  );
};

export default DashboardPage;
