import { useEffect, useState } from "react";
import { getAuditReport } from "../api";

export default function AuditPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAuditReport()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError("Failed to load audit report");
        console.error(err);
      });
  }, []);

  if (error) {
    return <div style={{ padding: 20 }}>{error}</div>;
  }

  if (!data) {
    return <div style={{ padding: 20 }}>Loading audit report…</div>;
  }

  const rows = Array.isArray(data.rows) ? data.rows : [];

  return (
    <div style={{ padding: 20 }}>
      <h2>Audit Report</h2>
      <p>Total records: {data.count}</p>

      <table border="1" cellPadding="6" cellSpacing="0">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Run ID</th>
            <th>Status</th>
            <th>Error Type</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="5">No audit data</td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={idx}>
                <td>{row.timestamp || "-"}</td>
                <td>{row.run_id || "-"}</td>
                <td>{row.status || "-"}</td>
                <td>{row.error_type || "-"}</td>
                <td>{row.remarks || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
