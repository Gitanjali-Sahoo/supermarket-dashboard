// // Dashboard.jsx
// import { useContext, useEffect, useState, useMemo } from "react";
// import { GlobalContext } from "../context/GlobalContext";
// import { ThemeContext } from "../context/ThemeContext";

// import SalesTable from "./SalesTable";
// import SalesChart from "./SalesChart";
// import WeeklyPieChart from "./WeeklyPieChart";
// import ConsolidatedCharts from "./ConsolidatedCharts";

// const itemKeys = ["Dairy", "Bakery", "Produce", "Meat"];
// const COLORS = {
//   Dairy: "#3b82f6",
//   Bakery: "#af2d8c",
//   Produce: "#f97316",
//   Meat: "#30c522",
// };

// export default function Dashboard() {
//   const { user } = useContext(GlobalContext);
//   const { theme } = useContext(ThemeContext);

//   const [salesData, setSalesData] = useState([]);
//   const [selectedStore, setSelectedStore] = useState("");
//   const [storeList, setStoreList] = useState([]);
//   const [visibleItems, setVisibleItems] = useState(new Set(itemKeys));
//   const [showConsolidated, setShowConsolidated] = useState(false);

//   const isAdmin = user?.role === "admin";
//   const isManager = user?.role === "manager";

//   useEffect(() => {
//     if (!user) return;
//     fetchSales();
//   }, [user]);

//   const fetchSales = async () => {
//     try {
//       const res = await fetch("/api/sales/daily-sale", {
//         headers: { "x-user-id": user.id },
//       });
//       const data = await res.json();
//       setSalesData(data);

//       // Extract store names from backend keys
//       const stores = data[0]
//         ? Object.keys(data[0]).filter((k) => k !== "day")
//         : [];
//       setStoreList(stores);

