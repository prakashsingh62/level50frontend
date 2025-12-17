import { useEffect, useMemo, useState } from "react";
import { getAuditReport } from "../api/audit.js";
import { exportCsv } from "../api/exportCsv.js";

export default function RFQDashboard() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAuditReport()
      .then((res) => {
        // ✅ FIX: handle both [] and { rows: [] }
        const data = Array.isArray(res) ? res : res?.rows || [];
        setRows(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Failed to load audit data");
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((v) =>
        String(v ?? "").toLowerCase().includes(query)
      )
    );
  }, [rows, q]);

  const stats = useMemo(() => {
    const total = rows.length;
    const ok = rows.filter((r) => r.remarks === "OK").length;
    const errors = rows.filter(
      (r) => r.error_type && r.error_type !== "" && r.error_type !== "SYSTEM"
    ).length;
    return { total, ok, errors };
  }, [rows]);

  return (
    <div
      style={{
        padding: 16,
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        gap: 16,
      }}
    >
      {/* LEFT PANEL */}
      <div>
        <h2>Phase-14 Audit Dashboard</h2>
        <p style={{ color: "#555" }}>
          Level-80 automation is active (read-only)
        </p>

        {/* KPI TILES */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            margin: "12px 0",
          }}
        >
          <Kpi label="Total Runs" value={stats.total} />
          <Kpi label="OK" value={stats.ok} />
          <Kpi label="Errors" value={stats.errors} />
        </div>

        {/* SEARCH + EXPORT */}
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            placeholder="Search anything…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1, padding: 6 }}
          />
          <button
            onClick={() => exportCsv(filtered)}
            disabled={!filtered.length}
          >
            Export CSV
          </button>
        </div>

        {/* TABLE */}
        {loading && <div>Loading…</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}

        {!loading && !error && (
          <table
            width="100%"
            border="1"
            cellPadding="6"
            style={{ borderCollapse: "collapse" }}
          >
            <thead style={{ background: "#f5f5f5" }}>
              <tr>
                <th>Timestamp</th>
                <th>Run</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelected(r)}
                >
                  <td>{r.timestamp}</td>
                  <td>{r.run_id}</td>
                  <td>{r.status}</td>
                  <td>{r.remarks}</td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* RIGHT INSPECTOR */}
      <div style={{ border: "1px solid #ddd", padding: 8 }}>
        <h3>Inspector</h3>
        {!selected && <div>Select a row</div>}
        {selected && (
          <pre style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(selected, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 8 }}>
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: "bold" }}>{value}</div>
    </div>
  );
}
