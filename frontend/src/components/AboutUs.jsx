import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaChartLine, FaBoxOpen, FaUsers, FaCogs } from "react-icons/fa";

export default function AboutUs() {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const stores = [
    { name: "Coop", color: "bg-green-500" },
    { name: "Willys", color: "bg-yellow-500" },
    { name: "ICA", color: "bg-red-500" },
    { name: "Lidl", color: "bg-blue-500" },
  ];

  const features = [
    {
      icon: <FaChartLine />,
      title: "Track Performance",
      description:
        "Monitor daily and weekly sales trends to identify top-performing and underperforming products.",
    },
    {
      icon: <FaBoxOpen />,
      title: "Real-Time Stock Updates",
      description:
        "Get instant updates on inventory to prevent stockouts or overstocking, ensuring efficient shelves.",
    },
    {
      icon: <FaUsers />,
      title: "Role-Based Access",
      description:
        "Managers and staff see only relevant data, improving focus, accountability, and decision-making.",
    },
    {
      icon: <FaCogs />,
      title: "Optimize Efficiency",
      description:
        "Use actionable insights to streamline operations, reduce waste, and maximize profitability.",
    },
  ];

  return (
    <div
      className={`min-h-screen p-8 transition-colors ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-6">
        About Supermarket Dashboard
      </h1>

      {/* Intro Text */}
      <p className="text-center max-w-3xl mx-auto text-lg mb-12">
        The Supermarket Dashboard gives managers a comprehensive view of
        performance across all stores, including Coop, Willys, ICA, and Lidl.
        Track trends, monitor stock, and make data-driven decisions to improve
        efficiency and profitability.
      </p>

      {/* Stores Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-6xl mx-auto">
        {stores.map((store) => (
          <div
            key={store.name}
            className={`p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-colors ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center text-white text-lg font-bold ${store.color}`}
            >
              {store.name.charAt(0)}
            </div>
            <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
            <p className="text-center text-gray-400 text-sm">
              Monitor performance, track stock, and optimize sales.
            </p>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className={`p-6 rounded-2xl shadow-lg flex flex-col items-start transition-colors ${
              darkMode ? "bg-gray-800" : "bg-white"
            } hover:scale-105 transform duration-200`}
          >
            <div className="text-3xl mb-4 text-blue-500">{f.icon}</div>
            <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
            <p className="text-gray-400 text-sm">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
