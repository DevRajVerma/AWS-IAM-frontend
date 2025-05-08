import { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import {
  Server,
  UploadCloud,
  Cloud,
  Users,
  UserPlus,
  UserX,
} from "lucide-react";

const services = [
  {
    name: "EC2 Instance Manager",
    description: "Launch, stop or monitor your EC2 instances.",
    icon: <Server className="h-8 w-8 text-blue-600" />,
    path: "/ec2",
  },
  {
    name: "S3 Bucket Uploads",
    description: "Upload and manager your files in S3 buckets.",
    icon: <UploadCloud className="h-8 w-8 text-green-700" />,
    path: "/s3",
  },
  {
    name: "Cloud Monitoring",
    description: "Monitor your AWS resources and performance.",
    icon: <Cloud className="h-8 w-8 text-purple-600" />,
    path: "/monitoring",
  },
];

const mockUsers = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "readOnly" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "s3Uploader" },
];

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(mockUsers);

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

  const removeUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  if (!admin) return <div className="p-8">Unauthorized Access</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6 text-gray-700">
        <strong>Welcome!</strong> {admin.name} ({admin.email})
      </p>

      {/* Services Section */}

      <h2 className="text-xl font-semibold mb-2">AWS services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {services.map((service)=>(
          <div
          key={service.name}
          className="border rounded-xl p-6 shadow hover:shadow-md transition bg-white">
            <div className="flex items-center mb-4">{service.icon}</div>
            <h3 className="text-lg font-semibold">{service.name}</h3>
            <p className="text-gray-600 mb-2">{service.description}</p>
            
            <Link to="/admin"
            className="text-blue-600 hover:underline">
              Go to Service ➡️
            </Link>

          </div>
        ))}
      </div>


        {/* User Access Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><Users/>
          User Access Management
          </h2>

          <button className="flex items-center gap-1 text-sm text-green-600 hover:underline">
            <UserPlus size={18}/>
          </button>
        </div>

        <table className="w-full text-left table-auto">
          <thead className="text-gray-600 border-b">
            <tr>
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u)=>(
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                  onClick={()=> removeUser(u.id)}
                  className="text-red-600 hover:underline flex items-center gap-1">
                    <UserX size={16}/> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}
