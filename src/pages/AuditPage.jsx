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
        setError("Failed to load audit logs");
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>Loading audit report...</div>;
  }

  return (
    <div style={{ padding: "16px" }}>
      <h2>Audit Report</h2>

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
          {data.rows.map((row, idx) => (
            <tr key={idx}>
              <td>{row.timestamp}</td>
              <td>{row.run_id}</td>
              <td>{row.status}</td>
              <td>{row.error_type}</td>
              <td>{row.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
