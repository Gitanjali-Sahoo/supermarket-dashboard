// SalesTable.jsx

export default function SalesTable({ data, itemKeys, visibleItems }) {
  return (
    <div className="mb-6 overflow-auto rounded-xl shadow-md bg-white dark:bg-gray-800 p-4">
      <h3 className="text-xl font-semibold mb-4">Daily Sales</h3>
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
          {data.map((row) => (
            <tr key={row.day}>
              <td className="border-b px-3 py-2">{row.day}</td>
              {itemKeys.map(
                (k) =>
                  visibleItems.has(k) && (
                    <td key={k} className="border-b px-3 py-2">
                      {(row[k] || 0).toLocaleString("sv-SE")}
                    </td>
                  )
              )}
              <td className="border-b px-3 py-2">
                {itemKeys
                  .reduce((sum, k) => sum + (row[k] || 0), 0)
                  .toLocaleString("sv-SE")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
