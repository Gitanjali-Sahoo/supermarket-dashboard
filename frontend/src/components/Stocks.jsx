// import { useState, useEffect, useContext } from "react";
// import { ThemeContext } from "../context/ThemeContext";
// import { GlobalContext } from "../context/GlobalContext";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";

// const COLORS = {
//   Dairy: "#3b82f6",
//   Bakery: "#af2d8c",
//   Produce: "#f97316",
//   Meat: "#30c522",
// };

// export default function Stocks() {
//   const { user } = useContext(GlobalContext);
//   const { theme } = useContext(ThemeContext);
//   const darkMode = theme === "dark";

//   const [stocks, setStocks] = useState([]);
//   const [lowStock, setLowStock] = useState([]);
//   const [threshold, setThreshold] = useState(500);
//   const [loading, setLoading] = useState(true);
//   const [showChart, setShowChart] = useState(false);

//   // Fetch stock data
//   useEffect(() => {
//     const fetchStocks = async () => {
//       if (!user?.id) return; // wait for user to load

//       setLoading(true);
//       try {
//         const res = await fetch("/api/stocks", {
//           headers: {
//             "x-user-id": user.id,
//           },
//         });

//         const data = await res.json();

//         if (!Array.isArray(data)) {
//           console.error("Invalid data from server:", data);
//           setStocks([]);
//           setLowStock([]);
//           setLoading(false);
//           return;
//         }

//         setStocks(data);

//         // Compute low-stock items
//         const low = [];
//         data.forEach((store) => {
//           [
//             "dairy_stock",
//             "bakery_stock",
//             "produce_stock",
//             "meat_stock",
//           ].forEach((item) => {
//             if (store[item] < threshold) {
//               low.push({
//                 store: store.store,
//                 item: item.replace("_stock", ""),
//                 stock: store[item],
//               });
//             }
//           });
//         });
//         setLowStock(low);
//       } catch (err) {
//         console.error("Failed to fetch stocks:", err);
//       }
//       setLoading(false);
//     };

//     fetchStocks();
//   }, [user, threshold]);

//   // Prepare data for chart
//   const chartData = stocks.map((store) => ({
//     name: store.store,
//     Dairy: store.dairy_stock,
//     Bakery: store.bakery_stock,
//     Produce: store.produce_stock,
//     Meat: store.meat_stock,
//   }));

//   return (
//     <div
//       className={`min-h-screen p-8 transition-colors ${
//         darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
//       }`}
//     >
//       <h1 className="text-3xl font-bold mb-6">Stock Levels</h1>

//       {/* Toggle Table / Chart */}
//       <div className="mb-4">
//         <button
//           onClick={() => setShowChart(!showChart)}
//           className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
//         >
//           {showChart ? "Show Table" : "Show Chart"}
//         </button>
//       </div>

//       {/* Low stock warning */}
//       {lowStock.length > 0 && (
//         <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100">
//           <strong>Warning:</strong> Low stock detected in {lowStock.length} item
//           {lowStock.length > 1 ? "s" : ""}.
//         </div>
//       )}

