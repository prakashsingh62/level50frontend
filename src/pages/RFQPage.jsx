import { useState } from "react";
import useRFQs from "../hooks/useRFQs";

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
  };
};

export default function RFQPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { rows, meta, summary, loading } = useRFQs({
    status,
    page,
    pageSize: 50,
  });

  const totalPages = Math.ceil((meta?.total || 0) / 50);

  return (
    <div style={{ padding: 16 }}>
      <h2>RFQ Dashboard</h2>

      {/* STATUS FILTER */}
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setPage(1);
        }}
        style={{ padding: 6, marginBottom: 10 }}
      >
        <option value="">ALL STATUS</option>
        {Object.entries(summary || {}).map(([k, v]) => (
          <option key={k} value={k}>
            {k} ({v})
          </option>
        ))}
      </select>

      {/* TABLE */}
      <div style={{ overflow: "auto", maxHeight: "70vh" }}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            minWidth: 1400,
          }}
        >
          <thead>
            <tr>
              <th style={{ ...th, ...stickyLeft, width: 80 }}>SR.NO</th>
              <th style={{ ...th, ...stickyLeft2, width: 260 }}>
                CUSTOMER NAME
              </th>
              <th style={th}>LOCATION</th>
              <th style={th}>RFQ NO</th>
              <th style={th}>RFQ DATE</th>
              <th style={th}>UID NO</th>
              <th style={th}>PRODUCT</th>
              <th style={th}>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: 20, textAlign: "center" }}>
                  No RFQs in this status
                </td>
              </tr>
            )}

            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ ...cell, ...stickyLeft }}>{r["SR.NO"]}</td>
                <td style={{ ...cell, ...stickyLeft2 }}>
                  {r["CUSTOMER NAME"]}
                </td>
                <td style={cell}>{r["LOCATION"]}</td>
                <td style={cell}>{r["RFQ NO"]}</td>
                <td style={cell}>{r["RFQ DATE"]}</td>
                <td style={cell}>{r["UID NO"]}</td>
                <td style={cell}>{r["PRODUCT"] ?? r["PRODUCT NAME"] ?? r["PRODUCT_DESC"] ?? r["PRODUCT DESCRIPTION"] ?? ""}</td>
                <td style={cell}>
                  <span style={statusStyle(r["FINAL STATUS"])}>
                    {r["FINAL STATUS"]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div style={{ marginTop: 10 }}>
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} / {totalPages || 1}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
