import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

export default function Register() {
  const { theme } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setMessage("Registration successful! You can now login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <div
      className={`
        min-h-screen flex items-center justify-center px-4 transition-all
        ${
          theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-gray-800"
        }
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
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {message && <p className="text-green-500 mb-3">{message}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`
                w-full p-2 rounded-md border transition
                ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-gray-100 border-gray-300"
                }
              `}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`
                w-full p-2 rounded-md border transition
                ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-gray-100 border-gray-300"
                }
              `}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`
                w-full p-2 rounded-md border transition
                ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-gray-100 border-gray-300"
                }
              `}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`
                w-full p-2 rounded-md border transition
                ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-gray-100 border-gray-300"
                }
              `}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition text-lg"
          >
            Register
          </button>
        </form>

        {/* Back button */}
        <button
          onClick={() => navigate("/login")}
          className={`
            w-full mt-4 py-2 rounded-md transition
            ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-300 hover:bg-gray-400"
            }
          `}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
