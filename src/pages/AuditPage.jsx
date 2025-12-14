import { useEffect, useMemo, useState } from "react";
import { getAuditReport } from "../api";

export default function AuditPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // sorting
  const [sortKey, setSortKey] = useState("timestamp");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    getAuditReport()
      .then((res) => setData(res.rows || []))
      .catch((err) => setError(err.message));
  }, []);

  // filtered + sorted rows
  const rows = useMemo(() => {
    let r = [...data];

    if (search) {
      const q = search.toLowerCase();
      r = r.filter((row) =>
        Object.values(row).some((v) =>
          String(v || "").toLowerCase().includes(q)
        )
      );
    }

    if (dateFilter) {
      r = r.filter((row) =>
        row.timestamp?.startsWith(dateFilter)
      );
    }

    r.sort((a, b) => {
      const av = a[sortKey] || "";
      const bv = b[sortKey] || "";
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return r;
  }, [data, search, dateFilter, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // ===== CSV EXPORT (Phase-4.4) =====
  function exportCSV() {
    if (!rows.length) return;

    const headers = [
      "Timestamp",
      "Run ID",
      "Status",
      "Error Type",
      "Remarks",
    ];

    const csvRows = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.timestamp,
          r.run_id,
          r.status,
          r.error_type,
          r.remarks,
        ]
          .map((v) => `"${String(v || "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Audit Report</h1>
      <p style={{ color: "#666" }}>
        🔒 Safe Mode — Read only. Table UI in progress.
      </p>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <input
          placeholder="Global search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />

        <button onClick={exportCSV}>
          ⬇ Export CSV
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table width="100%" cellPadding="8">
        <thead>
          <tr>
            <th onClick={() => toggleSort("timestamp")}>Timestamp</th>
            <th onClick={() => toggleSort("run_id")}>Run ID</th>
            <th onClick={() => toggleSort("status")}>Status</th>
            <th onClick={() => toggleSort("error_type")}>Error Type</th>
            <th onClick={() => toggleSort("remarks")}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.timestamp}</td>
              <td>{r.run_id || "-"}</td>
              <td>{r.status || "-"}</td>
              <td>{r.error_type || "-"}</td>
              <td>{r.remarks || "-"}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan="5" align="center">
                No records
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
