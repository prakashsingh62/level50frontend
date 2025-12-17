import { useEffect, useState } from "react";
import { getAuditReport } from "../api/audit";
import { exportCsv } from "../api/exportCsv";

export default function RFQDashboard() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (pageNo) => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAuditReport({
        page: pageNo,
        limit
      });

      setRows(res.rows || []);
      setPage(res.page || 1);
      setTotal(res.total || 0);
      setTotalPages(res.total_pages || 1);
    } catch (e) {
      setError(e.message || "Failed to load audit data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
    // eslint-disable-next-line
  }, [page]);

  const okCount = rows.filter(
    r => r.remarks === "OK" || r.status === "0"
  ).length;

  const errorCount = rows.length - okCount;

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ marginBottom: 4 }}>Audit Dashboard</h2>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Level-80 automation · Read-only
      </p>

      {/* KPI CARDS */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <KPI label="Total Runs" value={total} />
        <KPI label="OK" value={okCount} color="green" />
        <KPI label="Errors" value={errorCount} color="red" />
      </div>

      {/* ACTION BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10
        }}
      >
        <div style={{ color: "#666", fontSize: 13 }}>
          Showing {from}–{to} of {total}
        </div>

        <button
          onClick={() => exportCsv(rows)}
          style={btnStyle}
        >
          Export CSV
        </button>
      </div>

      {/* TABLE + INSPECTOR */}
      <div style={{ display: "flex", gap: 20 }}>
        {/* TABLE */}
        <div style={{ width: "70%", overflowX: "auto" }}>
          <table
            width="100%"
            cellPadding="10"
            cellSpacing="0"
            style={{
              borderCollapse: "collapse",
              border: "1px solid #ddd"
            }}
          >
            <thead style={{ position: "sticky", top: 0, background: "#f7f7f7" }}>
              <tr>
                <Th>Timestamp</Th>
                <Th>Run</Th>
                <Th>Status</Th>
                <Th>Remarks</Th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <Td colSpan="4" center>
                    Loading…
                  </Td>
                </tr>
              )}

              {!loading && rows.length === 0 && (
                <tr>
                  <Td colSpan="4" center>
                    No audit records found
                  </Td>
                </tr>
              )}

              {!loading &&
                rows.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedRow(row)}
                    style={{
                      background:
                        selectedRow === row ? "#eef5ff" : i % 2 ? "#fafafa" : "#fff",
                      cursor: "pointer"
                    }}
                  >
                    <Td>{row.timestamp}</Td>
                    <Td>{row.run_id}</Td>
                    <Td>
                      <StatusBadge
                        ok={row.remarks === "OK" || row.status === "0"}
                      />
                    </Td>
                    <Td>{row.remarks}</Td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* INSPECTOR */}
        <div
          style={{
            width: "30%",
            border: "1px solid #ddd",
            borderRadius: 4,
            padding: 12
          }}
        >
          <h4 style={{ marginTop: 0 }}>Inspector</h4>
          {selectedRow ? (
            <div style={{ fontSize: 13 }}>
              {Object.entries(selectedRow).map(([k, v]) => (
                <div key={k} style={{ marginBottom: 6 }}>
                  <b>{k}</b>
                  <div style={{ color: "#444" }}>{String(v)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#666" }}>Select a row to inspect</p>
          )}
        </div>
      </div>

      {/* PAGINATION */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          gap: 8,
          justifyContent: "flex-end"
        }}
      >
        <button
          style={btnStyle}
          disabled={page <= 1}
          onClick={() => setPage(p => p - 1)}
        >
          ◀ Prev
        </button>

        <button
          style={btnStyle}
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next ▶
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: 12 }}>
          {error}
        </div>
      )}
    </div>
  );
}

/* UI PARTS */

function KPI({ label, value, color }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 6,
        padding: 14,
        minWidth: 140
      }}
    >
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
      <div
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: color || "#111"
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ ok }) {
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        background: ok ? "#e6f4ea" : "#fdecea",
        color: ok ? "#137333" : "#a50e0e"
      }}
    >
      {ok ? "OK" : "ERROR"}
    </span>
  );
}

function Th({ children }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: 10,
        borderBottom: "1px solid #ddd",
        fontSize: 13
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, colSpan, center }) {
  return (
    <td
      colSpan={colSpan}
      style={{
        padding: 10,
        borderBottom: "1px solid #eee",
        textAlign: center ? "center" : "left",
        color: "#333",
        fontSize: 13
      }}
    >
      {children}
    </td>
  );
}

const btnStyle = {
  padding: "6px 12px",
  border: "1px solid #ccc",
  borderRadius: 4,
  background: "#fff",
  cursor: "pointer"
};
