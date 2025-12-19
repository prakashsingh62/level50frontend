export default function RFQTable({ rows }) {
  if (!rows.length) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No RFQs found
      </div>
    );
  }

  const headers = Object.keys(rows[0]);

  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-full text-sm border-collapse">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border px-2 py-1 text-left whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              {headers.map((h) => (
                <td
                  key={h}
                  className="border px-2 py-1 whitespace-nowrap"
                >
                  {row[h] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
