import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function RFQDashboard() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetch(`${API_BASE}/api/audit/report?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setRows(data.rows || []);
        setTotal(data.total || 0);
      })
      .catch(err => console.error(err));
  }, [page]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Audit Dashboard</h2>
      <div style={{ marginBottom: 12 }}>
        Level-80 automation · Read-only
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 3 }}>
          <table width="100%" border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Run</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={i}
                  onClick={() => setSelected(r)}
                  style={{ cursor: "pointer", background: selected === r ? "#eef" : "" }}
                >
                  <td>{r.timestamp}</td>
                  <td>{r.run_id}</td>
                  <td>{r.status}</td>
                  <td>{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12 }}>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              ◀ Prev
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {page}
            </span>
            <button disabled={page * limit >= total} onClick={() => setPage(p => p + 1)}>
              Next ▶
            </button>
          </div>
        </div>

        {/* ---------------- INSPECTOR ---------------- */}
        <div style={{ flex: 1, border: "1px solid #ccc", padding: 12 }}>
          <h3>Inspector</h3>

          {!selected && <div>Select a row</div>}

          {selected && (
            <div style={{ fontSize: 13 }}>
              <h4>RFQ Context</h4>

              <div><b>RFQ No:</b> {selected.rfq_no || "-"}</div>
              <div><b>UID:</b> {selected.uid_no || "-"}</div>
              <div><b>Customer:</b> {selected.customer || "-"}</div>
              <div><b>Vendor:</b> {selected.vendor || "-"}</div>
              <div><b>Failed Step:</b> {selected.step || "-"}</div>

              <hr />

              <h4>Error Details</h4>
              <div style={{ color: "red", whiteSpace: "pre-wrap" }}>
                {selected.error_message || "—"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
