import React, { useEffect, useState } from "react";
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaHome,
  FaVideo,
  FaTachometerAlt,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// Import your logo
import logo from "../assets/logo.png";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const rootElement = document.documentElement;
    rootElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center h-[65px] md:h-[72px] px-4 md:px-8 
      bg-gray-200 dark:bg-gray-900 
      transition-all duration-300 ease-in-out shadow-md backdrop-blur-sm"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          {/* Menu Toggle Button */}
          <button
            onClick={toggleMenu}
            className="text-gray-800 dark:text-white hover:text-blue-500 focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="Logo"
              className="h-8 w-auto md:h-10 transition-all duration-300"
            />
            
          </Link>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 transition-colors duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-gray-200"
          aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
        >
          {darkMode ? (
            <FaSun size={24} className="text-yellow-400" />
          ) : (
            <FaMoon size={24} className="text-gray-800 dark:text-white" />
          )}
        </button>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-[65px] md:top-[72px] left-0 h-[calc(100vh-65px)] md:h-[calc(100vh-72px)] w-64 transform transition-transform duration-300 ease-in-out overflow-y-auto 
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg`}
      >
        <div className="flex flex-col space-y-8 p-10">
          <Link
            to="/"
            className={`flex items-center space-x-2 text-lg font-medium transition-all duration-300 hover:scale-105 hover:translate-x-1
      ${
        isActive("/")
          ? "text-blue-500 bg-blue-100/50 dark:bg-blue-900/50 p-2 rounded-lg"
          : "text-gray-800 dark:text-white hover:text-blue-500"
      }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaHome size={20} />
            <span>Home</span>
          </Link>

          {user?.role === "admin" ? (
            <>
              <Link
                to="/admin/dashboard"
                className={`flex items-center space-x-2 text-lg font-medium transition-all duration-300 hover:scale-105 hover:translate-x-1
        ${
          isActive("/admin/dashboard")
            ? "text-blue-500 bg-blue-100/50 dark:bg-blue-900/50 p-2 rounded-lg"
            : "text-gray-800 dark:text-white hover:text-blue-500"
        }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaTachometerAlt size={20} />
                <span>Admin Dashboard</span>
              </Link>
              <Link
                to="/admin/courses/create"
                className={`flex items-center space-x-2 text-lg font-medium transition-all duration-300 hover:scale-105 hover:translate-x-1
        ${
          isActive("/admin/create-videos")
            ? "text-blue-500 bg-blue-100/50 dark:bg-blue-900/50 p-2 rounded-lg"
            : "text-gray-800 dark:text-white hover:text-blue-500"
        }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaVideo size={20} />
                <span>Create Courses</span>
              </Link>
            </>
          ) : user ? (
            <Link
              to="/user/dashboard"
              className={`flex items-center space-x-2 text-lg font-medium transition-all duration-300 hover:scale-105 hover:translate-x-1
        ${
          isActive("/user/dashboard")
            ? "text-blue-500 bg-blue-100/50 dark:bg-blue-900/50 p-2 rounded-lg"
            : "text-gray-800 dark:text-white hover:text-blue-500"
        }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaTachometerAlt size={20} />
              <span>Dashboard</span>
            </Link>
          ) : null}

          <Link
            to="/courses"
            className={`flex items-center space-x-2 text-lg font-medium transition-all duration-300 hover:scale-105 hover:translate-x-1
      ${
        isActive("/videos")
          ? "text-blue-500 bg-blue-100/50 dark:bg-blue-900/50 p-2 rounded-lg"
          : "text-gray-800 dark:text-white hover:text-blue-500"
      }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaVideo size={20} />
            <span>All Courses</span>
          </Link>

          <Link
            to="/contact"
            className={`flex items-center space-x-2 text-lg font-medium transition-all duration-300 hover:scale-105 hover:translate-x-1
      ${
        isActive("/contact")
          ? "text-blue-500 bg-blue-100/50 dark:bg-blue-900/50 p-2 rounded-lg"
          : "text-gray-800 dark:text-white hover:text-blue-500"
      }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaInfoCircle size={20} />
            <span>Contact Us</span>
          </Link>

          <Link
            to="/about"
            className={`flex items-center space-x-2 text-lg font-medium transition-all duration-300 hover:scale-105 hover:translate-x-1
      ${
        isActive("/about")
          ? "text-blue-500 bg-blue-100/50 dark:bg-blue-900/50 p-2 rounded-lg"
          : "text-gray-800 dark:text-white hover:text-blue-500"
      }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaInfoCircle size={20} />
            <span>About Us</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 md:pb-4 border-t border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
          <div className="space-y-2 mb-10 md:mb-0">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg 
            bg-blue-500 text-white hover:bg-blue-600 
            transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser size={20} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg 
            bg-pink-500 text-white hover:bg-pink-600 
            transition-colors duration-300"
                >
                  <FaSignOutAlt size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg 
            bg-blue-500 text-white hover:bg-blue-600 
            transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaSignInAlt size={20} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg 
            bg-pink-500 text-white hover:bg-pink-600 
            transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserPlus size={20} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
