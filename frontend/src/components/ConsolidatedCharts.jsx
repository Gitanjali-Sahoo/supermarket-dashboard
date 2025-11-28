import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ConsolidatedCharts({ salesData, storeList, COLORS }) {
  const consolidatedDailyData = salesData.map((row) => {
    const obj = { day: row.day };
    storeList.forEach((store) => {
      const storeData = row[store] || {};
      obj[store] = ["Dairy", "Bakery", "Produce", "Meat"].reduce(
        (sum, k) => sum + (storeData[k] || 0),
        0
      );
    });
    return obj;
  });

  const consolidatedWeeklyTotals = storeList.map((store) => {
    const total = salesData.reduce((sum, row) => {
      const storeData = row[store] || {};
      return (
        sum +
        ["Dairy", "Bakery", "Produce", "Meat"].reduce(
          (s, k) => s + (storeData[k] || 0),
          0
        )
      );
    }, 0);
    return { name: store, value: total };
  });

  const consolidatedWeeklyTotalSum = consolidatedWeeklyTotals.reduce(
    (sum, v) => sum + v.value,
    0
  );

  const formatYAxis = (v) => `${(v / 1000).toFixed(0)}k`;

  return (
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
              <Bar key={s} dataKey={s} fill={Object.values(COLORS)[i % 4]} />
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
  );
}
