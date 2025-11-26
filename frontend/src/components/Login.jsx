import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Login() {
  const { setUser } = useContext(GlobalContext);
  const { theme } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setUser(data);
      setMessage(`Welcome, ${data.name}!`);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <div
      className={`
        min-h-screen flex items-center justify-center px-4 transition-all
        ${theme === "dark" ? "bg-black" : "bg-gray-100"}
      `}
    >
      <div
        className={`
          w-full max-w-md p-8 rounded-2xl shadow-xl transition-all
          ${
            theme === "dark"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-800"
          }
        `}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {message && <p className="text-green-500 mb-3">{message}</p>}
        {error && <p className="text-red-500 mb-3">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`
                w-full p-2 rounded-md border transition-all
                ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-800"
                }
              `}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`
                w-full p-2 rounded-md border transition-all
                ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-800"
                }
              `}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-lg rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <button
          onClick={() => navigate("/register")}
          className={`
            w-full mt-4 py-2 rounded-md transition
            ${
              theme === "dark"
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }
          `}
        >
          Register
        </button>
      </div>
    </div>
  );
}
