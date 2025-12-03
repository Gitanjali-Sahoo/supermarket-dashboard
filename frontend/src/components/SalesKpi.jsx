import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

export default function SalesKPIs() {
  const { user } = useContext(GlobalContext);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await fetch("/api/sales", {
          headers: { "x-user-id": user.id },
        });
        const data = await res.json();
        setSalesData(data);
      } catch (err) {
        console.error("Failed to fetch sales:", err);
      }
      setLoading(false);
    };

    fetchSales();
  }, [user]);

  if (loading) return <p>Loading KPIs...</p>;
  if (salesData.length === 0) return <p>No sales data available</p>;

  // ===== Compute KPIs =====
  const totalWeeklySales = salesData.reduce(
    (sum, store) => sum + store.total_sales,
    0
  );

  // Top performing store
  const topStore =
    salesData.length > 0
      ? salesData.reduce((a, b) => (a.total_sales > b.total_sales ? a : b))
          .store_name
      : "N/A";

  // Best category
  const categoryTotals = salesData.reduce(
    (acc, store) => {
      acc.Dairy += store.dairy_total;
      acc.Bakery += store.bakery_total;
      acc.Produce += store.produce_total;
      acc.Meat += store.meat_total;
      return acc;
    },
    { Dairy: 0, Bakery: 0, Produce: 0, Meat: 0 }
  );

  const bestCategory = Object.keys(categoryTotals).reduce((a, b) =>
    categoryTotals[a] > categoryTotals[b] ? a : b
  );

  // Daily average (for manager or admin)
  const dailyAverage = (totalWeeklySales / 7).toFixed(2);

  // ===== Render =====
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <p className="text-gray-500 dark:text-gray-300">Total Weekly Sales</p>
        <p className="text-2xl font-bold">${totalWeeklySales}</p>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <p className="text-gray-500 dark:text-gray-300">Top Performing Store</p>
        <p className="text-2xl font-bold">{topStore}</p>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <p className="text-gray-500 dark:text-gray-300">Best Category</p>
        <p className="text-2xl font-bold">{bestCategory}</p>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <p className="text-gray-500 dark:text-gray-300">Average Daily Sales</p>
        <p className="text-2xl font-bold">${dailyAverage}</p>
      </div>
    </div>
  );
}
