import { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.role === "admin") {
        setAdmin(decoded);
      } else {
        setAdmin(null);
      }
    }
  }, []);

  if (!admin) return <div className="p-8">Unauthorized Access</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <p>
          <strong>Name: {admin.name}</strong>
        </p>
        <p>
          <strong>Email: {admin.email}</strong>
        </p>
        <p>
          <strong>Role: {admin.role}</strong>
        </p>
        <hr />
        <p className="text-gray-700">
          Here you can manage users, monitor activity , and configure system
          settings.
        </p>
      </div>
    </div>
  );
}
