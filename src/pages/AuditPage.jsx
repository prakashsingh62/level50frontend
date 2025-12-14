import { useEffect, useState } from "react";
import { fetchAuditLogs } from "../api";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAuditLogs();
        setLogs(data || []);
      } catch (err) {
        setError("Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading audit logs...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Audit Report</h2>

      {logs.length === 0 ? (
        <p>No audit data found.</p>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Run ID</th>
              <th>Status</th>
              <th>Rows Written</th>
              <th>Error Type</th>
              <th>Error Message</th>
              <th>Retry Count</th>
              <th>Updater</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((row, i) => (
              <tr key={i}>
                <td>{row.timestamp}</td>
                <td>{row.run_id}</td>
                <td>{row.status}</td>
                <td>{row.rows_written}</td>
                <td>{row.error_type}</td>
                <td>{row.error_message}</td>
                <td>{row.retry_count}</td>
                <td>{row.updater}</td>
                <td>{row.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
