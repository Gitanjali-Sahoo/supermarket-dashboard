// SalesTable.jsx

export default function SalesTable({ data, itemKeys, visibleItems }) {
  return (
    <div className="mb-6 overflow-x-auto rounded-xl shadow-md bg-white dark:bg-gray-800 p-4">
      <h3 className="text-xl font-bold mb-4">Daily Sales</h3>
      <table className="min-w-[600px] w-full text-left border-collapse text-md">
        <thead>
          <tr>
            <th className="border-b px-3 py-2 sticky top-0 bg-white dark:bg-gray-800 z-10">
              Day
            </th>
            {itemKeys.map(
              (k) =>
                visibleItems.has(k) && (
                  <th
                    key={k}
                    className="border-b px-3 py-2 sticky top-0 bg-white dark:bg-gray-800 z-10"
                  >
                    {k}
                  </th>
                )
            )}
            <th className="border-b px-3 py-2 sticky top-0 bg-white dark:bg-gray-800 z-10">
              Total
            </th>
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
