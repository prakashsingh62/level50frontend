import { useState } from "react";
import useRFQs from "../hooks/useRFQs";

export default function RFQPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const {
    rows,
    summary,
    meta,
    loading,
    error,
  } = useRFQs({
    status,
    page,
    pageSize: 50,
    lastNDays: 10000,
  });

  // Build table headers dynamically (future-proof)
  const headers = rows && rows.length ? Object.keys(rows[0]) : [];

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>RFQ Dashboard</h2>

      {/* FILTER BAR */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">ALL STATUS</option>
          {Object.keys(summary || {}).map((s) => (
            <option key={s} value={s}>
              {s} ({summary[s]})
            </option>
          ))}
        </select>
      </div>

      {/* STATES */}
      {loading && <div>Loading RFQs…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* TABLE */}
      {!loading && !error && (
        <div style={{ overflow: "auto", border: "1px solid #ccc" }}>
          <table
            style={{
              borderCollapse: "collapse",
              minWidth: "100%",
              fontSize: 13,
            }}
          >
            <thead style={{ background: "#f3f3f3", position: "sticky", top: 0 }}>
              <tr>
                {headers.map((h) => (
                  <th
                    key={h}
                    style={{
                      border: "1px solid #ccc",
                      padding: "6px 8px",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  {headers.map((h) => (
                    <td
                      key={h}
                      style={{
                        border: "1px solid #ddd",
                        padding: "6px 8px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row[h] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {!loading && meta?.total > 0 && (
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span>
            Page {meta.page} /{" "}
            {Math.ceil(meta.total / meta.page_size || 1)}
          </span>
          <button
            onClick={() =>
              setPage((p) =>
                p * meta.page_size < meta.total ? p + 1 : p
              )
            }
            disabled={page * meta.page_size >= meta.total}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
