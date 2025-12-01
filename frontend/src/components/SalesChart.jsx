import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SalesChart({
  data,
  selectedStore,
  itemKeys,
  visibleItems,
  COLORS,
}) {
  const [chartType, setChartType] = useState("line");

  if (!data || !data.length) return <p>No data available for chart</p>;

  const chartData = data.map((row) => ({
    day: row.day,
    ...row[selectedStore],
  }));

  const formatYAxis = (v) => `${(v / 1000).toFixed(0)}k`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-lg border dark:border-gray-700">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm" style={{ color: item.color }}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">
          {chartType === "line" ? "Line Trend" : "Bar Comparison"} –{" "}
          {selectedStore}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("line")}
            className={`px-3 py-1 rounded-md ${
              chartType === "line"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 rounded-md ${
              chartType === "bar"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {chartType === "line" ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip content={<CustomTooltip />} />
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
                    dot={false}
                  />
                )
            )}
          </LineChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip content={<CustomTooltip />} />
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
  );
}
