import { useEffect, useState } from "react";
import { getAuditReport } from "../api";

export default function AuditPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getAuditReport();

        // defensive: backend already sorted, but ensure latest first
        const rows = Array.isArray(res.rows) ? res.rows : [];
        setData([...rows].reverse());
      } catch (e) {
        console.error(e);
        setError("Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading audit logs…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "16px" }}>
      <h2>Audit Report</h2>

      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ borderCollapse: "collapse", width: "100%", marginTop: "12px" }}
      >
        <thead style={{ background: "#f5f5f5" }}>
          <tr>
            <th>Timestamp</th>
            <th>Run ID</th>
            <th>Status</th>
            <th>Error Type</th>
            <th>Remarks</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => {
            const ok = row.status === "0" || row.status === 0;
            return (
              <tr key={idx}>
                <td>{row.timestamp}</td>
                <td>{row.run_id}</td>
                <td style={{ color: ok ? "green" : "red", fontWeight: "bold" }}>
                  {ok ? "OK" : "ERROR"}
                </td>
                <td>{row.error_type || "-"}</td>
                <td>{row.remarks || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