//       {/* Threshold input */}
//       <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
//         <label>Low stock threshold:</label>
//         <input
//           type="number"
//           value={threshold}
//           onChange={(e) => setThreshold(parseInt(e.target.value))}
//           className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-24"
//         />
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : showChart ? (
//         // Chart View
//         <div className="w-full h-[400px] shadow rounded-lg p-4 bg-white dark:bg-gray-800">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={chartData}
//               margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
//             >
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {["Dairy", "Bakery", "Produce", "Meat"].map((key) => (
//                 <Bar
//                   key={key}
//                   dataKey={key}
//                   fill={COLORS[key]} // normal color
//                   stroke={darkMode ? "#fff" : "#000"} // thick border
//                   strokeWidth={2}
//                 >
//                   {chartData.map((entry, index) => {
//                     const value = entry[key];
//                     const isLow = value < threshold;
//                     return (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={isLow ? "#f87171" : COLORS[key]} // red if low
//                         stroke={isLow ? "#b91c1c" : darkMode ? "#fff" : "#000"} // thick border red if low
//                         strokeWidth={2}
//                       />
//                     );
//                   })}
//                 </Bar>
//               ))}
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       ) : (
//         // Table View
//         <div className="overflow-x-auto shadow rounded-lg">
//           <table
//             className={`min-w-full border-collapse ${
//               darkMode ? "text-gray-100" : "text-gray-900"
//             }`}
//           >
//             <thead>
//               <tr
//                 className={`border-b ${
//                   darkMode ? "border-gray-700" : "border-gray-300"
//                 }`}
//               >
//                 <th className="px-4 py-2 text-left">Store</th>
//                 <th className="px-4 py-2 text-right">Dairy</th>
//                 <th className="px-4 py-2 text-right">Bakery</th>
//                 <th className="px-4 py-2 text-right">Produce</th>
//                 <th className="px-4 py-2 text-right">Meat</th>
//                 <th className="px-4 py-2 text-right">Last Updated</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stocks.map((store) => (
//                 <tr
//                   key={store.store}
//                   className={`border-b ${
//                     darkMode ? "border-gray-700" : "border-gray-300"
//                   }`}
//                 >
//                   <td className="px-4 py-2 font-semibold">{store.store}</td>
//                   {[
//                     "dairy_stock",
//                     "bakery_stock",
//                     "produce_stock",
//                     "meat_stock",
//                   ].map((item) => (
//                     <td
//                       key={item}
//                       className={`px-4 py-2 text-right ${
//                         store[item] < threshold
//                           ? "text-red-600 dark:text-red-400 font-bold"
//                           : ""
//                       }`}
//                     >
//                       {store[item]}
//                     </td>
//                   ))}
//                   <td className="px-4 py-2 text-right">
//                     {new Date(store.last_updated).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { GlobalContext } from "../context/GlobalContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = {
  Dairy: "#3b82f6",
  Bakery: "#af2d8c",
  Produce: "#f97316",
  Meat: "#30c522",
};

export default function Stocks() {
  const { user } = useContext(GlobalContext);
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const [stocks, setStocks] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [threshold, setThreshold] = useState(500);
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await fetch("/api/stocks", {
          headers: { "x-user-id": user.id },
        });
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Invalid data from server:", data);
          setStocks([]);
          setLowStock([]);
          setLoading(false);
          return;
        }

        setStocks(data);

        const low = [];
        data.forEach((store) => {
          [
            "dairy_stock",
            "bakery_stock",
            "produce_stock",
            "meat_stock",
          ].forEach((item) => {
            if (store[item] < threshold) {
              low.push({
                store: store.store,
                item: item.replace("_stock", ""),
                stock: store[item],
              });
            }
          });
        });
        setLowStock(low);
      } catch (err) {
        console.error("Failed to fetch stocks:", err);
      }
      setLoading(false);
    };

    fetchStocks();
  }, [user, threshold]);

  const chartData = stocks.map((store) => ({
    name: store.store,
    Dairy: store.dairy_stock,
    Bakery: store.bakery_stock,
    Produce: store.produce_stock,
    Meat: store.meat_stock,
  }));

  return (
    <div
      className={`min-h-screen p-8 transition-colors ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Stock Levels</h1>

      {/* Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowChart(!showChart)}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          {showChart ? "Show Table" : "Show Chart"}
        </button>
      </div>

      {/* Low stock warning */}
      {lowStock.length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100">
          <strong>Warning:</strong> Low stock detected in {lowStock.length} item
          {lowStock.length > 1 ? "s" : ""}.
        </div>
      )}

      {/* Threshold input */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label>Low stock threshold:</label>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(parseInt(e.target.value))}
          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-24"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : showChart ? (
        <div className="w-full h-[400px] shadow rounded-lg p-4 bg-white dark:bg-gray-800">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <defs>
                {["Dairy", "Bakery", "Produce", "Meat"].map((key) => (
                  <pattern
                    id={`stripes-${key}`}
                    key={key}
                    patternUnits="userSpaceOnUse"
                    width="7"
                    height="6"
                    patternTransform="rotate(45)"
                  >
                    <rect width="6" height="6" fill={COLORS[key]} />
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="6"
                      stroke="#eceadb"
                      strokeWidth="2"
                      strokeOpacity="0.6"
                    />
                  </pattern>
                ))}
              </defs>

              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {["Dairy", "Bakery", "Produce", "Meat"].map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={COLORS[key]}
                  stroke={darkMode ? "#fff" : "#000"}
                  strokeWidth={2}
                  radius={[4, 4, 0, 0]} // rounded top corners
                >
                  {chartData.map((entry, index) => {
                    const value = Number(entry[key]); // make sure it's a number
                    const isLow = value < threshold;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isLow ? `url(#stripes-${key})` : COLORS[key]}
                        stroke={isLow ? "#b91c1c" : darkMode ? "#fff" : "#000"}
                        strokeWidth={isLow ? 4 : 2} // thicker red border for low stock
                      />
                    );
                  })}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table
            className={`min-w-full border-collapse ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            <thead>
              <tr
                className={`border-b ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                }`}
              >
                <th className="px-4 py-2 text-left">Store</th>
                <th className="px-4 py-2 text-right">Dairy</th>
                <th className="px-4 py-2 text-right">Bakery</th>
                <th className="px-4 py-2 text-right">Produce</th>
                <th className="px-4 py-2 text-right">Meat</th>
                <th className="px-4 py-2 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((store) => (
                <tr
                  key={store.store}
                  className={`border-b ${
                    darkMode ? "border-gray-700" : "border-gray-300"
                  }`}
                >
                  <td className="px-4 py-2 font-semibold">{store.store}</td>
                  {[
                    "dairy_stock",
                    "bakery_stock",
                    "produce_stock",
                    "meat_stock",
                  ].map((item) => (
                    <td
                      key={item}
                      className={`px-4 py-2 text-right ${
                        store[item] < threshold
                          ? "text-red-600 dark:text-red-400 font-bold"
                          : ""
                      }`}
                    >
                      {store[item]}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-right">
                    {new Date(store.last_updated).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
