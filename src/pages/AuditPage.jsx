import { useEffect, useState } from "react";
import { getAuditReport } from "../api";

const badgeStyle = (value) => {
  if (!value) return { background: "#eee", color: "#333" };

  const v = String(value).toUpperCase();

  if (v === "SUCCESS")
    return { background: "#e6fffa", color: "#065f46" };

  if (v === "SYSTEM" || v === "ERROR")
    return { background: "#fee2e2", color: "#991b1b" };

  return { background: "#f3f4f6", color: "#111827" };
};

export default function AuditPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAuditReport()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: "24px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: "4px" }}>Audit Report</h1>

      <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "16px" }}>
        Safe Mode — Read only. Table UI in progress.
      </p>

      {error && (
        <p style={{ color: "#b91c1c", fontWeight: 500 }}>
          Error: {error}
        </p>
      )}

      {!data && !error && (
        <p style={{ color: "#6b7280" }}>Loading audit data…</p>
      )}

      {data && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Timestamp", "Run ID", "Status", "Error Type", "Remarks"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "2px solid #e5e7eb",
                        position: "sticky",
                        top: 0,
                        background: "#f9fafb",
                        zIndex: 1,
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {data.rows.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "24px",
                      color: "#6b7280",
                    }}
                  >
                    No audit records found
                  </td>
                </tr>
              )}

              {data.rows.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <td style={{ padding: "10px" }}>{row.timestamp}</td>
                  <td style={{ padding: "10px", fontWeight: 500 }}>
                    {row.run_id || "-"}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        ...badgeStyle(row.status),
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px" }}>
                    {row.error_type || "-"}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {row.remarks || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
