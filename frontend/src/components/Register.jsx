import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

export default function Register() {
  const { theme } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [role, setRole] = useState("manager"); // default manager
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeId, setStoreId] = useState(""); // store selection for manager
  const [stores, setStores] = useState([]);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Fetch stores from backend
  useEffect(() => {
    fetch("/api/supermarkets")
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch(() => setError("Failed to load stores"));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Frontend validation
    if (role === "manager" && !storeId) {
      setError("Please select a store for manager");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          supermarket_id: role === "manager" ? storeId : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setError("Something went wrong.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-all ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl transition-all ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}
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
              className={`w-full p-2 rounded-md border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-100 border-gray-300"
              }`}
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
              className={`w-full p-2 rounded-md border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-100 border-gray-300"
              }`}
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
              className={`w-full p-2 rounded-md border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-100 border-gray-300"
              }`}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full p-2 rounded-md border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {/* Store selection for manager */}
          {role === "manager" && (
            <div>
              <label className="block text-sm mb-1">Select Store</label>
              <select
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                required
                className={`w-full p-2 rounded-md border ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <option value="">-- Choose a store --</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
          className={`w-full mt-4 py-2 rounded-md transition ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
