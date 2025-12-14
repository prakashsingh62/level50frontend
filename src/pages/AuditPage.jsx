import { useEffect, useState } from "react";
import { getAuditReport } from "../api";

export default function AuditPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditReport()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load audit logs");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading audit report...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Audit Report</h2>
      <p>Total Records: {data.count}</p>

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Run ID</th>
            <th>Status</th>
            <th>Rows Written</th>
            <th>Error Type</th>
            <th>Error Message</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, idx) => (
            <tr key={idx}>
              <td>{row.timestamp}</td>
              <td>{row.run_id}</td>
              <td>{row.status}</td>
              <td>{row.rows_written}</td>
              <td>{row.error_type}</td>
              <td>{row.error_message || "-"}</td>
              <td>{row.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
