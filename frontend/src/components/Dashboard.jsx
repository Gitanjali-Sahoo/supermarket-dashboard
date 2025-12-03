// Dashboard.jsx
import { useContext, useEffect, useState, useMemo } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { ThemeContext } from "../context/ThemeContext";

import SalesTable from "./SalesTable";
import SalesChart from "./SalesChart";
import WeeklyPieChart from "./WeeklyPieChart";
import ConsolidatedCharts from "./ConsolidatedCharts";
import Stocks from "./Stocks";
import SalesKpi from "./SalesKpi";

const itemKeys = ["Dairy", "Bakery", "Produce", "Meat"];
const COLORS = {
  Dairy: "#3b82f6",
  Bakery: "#af2d8c",
  Produce: "#f97316",
  Meat: "#30c522",
};

export default function Dashboard() {
  const { user } = useContext(GlobalContext);
  const { theme } = useContext(ThemeContext);

  const [section, setSection] = useState("overview");
  const [salesData, setSalesData] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [storeList, setStoreList] = useState([]);
  const [visibleItems, setVisibleItems] = useState(new Set(itemKeys));
  const [showConsolidated, setShowConsolidated] = useState(false);

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";

  useEffect(() => {
    if (!user) return;
    fetchSales();
  }, [user]);

  const fetchSales = async () => {
    try {
      const res = await fetch("/api/sales/daily-sale", {
        headers: { "x-user-id": user.id },
      });
      const data = await res.json();
      setSalesData(Array.isArray(data) ? data : []);

      const stores =
        data && data[0] ? Object.keys(data[0]).filter((k) => k !== "day") : [];
      setStoreList(stores);

      if (stores.length) setSelectedStore((prev) => (prev ? prev : stores[0]));
      if (isManager && stores.length) setShowConsolidated(false);
    } catch (err) {
      console.error("Failed to fetch daily sales:", err);
      setSalesData([]);
      setStoreList([]);
    }
  };

  const toggleItem = (key) => {
    setVisibleItems((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const tableData = useMemo(() => {
    if (!selectedStore || !Array.isArray(salesData) || salesData.length === 0)
      return [];
    return salesData.map((row) => {
      const storeData = row[selectedStore] || {};
      const total = itemKeys.reduce((sum, k) => sum + (storeData[k] || 0), 0);
      return { day: row.day, ...storeData, Total: total };
    });
  }, [salesData, selectedStore]);

  const pieData = useMemo(() => {
    const totals = {};
    itemKeys.forEach((k) => (totals[k] = 0));
    if (Array.isArray(tableData)) {
      tableData.forEach((row) => {
        itemKeys.forEach((k) => (totals[k] += row[k] || 0));
      });
    }
    return itemKeys
      .filter((k) => visibleItems.has(k))
      .map((k) => ({ name: k, value: totals[k] }));
  }, [tableData, visibleItems]);

  const totalPie = pieData.reduce((sum, v) => sum + v.value, 0);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside
        className={`w-full md:w-64 p-6 shadow-md flex-shrink-0 ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <nav className="flex flex-col gap-3">
          <button
            onClick={() => setSection("overview")}
            className={`text-left px-2 py-1 rounded ${
              section === "overview"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            🏠 Overview
          </button>

          <button
            onClick={() => setSection("kpi")}
            className={`text-left px-2 py-1 rounded ${
              section === "kpi"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            📊 KPI
          </button>

          <button
            onClick={() => setSection("stock")}
            className={`text-left px-2 py-1 rounded ${
              section === "stock"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            📦 Stock
          </button>

          {isAdmin && (
            <button
              onClick={() => setSection("consolidated")}
              className={`text-left px-2 py-1 rounded ${
                section === "consolidated"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              🏪 Consolidated
            </button>
          )}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`flex-1 p-6 overflow-x-auto transition-all ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {/* OVERVIEW */}
        {section === "overview" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h1 className="text-3xl font-bold">Overview</h1>
              <div className="flex items-center gap-3">
                <label className="font-medium">Store:</label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  disabled={isManager}
                >
                  {storeList.length === 0 && <option>—</option>}
                  {storeList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {itemKeys.map((k) => (
                <button
                  key={k}
                  onClick={() => toggleItem(k)}
                  className={`px-3 py-1 rounded-full border ${
                    visibleItems.has(k)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-transparent border-gray-500 dark:border-gray-400"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <SalesTable
                data={tableData}
                itemKeys={itemKeys}
                visibleItems={visibleItems}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
                <SalesChart
                  data={salesData}
                  selectedStore={selectedStore}
                  itemKeys={itemKeys}
                  visibleItems={visibleItems}
                  COLORS={COLORS}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
                <h3 className="text-lg font-medium mb-2">
                  Category Share (This Week)
                </h3>
                <WeeklyPieChart
                  pieData={pieData}
                  totalPie={totalPie}
                  COLORS={COLORS}
                />
              </div>
            </div>
          </div>
        )}

        {/* KPI */}
        {section === "kpi" && (
          <>
            <h1 className="text-3xl font-bold mb-4">KPIs</h1>
            <SalesKpi
              salesData={salesData}
              tableData={tableData}
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              storeList={storeList}
              itemKeys={itemKeys}
              COLORS={COLORS}
              pieData={pieData}
              totalPie={totalPie}
            />
          </>
        )}

        {/* STOCK */}
        {section === "stock" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Stock Overview</h1>
            <Stocks />
          </>
        )}

        {/* CONSOLIDATED */}
        {section === "consolidated" && isAdmin && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Consolidated</h1>
            </div>
            <ConsolidatedCharts
              salesData={salesData}
              storeList={storeList}
              COLORS={COLORS}
            />
          </>
        )}
      </main>
    </div>
  );
}
