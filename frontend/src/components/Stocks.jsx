import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { GlobalContext } from "../context/GlobalContext";

export default function Stocks() {
  const { user } = useContext(GlobalContext);
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const [stocks, setStocks] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [threshold, setThreshold] = useState(500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      if (!user?.id) return; // wait until user is loaded
      console.log(user.id);

      setLoading(true);

      try {
        const res = await fetch("/api/stocks", {
          headers: {
            "x-user-id": user.id,
          },
        });

        const data = await res.json();
        setStocks(data);

        // Compute low-stock items
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

  return (
    <div
      className={`min-h-screen p-8 transition-colors ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Stock Levels</h1>

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

      {/* Stock table */}
      {loading ? (
        <p>Loading...</p>
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
