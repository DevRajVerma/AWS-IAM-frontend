// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Cloud, Server, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";


const services = [
  {
    name: "EC2 Instance Manager",
    description: "Launch, stop or monitor your EC2 instances.",
    icon: <Server className="h-8 w-8 text-blue-600" />,
    path: "/ec2",
  },
  {
    name: "S3 Bucket Uploads",
    description: "Upload and manager your files in S3 buckets",
    icon: <UploadCloud className="h-8 w-8 text-green-800" />,
    path: "/s3",
  },
  {
    name: "Cloud Monitoring",
    description: "Keep track of your AWS resources.",
    icon: <Cloud className="h-8 w-8 text-purple-600" />,
    path: "/monitoring",
  },
];

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token); // decode token to get user info
      setUser(decoded);
    }
  }, []);

  
  if (!user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Greeting section */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
        <p className="mb-6 text-gray-600">
          <strong>Email:</strong> {user.email} | <strong>Role:</strong>{" "}
          {user.role}
        </p>
      </div>

      {/* Services Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.name}
            className="border rounded-xl p-6 shadow hover:shadow-md transition bg-white"
          >
            <div className="flex items-center mb-4">{service.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <Link
              to="/dashboard"
              className="inline-block text-blue-600 hover:underline font-medium"
            >
              Go to service ➡️
            </Link>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default DashboardPage;
