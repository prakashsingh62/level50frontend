import { useEffect, useMemo, useState } from "react";
import { getAuditReport } from "../api";

export default function AuditPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // sorting state
  const [sortKey, setSortKey] = useState("timestamp");
  const [sortDir, setSortDir] = useState("desc"); // newest first

  useEffect(() => {
    getAuditReport()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedRows = useMemo(() => {
    if (!data?.rows) return [];

    return [...data.rows].sort((a, b) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Audit Report</h1>

      <p style={{ color: "#666", fontSize: "14px" }}>
        🔒 Safe Mode — Read only. Table UI in progress.
      </p>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!data && !error && <p>Loading audit data…</p>}

      {data && (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{
            marginTop: "16px",
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <SortableTH label="Timestamp" onClick={() => toggleSort("timestamp")} />
              <SortableTH label="Run ID" onClick={() => toggleSort("run_id")} />
              <SortableTH label="Status" onClick={() => toggleSort("status")} />
              <SortableTH label="Error Type" onClick={() => toggleSort("error_type")} />
              <SortableTH label="Remarks" onClick={() => toggleSort("remarks")} />
            </tr>
          </thead>

          <tbody>
            {sortedRows.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "#777" }}>
                  No audit records found
                </td>
              </tr>
            )}

            {sortedRows.map((row, index) => (
              <tr key={index}>
                <td>{row.timestamp}</td>
                <td>{row.run_id || "-"}</td>
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

function SortableTH({ label, onClick }) {
  return (
    <th
      onClick={onClick}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      {label} ⬍
    </th>
  );
}
