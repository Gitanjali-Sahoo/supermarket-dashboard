import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import Stocks from "../components/Stocks";
import SalesKPIs from "../components/SalesKpi";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(GlobalContext);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-all">
      {/* Main content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center px-6 py-16 min-h-[60vh] flex flex-col justify-center items-center">
          {user && (
            <h3 className="py-2 font-bold text-xl">Hi, {user.name} Welcome</h3>
          )}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Sales Insights for Södertälje Supermarkets
          </h2>

          <p className="max-w-2xl mx-auto text-lg mb-6">
            Track daily & weekly sales analytics across ICA, Lidl, Willys, and
            Coop. Get real-time stock updates and monitor performance.
          </p>

          {!user && (
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                Register
              </button>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">
              📊 Consolidated Sales
            </h3>
            <p>View combined sales analytics from all supermarkets at once.</p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">🏪 Store Insights</h3>
            <p>Admins get access to detailed per-store statistics & trends.</p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">🔐 Role-Based Access</h3>
            <p>Admins and staff have different permissions and dashboards.</p>
          </div>
        </section>
        <Stocks />
        <SalesKPIs />
      </main>
    </div>
  );
}
