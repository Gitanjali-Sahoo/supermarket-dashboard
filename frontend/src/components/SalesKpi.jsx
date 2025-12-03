import { useMemo, useEffect, useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

export default function SalesKpi({
  salesData = [],
  tableData = [],
  selectedStore = "",
  setSelectedStore = () => {},
  storeList = [],
  itemKeys = [],
  COLORS = {},
}) {
  const { user } = useContext(GlobalContext);
  // ==========================
  // TOTAL WEEKLY SALES (for selected store)
  // ==========================
  const totalWeeklySales = useMemo(() => {
    if (!Array.isArray(tableData) || tableData.length === 0) return 0;
    return tableData.reduce((sum, row) => sum + (row.Total || 0), 0);
  }, [tableData]);

  // ==========================
  // DAILY AVERAGE
  // ==========================
  const dailyAvg = tableData.length > 0 ? (totalWeeklySales / 7).toFixed(2) : 0;

  // ==========================
  // BEST DAY (for selected store)
  // ==========================
  const bestDay =
    Array.isArray(tableData) && tableData.length > 0
      ? tableData.reduce((a, b) => (a.Total > b.Total ? a : b)).day
      : "N/A";

  // ==========================
  // BEST PERFORMING STORE (backend)
  // ==========================
  const [topStoreData, setTopStoreData] = useState({
    topStore: "N/A",
    topProduct: "N/A",
    bestDay: "N/A",
  });

  useEffect(() => {
    const fetchTopStore = async () => {
      try {
        const res = await fetch("/api/sales/top-store", {
          headers: { "x-user-id": user.id },
        });
        const data = await res.json();

        setTopStoreData({
          topStore: data.topStore || "N/A",
          topProduct: data.topProduct || "N/A",
          bestDay: data.bestDay || "N/A",
        });
      } catch (err) {
        console.error("Failed to fetch top store:", err);
      }
    };
    fetchTopStore();
  }, []);

  const { topStore, topProduct, bestDay: bestStoreDay } = topStoreData;

  // ==========================
  // BEST CATEGORY FOR SELECTED STORE
  // ==========================
  const topStoreCategory = useMemo(() => {
    if (!selectedStore || salesData.length === 0) return "N/A";

    const categoryTotals = {};
    itemKeys.forEach((k) => (categoryTotals[k] = 0));

    salesData.forEach((day) => {
      const storeDayData = day[selectedStore] || {};
      itemKeys.forEach((k) => {
        categoryTotals[k] += storeDayData[k] || 0;
      });
    });

    let maxSales = -1;
    let bestCategory = "N/A";
    for (const k in categoryTotals) {
      if (categoryTotals[k] > maxSales) {
        maxSales = categoryTotals[k];
        bestCategory = k;
      }
    }

    return bestCategory;
  }, [salesData, selectedStore, itemKeys]);

  // ==========================
  // RENDER
  // ==========================
  return (
    <>
      {/* Store selector */}
      <div className="mb-6 flex items-center gap-3">
        <label className="font-medium">Select Store:</label>
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {storeList.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          <p className="text-gray-500 dark:text-gray-300">Total Weekly Sales</p>
          <p className="text-2xl font-bold">{totalWeeklySales}</p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          <p className="text-gray-500 dark:text-gray-300">Daily Average</p>
          <p className="text-2xl font-bold">{dailyAvg}</p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          <p className="text-gray-500 dark:text-gray-300">
            Best Category (Selected Store)
          </p>
          <p className="text-2xl font-bold">{topStoreCategory}</p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          <p className="text-gray-500 dark:text-gray-300">
            Best Day (Selected Store)
          </p>
          <p className="text-2xl font-bold">{bestDay}</p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg col-span-full">
          <p className="text-gray-500 dark:text-gray-300">
            Best Performing Store This Week
          </p>
          <p className="text-2xl font-bold">{topStore}</p>
          <p className="text-gray-500 dark:text-gray-300 mt-1">
            Top Product: <span className="font-bold">{topProduct}</span>
          </p>
          <p className="text-gray-500 dark:text-gray-300">
            Best Day: <span className="font-bold">{bestStoreDay}</span>
          </p>
        </div>
      </div>
    </>
  );
}
