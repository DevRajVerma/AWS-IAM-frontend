import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-[#232f3e] text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          <div className="flex gap-1.5">
            <img
              className="h-10 object-cover rounded-full"
              src="/assets/aws-logo.png"
              alt="AWS logo"
            />
            <p className="text-bold  text-gray-300">AWS</p>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {!isLoggedIn && (
            <>
              <Link to="/login" className="text-white hover:text-gray-300">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="bg-white text-[#232f3e] px-4 py-2 rounded hover:bg-gray-200 font-medium"
              >
                Create an AWS Account
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              to="/signup"
              className="bg-white text-[#232f3e] px-4 py-2 rounded hover:bg-gray-200 font-medium"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
