import { useContext, useEffect, useState, useMemo } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { ThemeContext } from "../context/ThemeContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const itemKeys = ["Dairy", "Bakery", "Produce", "Meat"];
const COLORS = {
  Dairy: "#3b82f6",
  Bakery: "#a855f7",
  Produce: "#f97316",
  Meat: "#22c55e",
};

export default function Dashboard() {
  const { user } = useContext(GlobalContext);
  const { theme } = useContext(ThemeContext);

  const [salesData, setSalesData] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [storeList, setStoreList] = useState([]);
  const [visibleItems, setVisibleItems] = useState(new Set(itemKeys));
  const [showConsolidated, setShowConsolidated] = useState(false);
  const [chartType, setChartType] = useState("line"); // "line" or "bar"

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  // Fetch daily sales from backend
  const fetchSales = async () => {
    try {
      const res = await fetch("/api/sales/daily-sale");
      const data = await res.json();
      setSalesData(data);

      const stores = data[0]
        ? Object.keys(data[0]).filter((k) => k !== "day")
        : [];
      setStoreList(stores);
      if (stores[0]) setSelectedStore(stores[0]);

      if (user?.role === "user") setShowConsolidated(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const selectedStoreData = useMemo(() => {
    if (!selectedStore || !salesData.length) return [];
    return salesData.map((row) => {
      const store = row[selectedStore] || {};
      const total =
        (store.Dairy || 0) +
        (store.Bakery || 0) +
        (store.Produce || 0) +
        (store.Meat || 0);
      return { day: row.day, ...store, Total: total };
    });
  }, [salesData, selectedStore]);

  const pieData = useMemo(() => {
    const totals = {};
    itemKeys.forEach((k) => (totals[k] = 0));
    selectedStoreData.forEach((row) => {
      itemKeys.forEach((k) => (totals[k] += row[k] || 0));
    });
    return itemKeys
      .filter((k) => visibleItems.has(k))
      .map((k) => ({ name: k, value: totals[k] }));
  }, [selectedStoreData, visibleItems]);

  const totalPie = pieData.reduce((sum, v) => sum + v.value, 0);

  const consolidatedDailyData = useMemo(() => {
    return salesData.map((row) => {
      const obj = { day: row.day };
      storeList.forEach((store) => {
        const storeData = row[store] || {};
        obj[store] =
          (storeData.Dairy || 0) +
          (storeData.Bakery || 0) +
          (storeData.Produce || 0) +
          (storeData.Meat || 0);
      });
      return obj;
    });
  }, [salesData, storeList]);

  const consolidatedWeeklyTotals = useMemo(() => {
    return storeList.map((store) => {
      const total = salesData.reduce((sum, row) => {
        const storeData = row[store] || {};
        return (
          sum +
          (storeData.Dairy || 0) +
          (storeData.Bakery || 0) +
          (storeData.Produce || 0) +
          (storeData.Meat || 0)
        );
      }, 0);
      return { name: store, value: total };
    });
  }, [salesData, storeList]);

  const consolidatedWeeklyTotalSum = consolidatedWeeklyTotals.reduce(
    (sum, v) => sum + v.value,
    0
  );

  const toggleItem = (key) => {
    setVisibleItems((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const formatYAxis = (v) => `${(v / 1000).toFixed(0)}k`;

  return (
    <div
      className={`min-h-screen p-6 transition-all ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Sales Dashboard</h1>

      {/* Store Selector & Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <div>
          <label className="font-medium mr-2">Select Store:</label>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            disabled={isUser || showConsolidated}
          >
            {storeList.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {isAdmin && (
          <button
            className={`ml-4 px-4 py-2 rounded-md ${
              showConsolidated
                ? "bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-gray-700 dark:text-gray-100"
            }`}
            onClick={() => setShowConsolidated((prev) => !prev)}
          >
            {showConsolidated
              ? "Show per-store view"
              : "Show consolidated view"}
          </button>
        )}

        {isUser && (
          <span className="ml-4 italic">Viewing consolidated data only</span>
        )}
      </div>

      {/* Filters per store (admin only & hidden in consolidated) */}
      {!showConsolidated && isAdmin && (
        <div className="mb-4 flex flex-wrap gap-2">
          {itemKeys.map((k) => (
            <button
              key={k}
              className={`px-3 py-1 rounded-full border ${
                visibleItems.has(k)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-transparent border-gray-500 dark:border-gray-400 text-gray-900 dark:text-gray-100"
              }`}
              onClick={() => toggleItem(k)}
            >
              {k}
            </button>
          ))}
        </div>
      )}

      {/* Daily table per store */}
      {!showConsolidated && isAdmin && selectedStoreData.length > 0 && (
        <div className="mb-6 overflow-auto rounded-xl shadow-md bg-white dark:bg-gray-800 p-4">
          <h3 className="text-xl font-semibold mb-4">
            Daily Sales – {selectedStore}
          </h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b px-3 py-2">Day</th>
                {itemKeys.map(
                  (k) =>
                    visibleItems.has(k) && (
                      <th key={k} className="border-b px-3 py-2">
                        {k}
                      </th>
                    )
                )}
                <th className="border-b px-3 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedStoreData.map((row) => (
                <tr key={row.day}>
                  <td className="border-b px-3 py-2">{row.day}</td>
                  {itemKeys.map(
                    (k) =>
                      visibleItems.has(k) && (
                        <td key={k} className="border-b px-3 py-2">
                          {row[k].toLocaleString("sv-SE")}
                        </td>
                      )
                  )}
                  <td className="border-b px-3 py-2">
                    {row.Total.toLocaleString("sv-SE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Chart type toggle (line/bar) */}
      {!showConsolidated && isAdmin && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setChartType("line")}
            className={`px-3 py-1 rounded-md ${
              chartType === "line"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-gray-700 dark:text-gray-100"
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 rounded-md ${
              chartType === "bar"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-gray-700 dark:text-gray-100"
            }`}
          >
            Bar
          </button>
        </div>
      )}
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {showConsolidated ? (
          <>
            <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
              <h3 className="text-xl font-semibold mb-4">
                Daily Total Comparison – All Stores
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={consolidatedDailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis tickFormatter={formatYAxis} />
                  <Tooltip />
                  <Legend />
                  {storeList.map((s, i) => (
                    <Bar
                      key={s}
                      dataKey={s}
                      fill={Object.values(COLORS)[i % 4]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
              <h3 className="text-xl font-semibold mb-4">
                Weekly Total Share – All Stores
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Legend />
                  <Tooltip
                    formatter={(value) => {
                      const pct = (
                        (value / consolidatedWeeklyTotalSum) *
                        100
                      ).toFixed(1);
                      return [
                        `${value.toLocaleString("sv-SE")} SEK (${pct}%)`,
                        "Weekly total",
                      ];
                    }}
                  />
                  <Pie
                    data={consolidatedWeeklyTotals}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="70%"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {storeList.map((s, i) => (
                      <Cell key={s} fill={Object.values(COLORS)[i % 4]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
              <h3 className="text-xl font-semibold mb-4">
                {chartType === "line" ? "Line Trend" : "Bar Comparison"} –{" "}
                {selectedStore}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                {chartType === "line" ? (
                  <LineChart data={selectedStoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis tickFormatter={formatYAxis} />
                    <Tooltip />
                    <Legend />
                    {itemKeys.map(
                      (k) =>
                        visibleItems.has(k) && (
                          <Line
                            key={k}
                            type="monotone"
                            dataKey={k}
                            stroke={COLORS[k]}
                            strokeWidth={2}
                          />
                        )
                    )}
                  </LineChart>
                ) : (
                  <BarChart data={selectedStoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis tickFormatter={formatYAxis} />
                    <Tooltip />
                    <Legend />
                    {itemKeys.map(
                      (k) =>
                        visibleItems.has(k) && (
                          <Bar key={k} dataKey={k} fill={COLORS[k]} />
                        )
                    )}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
              <h3 className="text-xl font-semibold mb-4">
                Weekly totals – {selectedStore}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Legend />
                  <Tooltip
                    formatter={(value) => {
                      const pct = ((value / totalPie) * 100).toFixed(1);
                      return [
                        `${value.toLocaleString("sv-SE")} SEK (${pct}%)`,
                        "Weekly total",
                      ];
                    }}
                  />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="70%"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
