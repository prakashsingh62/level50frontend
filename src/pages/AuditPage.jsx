import { useEffect, useMemo, useState } from "react";
import { getAuditReport } from "../api";

export default function AuditPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Phase-2 states (already in use)
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("timestamp");
  const [sortDir, setSortDir] = useState("desc");

  // Phase-3 state
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    getAuditReport()
      .then((res) => setData(res.rows || []))
      .catch((err) => setError(err.message));
  }, []);

  const filteredData = useMemo(() => {
    let rows = [...data];

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r).some((v) =>
          String(v || "").toLowerCase().includes(q)
        )
      );
    }

    rows.sort((a, b) => {
      const A = a[sortKey] ?? "";
      const B = b[sortKey] ?? "";
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [data, search, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div style={{ padding: 20, position: "relative" }}>
      <h1>Audit Report</h1>
      <p style={{ color: "#666" }}>
        🔒 Safe Mode — Read only. Table UI in progress.
      </p>

      <input
        placeholder="Global search…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 12, padding: 6, width: 240 }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th onClick={() => toggleSort("timestamp")}>Timestamp ⇅</th>
            <th onClick={() => toggleSort("run_id")}>Run ID ⇅</th>
            <th onClick={() => toggleSort("status")}>Status ⇅</th>
            <th onClick={() => toggleSort("error_type")}>Error Type ⇅</th>
            <th onClick={() => toggleSort("remarks")}>Remarks ⇅</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, i) => (
            <tr
              key={i}
              onClick={() => setSelectedRow(row)}
              style={{
                cursor: "pointer",
                background:
                  selectedRow === row ? "#eef6ff" : "transparent",
              }}
            >
              <td>{row.timestamp}</td>
              <td>{row.run_id || "-"}</td>
              <td>{row.status}</td>
              <td>{row.error_type || "-"}</td>
              <td>{row.remarks || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== ROW INSPECTOR ===== */}
      {selectedRow && (
        <div
          onClick={() => setSelectedRow(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              width: 360,
              background: "#fff",
              padding: 16,
              boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
            }}
          >
            <h3>Audit Row Inspector</h3>

            <Inspector label="Timestamp" value={selectedRow.timestamp} />
            <Inspector label="Run ID" value={selectedRow.run_id} />
            <Inspector label="Status" value={selectedRow.status} />
            <Inspector label="Error Type" value={selectedRow.error_type} />
            <Inspector label="Remarks" value={selectedRow.remarks} />

            <button
              onClick={() => setSelectedRow(null)}
              style={{ marginTop: 16 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Inspector({ label, value }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <strong>{label}</strong>
      <div style={{ color: "#555", wordBreak: "break-word" }}>
        {value || "-"}
      </div>
    </div>
  );
}
