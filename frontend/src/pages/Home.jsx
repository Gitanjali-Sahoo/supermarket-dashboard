import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(GlobalContext);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-all">
      {/* Hero Section */}
      <section className="text-center px-6 py-20">
        {user && <h3 className="py-5 font-bold"> Hi, {user.name} Welcome</h3>}
        <h2 className="text-4xl font-extrabold mb-4">
          Sales Insights for Södertälje Supermarkets
        </h2>

        <p className="max-w-2xl mx-auto text-lg">
          Track daily & weekly sales analytics across ICA, Lidl, Willys, and
          Coop. Get real-time stock updates and monitor performance.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          {!user && (
            <>
              {" "}
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-lg hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Register
              </button>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
          <h3 className="text-xl font-semibold mb-2">📊 Consolidated Sales</h3>
          <p>View combined sales analytics from all supermarkets at once.</p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
          <h3 className="text-xl font-semibold mb-2">🏪 Store Insights</h3>
          <p>Admins get access to detailed per-store statistics & trends.</p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
          <h3 className="text-xl font-semibold mb-2">🔐 Role-Based Access</h3>
          <p>Admins and staff have different permissions and dashboards.</p>
        </div>
      </section>
    </div>
  );
}
