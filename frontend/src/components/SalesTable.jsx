export default function SalesTable({ sales }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Store</th>
          <th>Day</th>
          <th>Dairy</th>
          <th>Bakery</th>
          <th>Produce</th>
          <th>Meat</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {sales.map((s) => (
          <tr key={s.id}>
            <td>{s.store}</td>
            <td>{s.day}</td>
            <td>{s.dairy}</td>
            <td>{s.bakery}</td>
            <td>{s.produce}</td>
            <td>{s.meat}</td>
            <td>{s.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
