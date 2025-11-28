import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyPieChart({ pieData, totalPie, COLORS }) {
  return (
    <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 w-full">
      <h3 className="text-xl font-semibold mb-4">Weekly Totals</h3>
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
  );
}
