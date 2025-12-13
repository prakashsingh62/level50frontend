import { useEffect, useState } from "react";
import { fetchAuditReport } from "./api";

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  fetchAuditReport(50)
    .then((data) => {
      setRows(data);   // ✅ direct array
      setLoading(false);
    })
    .catch(() => {
      setError("Failed to fetch audit report");
      setLoading(false);
    });
}, []);

  if (loading) return <h3>Loading audit report…</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  if (!rows.length) return <h3>No audit data found</h3>;

  const headers = Object.keys(rows[0]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Level-80 Audit Report</h2>

      <table border="1" cellPadding="6" cellSpacing="0">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {headers.map((h) => (
                <td key={h}>{row[h]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
