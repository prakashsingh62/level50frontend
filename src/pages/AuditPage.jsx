import { useEffect, useMemo, useState } from "react";
import { getAuditReport } from "../api";

export default function AuditPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAuditReport()
      .then((res) => setData(res?.rows ?? []))
      .catch((err) => setError(err.message));
  }, []);

  // 🔒 SAFE: frontend-only sort
  const sortedRows = useMemo(() => {
    return [...data].sort((a, b) =>
      String(b.timestamp).localeCompare(String(a.timestamp))
    );
  }, [data]);

  const statusBadge = (value) => {
    if (value === "SUCCESS")
      return <span className="badge success">SUCCESS</span>;
    if (value === 0 || value === "0")
      return <span className="badge neutral">SYSTEM</span>;
    return <span className="badge neutral">{value ?? "-"}</span>;
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Audit Report</h1>

      <p className="safe-mode">
        🔒 Safe Mode — Read only. Table UI in progress.
      </p>

      {error && <p className="error">Error: {error}</p>}
      {!error && sortedRows.length === 0 && <p>Loading audit data…</p>}

      {sortedRows.length > 0 && (
        <div className="table-wrap">
          <table>
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
              {sortedRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="mono">{row.timestamp ?? "-"}</td>
                  <td className="mono">{row.run_id ?? "-"}</td>
                  <td>{statusBadge(row.status)}</td>
                  <td>{row.error_type ?? "-"}</td>
                  <td>{row.remarks ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* UI-only styles */}
      <style>{`
        .safe-mode {
          color: #666;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .error {
          color: red;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead th {
          position: sticky;
          top: 0;
          background: #fafafa;
          border-bottom: 2px solid #ddd;
          padding: 10px;
          text-align: left;
        }

        tbody td {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }

        tbody tr:hover {
          background: #f9f9f9;
        }

        .mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 13px;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }

        .badge.success {
          background: #e6f9f0;
          color: #0a7a4a;
        }

        .badge.neutral {
          background: #f1f1f1;
          color: #555;
        }
      `}</style>
    </div>
  );
}
