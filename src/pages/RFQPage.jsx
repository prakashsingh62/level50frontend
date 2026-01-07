import { useState } from "react";
import useRFQs from "../hooks/useRFQs";

/* ================== STYLES ================== */

const th = {
  position: "sticky",
  top: 0,
  background: "#f5f5f5",
  zIndex: 2,
  border: "1px solid #ddd",
  padding: "8px",
  whiteSpace: "nowrap",
};

const stickyLeft = {
  position: "sticky",
  left: 0,
  background: "#fff",
  zIndex: 3,
};

const stickyLeft2 = {
  position: "sticky",
  left: 80,
  background: "#fff",
  zIndex: 3,
};

const cell = {
  border: "1px solid #eee",
  padding: "6px 8px",
  whiteSpace: "nowrap",
};

const statusStyle = (s) => {
  const map = {
    "VENDOR PENDING": { bg: "#fdecea", color: "#b71c1c" },
    "QUOTATION RECEIVED": { bg: "#e3f2fd", color: "#0d47a1" },
    "OFFER SUBMITTED": { bg: "#e8f5e9", color: "#1b5e20" },
    "POST-OFFER QUERY": { bg: "#fff3e0", color: "#e65100" },
    "CLOSED": { bg: "#eceff1", color: "#263238" },
    "UNKNOWN": { bg: "#f3e5f5", color: "#4a148c" },
  };
  const m = map[s] || { bg: "#eeeeee", color: "#333" };
  return {
    background: m.bg,
    color: m.color,
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    display: "inline-block",
  };
};

/* ================== COMPONENT ================== */

export default function RFQPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { rows, meta, summary, loading, error } = useRFQs({
    status,
    page,
    pageSize: 50,
  });

  console.log("📊 RFQPage RENDER:", {
    rowsCount: rows.length,
    loading,
    error,
    firstRow: rows[0],
    meta,
    summary
  });

  const totalPages = Math.ceil((meta?.total || 0) / 50);

  // ✅ SIMPLIFIED PRODUCT GETTER (Now rows are already transformed)
  function getProduct(r) {
    return r['PRODUCT'] || "";
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>RFQ Dashboard</h2>

      {/* DEBUG INFO */}
      {error && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: 10, marginBottom: 10, borderRadius: 4 }}>
          ❌ Error: {error}
        </div>
      )}

      {loading && (
        <div style={{ background: "#fff3e0", padding: 10, marginBottom: 10, borderRadius: 4 }}>
          🔄 Loading RFQs...
        </div>
      )}

      {!loading && rows.length > 0 && (
        <div style={{ background: "#e8f5e9", padding: 10, marginBottom: 10, borderRadius: 4 }}>
          ✅ Loaded {rows.length} RFQs (Total: {meta.total || 0})
        </div>
      )}

      {/* STATUS FILTER */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10, fontWeight: "bold" }}>Filter by Status:</label>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          style={{ 
            padding: "8px 12px", 
            border: "1px solid #ccc",
            borderRadius: 4,
            minWidth: 200
          }}
        >
          <option value="">ALL STATUS ({meta.total || 0})</option>
          {Object.entries(summary || {}).map(([statusKey, count]) => (
            <option key={statusKey} value={statusKey}>
              {statusKey} ({count})
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div style={{ overflow: "auto", maxHeight: "70vh", border: "1px solid #ddd", borderRadius: 4 }}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            minWidth: 1400,
            fontFamily: "Arial, sans-serif",
            fontSize: "14px"
          }}
        >
          <thead>
            <tr>
              <th style={{ ...th, ...stickyLeft, width: 80 }}>SR.NO</th>
              <th style={{ ...th, ...stickyLeft2, width: 260 }}>CUSTOMER NAME</th>
              <th style={th}>LOCATION</th>
              <th style={th}>RFQ NO</th>
              <th style={th}>RFQ DATE</th>
              <th style={th}>UID NO</th>
              <th style={th}>PRODUCT</th>
              <th style={th}>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} style={{ padding: 40, textAlign: "center" }}>
                  <div>Loading RFQs...</div>
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#666" }}>
                  {error ? `Error: ${error}` : "No RFQs found"}
                </td>
              </tr>
            )}

            {!loading && rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                <td style={{ ...cell, ...stickyLeft, textAlign: "center" }}>
                  {r['SR.NO'] || i + 1}
                </td>
                <td style={{ ...cell, ...stickyLeft2, fontWeight: "500" }}>
                  {r['CUSTOMER NAME'] || "N/A"}
                </td>
                <td style={cell}>{r['LOCATION'] || "N/A"}</td>
                <td style={cell}>
                  <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                    {r['RFQ NO'] || "N/A"}
                  </span>
                </td>
                <td style={cell}>{r['RFQ DATE'] || "N/A"}</td>
                <td style={cell}>{r['UID NO'] || "N/A"}</td>
                <td style={cell}>{getProduct(r)}</td>
                <td style={cell}>
                  <span style={statusStyle(r['FINAL STATUS'])}>
                    {r['FINAL STATUS'] || "UNKNOWN"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {!loading && rows.length > 0 && (
        <div style={{ 
          marginTop: 20, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          gap: "10px"
        }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              background: page <= 1 ? "#f5f5f5" : "#fff",
              cursor: page <= 1 ? "not-allowed" : "pointer",
              borderRadius: 4
            }}
          >
            ← Prev
          </button>
          
          <span style={{ margin: "0 10px", fontWeight: "500" }}>
            Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong>
            <span style={{ marginLeft: 20, color: "#666" }}>
              (Showing {rows.length} of {meta.total || 0} RFQs)
            </span>
          </span>
          
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              background: page >= totalPages ? "#f5f5f5" : "#fff",
              cursor: page >= totalPages ? "not-allowed" : "pointer",
              borderRadius: 4
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
