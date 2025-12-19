import { useState } from "react";
import useRFQs from "../hooks/useRFQs";

const STATUS_COLORS = {
  "VENDOR PENDING": "bg-orange-100 text-orange-800",
  "QUOTATION RECEIVED": "bg-green-100 text-green-800",
  "CLARIFICATION": "bg-yellow-100 text-yellow-800",
  "OFFER SUBMITTED": "bg-blue-100 text-blue-800",
  "POST-OFFER QUERY": "bg-purple-100 text-purple-800",
  "CLOSED": "bg-gray-200 text-gray-800",
  "UNKNOWN": "bg-red-100 text-red-800",
};

export default function RFQPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { rows, summary, meta, loading } = useRFQs({
    lastNDays: 10000,
    status,
    page,
    pageSize: 50,
  });

  const totalPages = Math.ceil((meta.total || 0) / (meta.page_size || 50));

  return (
    <div style={{ padding: 16 }}>
      <h2>RFQ Dashboard</h2>

      {/* STATUS DROPDOWN */}
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setPage(1);
        }}
        style={{ marginBottom: 12 }}
      >
        <option value="">ALL STATUS</option>
        {Object.entries(summary || {}).map(([k, v]) => (
          <option key={k} value={k}>
            {k} ({v})
          </option>
        ))}
      </select>

      {/* EMPTY STATE */}
      {!loading && rows.length === 0 && (
        <div style={{ padding: 20, color: "#777" }}>
          No RFQs in this status
        </div>
      )}

      {/* TABLE */}
      <div style={{ overflow: "auto", maxHeight: "70vh" }}>
        <table
          style={{
            borderCollapse: "collapse",
            minWidth: 1200,
            width: "100%",
          }}
        >
          <thead>
            <tr>
              {[
                "SR.NO",
                "CUSTOMER NAME",
                "LOCATION",
                "RFQ NO",
                "RFQ DATE",
                "PRODUCT",
                "STATUS",
              ].map((h, i) => (
                <th
                  key={h}
                  style={{
                    position: "sticky",
                    top: 0,
                    left: i === 0 ? 0 : i === 1 ? 80 : undefined,
                    background: "#f5f5f5",
                    zIndex: 3,
                    border: "1px solid #ddd",
                    padding: 8,
                    minWidth: i === 1 ? 220 : 120,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                {/* SR.NO */}
                <td
                  style={{
                    position: "sticky",
                    left: 0,
                    background: "#fff",
                    border: "1px solid #eee",
                    padding: 6,
                    zIndex: 2,
                  }}
                >
                  {r["SR.NO"]}
                </td>

                {/* CUSTOMER NAME */}
                <td
                  style={{
                    position: "sticky",
                    left: 80,
                    background: "#fff",
                    border: "1px solid #eee",
                    padding: 6,
                    zIndex: 2,
                    minWidth: 220,
                  }}
                >
                  {r["CUSTOMER NAME"]}
                </td>

                <td style={cell}>{r["LOCATION"]}</td>
                <td style={cell}>{r["RFQ NO"]}</td>
                <td style={cell}>{r["RFQ DATE"]}</td>
                <td style={cell}>{r["PRODUCT"]}</td>

                <td style={cell}>
                  <span
                    className={
                      "px-2 py-1 rounded text-sm " +
                      (STATUS_COLORS[r["FINAL STATUS"]] ||
                        "bg-gray-100 text-gray-800")
                    }
                  >
                    {r["FINAL STATUS"] || "UNKNOWN"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div style={{ marginTop: 12 }}>
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 12px" }}>
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

const cell = {
  border: "1px solid #eee",
  padding: 6,
  whiteSpace: "nowrap",
};
