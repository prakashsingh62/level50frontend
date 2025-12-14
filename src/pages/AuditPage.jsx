import { useEffect, useState } from "react";
import { getAuditReport } from "../api";

export default function AuditPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAuditReport()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Audit Report</h1>

      <p style={{ color: "#666", fontSize: "14px" }}>
        Safe Mode — Read only. Table UI in progress.
      </p>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!data && !error && <p>Loading audit data…</p>}

      {data && (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ marginTop: "16px", width: "100%", borderCollapse: "collapse" }}
        >
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
            {data.rows.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "#777" }}>
                  No audit records found
                </td>
              </tr>
            )}

            {data.rows.map((row, index) => (
              <tr key={index}>
                <td>{row.timestamp}</td>
                <td>{row.run_id}</td>
                <td>{row.status}</td>
                <td>{row.error_type || "-"}</td>
                <td>{row.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