//       if (isManager && stores.length) {
//         setSelectedStore(stores[0]); // Manager sees only their store
//         setShowConsolidated(false);
//       } else if (stores.length) {
//         setSelectedStore(stores[0]); // Admin default store
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const toggleItem = (key) => {
//     setVisibleItems((prev) => {
//       const next = new Set(prev);
//       next.has(key) ? next.delete(key) : next.add(key);
//       return next;
//     });
//   };

//   // Prepare table data per store
//   const tableData = useMemo(() => {
//     if (!selectedStore || !salesData.length) return [];
//     return salesData.map((row) => {
//       const storeData = row[selectedStore] || {};
//       const total = itemKeys.reduce((sum, k) => sum + (storeData[k] || 0), 0);
//       return { day: row.day, ...storeData, Total: total };
//     });
//   }, [salesData, selectedStore]);

//   // Prepare pie chart data
//   const pieData = useMemo(() => {
//     const totals = {};
//     itemKeys.forEach((k) => (totals[k] = 0));
//     tableData.forEach((row) => {
//       itemKeys.forEach((k) => (totals[k] += row[k] || 0));
//     });
//     return itemKeys
//       .filter((k) => visibleItems.has(k))
//       .map((k) => ({ name: k, value: totals[k] }));
//   }, [tableData, visibleItems]);

//   const totalPie = pieData.reduce((sum, v) => sum + v.value, 0);

//   const formatYAxis = (v) => `${(v / 1000).toFixed(0)}k`;

//   return (
//     <div
//       className={`min-h-screen p-6 transition-all ${
//         theme === "dark"
//           ? "bg-gray-900 text-gray-100"
//           : "bg-gray-100 text-gray-900"
//       }`}
//     >
//       <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

//       {/* Store Selector & Toggle */}
//       <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
//         {!showConsolidated && (
//           <div>
//             <label className="font-medium mr-2">Select Store:</label>
//             <select
//               value={selectedStore}
//               onChange={(e) => setSelectedStore(e.target.value)}
//               className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//               disabled={isManager || showConsolidated}
//             >
//               {storeList.map((s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         {isAdmin && (
//           <button
//             className={`ml-4 px-4 py-2 rounded-md ${
//               showConsolidated
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-300 dark:bg-gray-700 dark:text-gray-100"
//             }`}
//             onClick={() => setShowConsolidated((prev) => !prev)}
//           >
//             {showConsolidated
//               ? "Show per-store view"
//               : "Show consolidated view"}
//           </button>
//         )}

//         {isManager && (
//           <span className="ml-4 italic">Viewing {storeList} store data</span>
//         )}
//       </div>

//       {/* Filters */}
//       {!showConsolidated && isAdmin && (
//         <div className="mb-4 flex flex-wrap gap-2">
//           {itemKeys.map((k) => (
//             <button
//               key={k}
//               className={`px-3 py-1 rounded-full border ${
//                 visibleItems.has(k)
//                   ? "bg-blue-600 text-white border-blue-600"
//                   : "bg-transparent border-gray-500 dark:border-gray-400 text-gray-900 dark:text-gray-100"
//               }`}
//               onClick={() => toggleItem(k)}
//             >
//               {k}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Table */}
//       {tableData.length > 0 && !showConsolidated && (
//         <SalesTable
//           data={tableData}
//           itemKeys={itemKeys}
//           visibleItems={visibleItems}
//         />
//       )}

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
//         {showConsolidated && isAdmin ? (
//           <ConsolidatedCharts
//             salesData={salesData}
//             storeList={storeList}
//             COLORS={COLORS}
//           />
//         ) : (
//           <>
//             <SalesChart
//               data={salesData}
//               selectedStore={selectedStore}
//               itemKeys={itemKeys}
//               visibleItems={visibleItems}
//               COLORS={COLORS}
//             />
//             <WeeklyPieChart
//               pieData={pieData}
//               totalPie={totalPie}
//               COLORS={COLORS}
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
// Dashboard.jsx
import { useContext, useEffect, useState, useMemo } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { ThemeContext } from "../context/ThemeContext";

import SalesTable from "./SalesTable";
import SalesChart from "./SalesChart";
import WeeklyPieChart from "./WeeklyPieChart";
import ConsolidatedCharts from "./ConsolidatedCharts";

import Stocks from "./Stocks";
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

  const [section, setSection] = useState("kpi"); // "stock", "kpi", "consolidated"

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
      setSalesData(data);

      const stores = data[0]
        ? Object.keys(data[0]).filter((k) => k !== "day")
        : [];

      setStoreList(stores);

      if (isManager && stores.length) {
        setSelectedStore(stores[0]);
        setShowConsolidated(false);
      } else if (stores.length) {
        setSelectedStore(stores[0]);
      }
    } catch (err) {
      console.error(err);
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
    if (!selectedStore || !salesData.length) return [];
    return salesData.map((row) => {
      const storeData = row[selectedStore] || {};
      const total = itemKeys.reduce((sum, k) => sum + (storeData[k] || 0), 0);
      return { day: row.day, ...storeData, Total: total };
    });
  }, [salesData, selectedStore]);

  const pieData = useMemo(() => {
    const totals = {};
    itemKeys.forEach((k) => (totals[k] = 0));
    tableData.forEach((row) => {
      itemKeys.forEach((k) => (totals[k] += row[k] || 0));
    });
    return itemKeys
      .filter((k) => visibleItems.has(k))
      .map((k) => ({ name: k, value: totals[k] }));
  }, [tableData, visibleItems]);

  const totalPie = pieData.reduce((sum, v) => sum + v.value, 0);

  return (
    <div className="min-h-screen flex">
      {/* ============================ */}
      {/*         SIDEBAR              */}
      {/* ============================ */}
      <aside
        className={`w-64 p-6 shadow-md ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <nav className="flex flex-col gap-4">
          <button
            className={`text-left ${
              section === "stock" ? "font-bold text-blue-600" : ""
            }`}
            onClick={() => setSection("stock")}
          >
            📦 Stock
          </button>

          <button
            className={`text-left ${
              section === "kpi" ? "font-bold text-blue-600" : ""
            }`}
            onClick={() => setSection("kpi")}
          >
            📊 KPI
          </button>

          {isAdmin && (
            <button
              className={`text-left ${
                section === "consolidated" ? "font-bold text-blue-600" : ""
              }`}
              onClick={() => setSection("consolidated")}
            >
              🏪 Consolidated
            </button>
          )}
        </nav>
      </aside>

      {/* ============================ */}
      {/*         MAIN CONTENT         */}
      {/* ============================ */}
      <main
        className={`flex-1 p-6 transition-all ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {/* ==================================== */}
        {/*               STOCK PAGE             */}
        {/* ==================================== */}
        {section === "stock" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Stock Overview</h1>
            <Stocks />
          </>
        )}

        {/* ==================================== */}
        {/*               KPI PAGE               */}
        {/* ==================================== */}
        {section === "kpi" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Sales KPI</h1>

            {/* Store Selector & Toggle */}
            {!showConsolidated && (
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <div>
                  <label className="font-medium mr-2">Select Store:</label>
                  <select
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.target.value)}
                    className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    disabled={isManager}
                  >
                    {storeList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Filters */}
            {!showConsolidated && isAdmin && (
              <div className="mb-4 flex flex-wrap gap-2">
                {itemKeys.map((k) => (
                  <button
                    key={k}
                    className={`px-3 py-1 rounded-full border ${
                      visibleItems.has(k)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-transparent border-gray-500 dark:border-gray-400"
                    }`}
                    onClick={() => toggleItem(k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
            )}

            {/* Table */}
            {tableData.length > 0 && (
              <SalesTable
                data={tableData}
                itemKeys={itemKeys}
                visibleItems={visibleItems}
              />
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              <SalesChart
                data={salesData}
                selectedStore={selectedStore}
                itemKeys={itemKeys}
                visibleItems={visibleItems}
                COLORS={COLORS}
              />
              <WeeklyPieChart
                pieData={pieData}
                totalPie={totalPie}
                COLORS={COLORS}
              />
            </div>
          </>
        )}

        {/* ==================================== */}
        {/*        CONSOLIDATED (Admin Only)     */}
        {/* ==================================== */}
        {section === "consolidated" && isAdmin && (
          <>
            <h1 className="text-3xl font-bold mb-6">Consolidated View</h1>
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
