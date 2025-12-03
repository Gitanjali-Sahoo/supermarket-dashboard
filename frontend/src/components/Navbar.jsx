import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useContext(GlobalContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  useEffect(() => {
    setProfileOpen(false); // close dropdown whenever user changes
  }, [user]);
  return (
    <nav className="w-full shadow-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 ">
      <div className=" mx-auto px-6 py-6  flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-3xl font-bold tracking-wide">
          SuperMarket
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-lg">
          <Link to="/about" className="hover:text-blue-500 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-500 transition">
            Contact Us
          </Link>
          {user && (
            <Link to="/dashboard" className="hover:text-blue-500 transition">
              Dashboard
            </Link>
          )}

          {/* Theme Button */}
          <button onClick={toggleTheme} className=" transition ">
            {theme === "light" ? "🌙 " : "☀️ "}
          </button>

          {/* Auth Section */}
          {user ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2  py-2 rounded-xl transition"
                >
                  <img
                    src="https://plus.unsplash.com/premium_photo-1738637233381-6f857ce13eb9?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww" // replace with user image
                    alt="Profile"
                    className="w-5 h-5 rounded-full object-cover"
                  />

                  <div className="flex flex-col leading-tight text-left">
                    <span className=" font-semibold text-sm">{user.name}</span>
                    <span className="text-gray-400 text-xs font-light">
                      {user.role}
                    </span>
                  </div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="grey"
                    className={`w-4 h-4 ml-1 transition-transform ${
                      profileOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* DROPDOWN MENU */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-gray-800 shadow-lg rounded-xl py-2 border border-gray-700 z-50 animate-fadeIn">
                    <Link
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                      to="/profile"
                    >
                      Profile
                    </Link>

                    <hr className="my-2 border-gray-700" />

                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm w-full text-left text-gray-300 hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
          <button onClick={toggleTheme} className="">
            {theme === "light" ? "🌙 " : "☀️ "}
          </button>
          <Link
            to="/about"
            className="block text-sm"
            onClick={() => setOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="block text-sm"
            onClick={() => setOpen(false)}
          >
            Contact Us
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className="block text-sm"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <>
              {" "}
              <Link
                className="block text-sm"
                onClick={() => setOpen(false)}
                to="/profile"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 bg-red-500 text-white rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-md"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-md"
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
