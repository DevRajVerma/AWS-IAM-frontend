"use client";

import { useState, useEffect, useRef } from "react";
import {
  UserPlus,
  UserX,
  Pencil,
  Search,
  ChevronDown,
  Check,
  Filter,
  RefreshCw,
  X,
} from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/users",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Add token from localStorage before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock data for initial users
const initialUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "readOnly",
    status: "active",
    lastLogin: "2023-05-15",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "s3Uploader",
    status: "active",
    lastLogin: "2023-05-10",
  },
  {
    id: 3,
    name: "Carol Williams",
    email: "carol@example.com",
    role: "ec2Manager",
    status: "inactive",
    lastLogin: "2023-04-22",
  },
  {
    id: 4,
    name: "Dave Brown",
    email: "dave@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-05-16",
  },
  {
    id: 5,
    name: "Eve Davis",
    email: "eve@example.com",
    role: "readOnly",
    status: "pending",
    lastLogin: "Never",
  },
];

const roles = [
  { value: "readOnly", label: "Read Only" },
  { value: "s3Uploader", label: "S3 Uploader" },
  { value: "ec2Manager", label: "EC2 Manager" },
  { value: "admin", label: "Administrator" },
];

function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "readOnly",
    status: "pending",
  });

  const filterMenuRef = useRef(null);

  //Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Close filter menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target)
      ) {
        setIsFilterMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter users based on search query and filters
  useEffect(() => {
    let result = users;

    if (searchQuery) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(result);
  }, [users, searchQuery, roleFilter, statusFilter]);

  // API functions for user management
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("/");
      console.log(response.data);

      setUsers(response.data);

      setIsLoading(false);

      // Simulating API call
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again");
      setIsLoading(false);
    }
  };

  const addUser = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/", userData);
      setUsers([...users, response.data]);
      setIsLoading(false);
      setIsAddUserOpen(false);
      resetNewUser();

      // Simulating API call
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user. Please try again.");
      setIsLoading(false);
    }
  };

  const updateUser = async (userId, userData) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Updating user with ID:", userId);
      console.log("Update data:", userData);

      const id = userId || userData._id;

      const response = await api.put(`/${id}`, userData);

      console.log("Update response:", response.data);

      setUsers(
        users.map((user) => {
          if ((user.id && user.id === id) || (user._id && user._id === id)) {
            return response.data;
          }
          return user;
        })
      );

      setIsLoading(false);
      setIsEditUserOpen(false);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.response?.data?.message || "Failed to update user. Please try again.");
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Attempting to delete user with ID:", userId);

      await api.delete(`/${userId}`);

      //Update local state to remove the deleted user
      setUsers(
        users.filter((user) => {
          const currentId = user.id || user._id;
          return currentId !== userId;
          // user.id !== userId;
        })
      );
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
      setIsLoading(false);
    }
  };

  const resetNewUser = () => {
    setNewUser({
      name: "",
      email: "",
      role: "readOnly",
      status: "pending",
    });
  };

  const handleEditUser = (user) => {

    console.log("Editing user:", user);
    
    //Making a copy to avoid direct state mutation
    setCurrentUser({...user});
    setIsEditUserOpen(true);
  };

  const handleDeleteUser = (user) => {
    console.log("Setting User to delete: ", user);

    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    addUser(newUser);
  };

  const handleEditUserSubmit = (e) => {
    e.preventDefault();
    if (currentUser) {
      // updateUser(currentUser.id, currentUser);
      const userId = currentUser.id || currentUser._id;
      updateUser(userId, currentUser);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Active
          </span>
        );
      case "inactive":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            Inactive
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
            Administrator
          </span>
        );
      case "ec2Manager":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            EC2 Manager
          </span>
        );
      case "s3Uploader":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            S3 Uploader
          </span>
        );
      case "readOnly":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            Read Only
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">User Access Management</h2>
        <p className="text-sm text-gray-500">
          Manage user access and permissions for your AWS resources
        </p>
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search users..."
                className="pl-8 w-full md:w-[300px] h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className={`inline-flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={fetchUsers}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative" ref={filterMenuRef}>
              <button
                className="inline-flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>

              {isFilterMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 font-medium">
                      Filter by Role
                    </div>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setRoleFilter("all")}
                    >
                      <Check
                        className={`h-4 w-4 mr-2 ${
                          roleFilter === "all" ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      All Roles
                    </button>
                    {roles.map((role) => (
                      <button
                        key={role.value}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setRoleFilter(role.value)}
                      >
                        <Check
                          className={`h-4 w-4 mr-2 ${
                            roleFilter === role.value
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {role.label}
                      </button>
                    ))}

                    <div className="border-t my-1"></div>

                    <div className="px-4 py-2 text-sm text-gray-700 font-medium">
                      Filter by Status
                    </div>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setStatusFilter("all")}
                    >
                      <Check
                        className={`h-4 w-4 mr-2 ${
                          statusFilter === "all" ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      All Statuses
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setStatusFilter("active")}
                    >
                      <Check
                        className={`h-4 w-4 mr-2 ${
                          statusFilter === "active"
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      Active
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setStatusFilter("inactive")}
                    >
                      <Check
                        className={`h-4 w-4 mr-2 ${
                          statusFilter === "inactive"
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      Inactive
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setStatusFilter("pending")}
                    >
                      <Check
                        className={`h-4 w-4 mr-2 ${
                          statusFilter === "pending"
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      Pending
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              onClick={() => setIsAddUserOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Login
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    {isLoading ? "Loading users..." : "No users found"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="text-gray-400 hover:text-gray-500"
                          onClick={() => handleEditUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </button>

                        <button
                          className="text-red-400 hover:text-red-500"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <UserX className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-4 py-3 border-t flex justify-between">
        <div className="text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New User
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Add a new user and assign their access permissions.
                      </p>
                    </div>

                    <form onSubmit={handleAddUserSubmit} className="mt-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Full Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={newUser.name}
                            onChange={(e) =>
                              setNewUser({ ...newUser, name: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={newUser.email}
                            onChange={(e) =>
                              setNewUser({ ...newUser, email: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Role
                          </label>
                          <select
                            id="role"
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={newUser.role}
                            onChange={(e) =>
                              setNewUser({ ...newUser, role: e.target.value })
                            }
                          >
                            {roles.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Status
                          </label>
                          <select
                            id="status"
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={newUser.status}
                            onChange={(e) =>
                              setNewUser({ ...newUser, status: e.target.value })
                            }
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="button"
                          className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          onClick={() => setIsAddUserOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={isLoading}
                        >
                          {isLoading ? "Adding..." : "Add User"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserOpen && currentUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit User
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Update user information and access permissions.
                      </p>
                    </div>

                    <form onSubmit={handleEditUserSubmit} className="mt-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <label
                            htmlFor="edit-name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Full Name
                          </label>
                          <input
                            id="edit-name"
                            type="text"
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={currentUser.name}
                            onChange={(e) =>
                              setCurrentUser({
                                ...currentUser,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <label
                            htmlFor="edit-email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email
                          </label>
                          <input
                            id="edit-email"
                            type="email"
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={currentUser.email}
                            onChange={(e) =>
                              setCurrentUser({
                                ...currentUser,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <label
                            htmlFor="edit-role"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Role
                          </label>
                          <select
                            id="edit-role"
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={currentUser.role}
                            onChange={(e) =>
                              setCurrentUser({
                                ...currentUser,
                                role: e.target.value,
                              })
                            }
                          >
                            {roles.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <label
                            htmlFor="edit-status"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Status
                          </label>
                          <select
                            id="edit-status"
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={currentUser.status}
                            onChange={(e) =>
                              setCurrentUser({
                                ...currentUser,
                                status: e.target.value,
                              })
                            }
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                          </select>
                        </div>
                      </div>

                      {error && (
                        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">
                          {error}
                        </div>
                      )}

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="button"
                          className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          onClick={() => {
                            setIsEditUserOpen(false);
                            setCurrentUser(null);
                            setError(null);

                          }
                            

                          }
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={isLoading}
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && userToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete User
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {userToDelete.name}?
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    const userId = userToDelete.id || userToDelete._id;

                    if (userId) {
                      deleteUser(userId);
                    } else {
                      console.error(
                        "No valid ID found for user:",
                        userToDelete
                      );
                      setError("Cannot delete user: No valid ID found");
                      setIsDeleteDialogOpen(false);
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
