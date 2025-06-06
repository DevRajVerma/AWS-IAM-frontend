"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import Overview from "../components/Overview"
import UserManagement from "../components/UserManagement"

// Import icons from lucide-react
import { Server, UploadCloud, Cloud, Users, Plus, BarChart3, Settings, Shield } from "lucide-react"

const services = [
  {
    name: "EC2 Instance Manager",
    description: "Launch, stop or monitor your EC2 instances.",
    icon: <Server className="h-8 w-8 text-blue-600" />,
    path: "/ec2",
  },
  {
    name: "S3 Bucket Uploads",
    description: "Upload and manage your files in S3 buckets.",
    icon: <UploadCloud className="h-8 w-8 text-green-700" />,
    path: "/s3",
  },
  {
    name: "Cloud Monitoring",
    description: "Monitor your AWS resources and performance.",
    icon: <Cloud className="h-8 w-8 text-purple-600" />,
    path: "/monitoring",
  },
]

function AdminDashboard() {
  const [admin, setAdmin] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simulate loading
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const decoded = jwtDecode(token)
          if (decoded.role === "admin") {
            setAdmin(decoded)
          }
        }
      } catch (error) {
        
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!admin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Shield className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Unauthorized Access</h1>
        <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
        <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between px-2 mb-6">
            <div className="grid gap-1">
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-gray-500">Welcome, {admin.name}! Manage your AWS resources and user access.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Service
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="space-y-4">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 flex items-center ${
                  activeTab === "overview"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </button>
              <button
                className={`px-4 py-2 flex items-center ${
                  activeTab === "services"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("services")}
              >
                <Server className="h-4 w-4 mr-2" />
                Services
              </button>
              <button
                className={`px-4 py-2 flex items-center ${
                  activeTab === "users"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("users")}
              >
                <Users className="h-4 w-4 mr-2" />
                User Management
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === "overview" && <Overview />}

              {activeTab === "services" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div key={service.name} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                      <div className="p-4">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <h3 className="text-lg font-medium">{service.name}</h3>
                          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-100">
                            {service.icon}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{service.description}</p>
                      </div>
                      <div className="p-4 border-t">
                        <Link
                          to={service.path}
                          className="w-full inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          Go to Service
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "users" && <UserManagement />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
