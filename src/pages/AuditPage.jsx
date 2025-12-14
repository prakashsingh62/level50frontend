import { useEffect, useState } from "react";
import { getAuditReport } from "../api";

export default function AuditPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await getAuditReport();
        if (!alive) return;
        setData(res || null);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Failed to load audit data");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  // SAFE GUARDS
  const rows = Array.isArray(data?.rows) ? data.rows : [];

  return (
    <div style={{ padding: "16px", fontFamily: "system-ui, sans-serif" }}>
      <h2>Audit Report</h2>
      <p style={{ color: "#666", marginTop: 0 }}>
        Safe mode • Read-only table
      </p>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <p>
            Total records: <strong>{rows.length}</strong>
          </p>

          {rows.length === 0 ? (
            <p>No audit records found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                border="1"
                cellPadding="6"
                cellSpacing="0"
                style={{ borderCollapse: "collapse", width: "100%" }}
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
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td>{r?.timestamp ?? "-"}</td>
                      <td>{r?.run_id ?? "-"}</td>
                      <td>{r?.status ?? "-"}</td>
                      <td>{r?.error_type ?? "-"}</td>
                      <td>{r?.remarks ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
