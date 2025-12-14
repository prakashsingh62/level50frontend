import { useEffect, useState } from "react";
import { getAuditReport } from "../api";

export default function AuditPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAuditReport()
      .then((res) => {
        setData(res);
      })
      .catch(() => {
        setError("Failed to load audit data");
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Audit Report</h2>

      <p style={{ color: "#666", marginBottom: "12px" }}>
        Safe Mode: Table skeleton only. No dynamic rendering yet.
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!data && !error && <p>Loading audit data...</p>}

      {data && (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ borderCollapse: "collapse", width: "100%" }}
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
              <td colSpan="5" style={{ textAlign: "center", color: "#888" }}>
                Table body rendering locked (Phase-3)
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
