import { useEffect, useState } from "react";
import { getAuditReport } from "../api";

export default function AuditPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAuditReport()
      .then((res) => setData(res))
      .catch(() => setError("Failed to load audit data"));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Audit Report</h1>

      <p style={{ color: "#555" }}>
        Safe mode enabled. Table structure only.
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            <th>Timestamp</th>
            <th>Run ID</th>
            <th>Status</th>
            <th>Error Type</th>
            <th>Remarks</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan="5" style={{ textAlign: "center", color: "#777" }}>
              Table body will be enabled in next step
            </td>
          </tr>
        </tbody>
      </table>

      {data?.count !== undefined && (
        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          Total records: {data.count}
        </p>
      )}
    </div>
  );
}
