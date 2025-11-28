import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useContext(GlobalContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full shadow-md bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          SuperMarket
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-lg">
          {user && (
            <Link to="/dashboard" className="hover:text-blue-500 transition">
              Dashboard
            </Link>
          )}

          {/* Theme Button */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg transition "
          >
            {theme === "light" ? "🌙 " : "☀️ "}
          </button>

          {/* Auth Section */}
          {user ? (
            <>
              <span className="font-semibold">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-500 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-500 transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            // X (close icon)
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-6 py-4 space-y-4 border-t border-gray-300 dark:border-gray-700">
          <Link to="/" className="block text-lg" onClick={() => setOpen(false)}>
            Home
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className="block text-lg"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="w-full text-left px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 bg-red-500 text-white rounded-lg"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-lg"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-lg"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
