import { useEffect, useState } from "react";
import { getAuditReport } from "../api";

const PAGE_SIZE = 10;

export default function AuditPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAuditReport()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const rows = data?.rows || [];
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));

  const startIndex = (page - 1) * PAGE_SIZE;
  const pagedRows = rows.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Audit Report</h1>

      <p style={{ color: "#666", fontSize: "14px" }}>
        🔒 Safe Mode — Read only. Table UI in progress.
      </p>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!data && !error && <p>Loading audit data…</p>}

      {data && (
        <>
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
                <th>Timestamp</th>
                <th>Run ID</th>
                <th>Status</th>
                <th>Error Type</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "#777" }}>
                    No audit records found
                  </td>
                </tr>
              )}

              {pagedRows.map((row, index) => (
                <tr key={startIndex + index}>
                  <td>{row.timestamp}</td>
                  <td>{row.run_id || "-"}</td>
                  <td>{row.status || "-"}</td>
                  <td>{row.error_type || "-"}</td>
                  <td>{row.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ◀ Prev
            </button>

            <span style={{ fontSize: "14px" }}>
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}
