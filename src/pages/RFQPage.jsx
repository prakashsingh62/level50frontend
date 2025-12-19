import { useEffect, useState } from "react";
import { fetchRFQs } from "../api/rfqs";

export default function RFQPage() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchRFQs({
      status: status || undefined,
      page,
      page_size: 50,
    }).then((d) => {
      setRows(d.rows || []);
      setSummary(d.summary || {});
    });
  }, [status, page]);

  return (
    <div style={{ padding: 20 }}>
      <h2>RFQs</h2>

      {/* STATUS FILTER */}
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">ALL</option>
        <option value="VENDOR_PENDING">Vendor Pending</option>
        <option value="QUOTATION_RECEIVED">Quotation Received</option>
        <option value="OFFER_SUBMITTED">Offer Submitted</option>
        <option value="POST_OFFER_QUERY">Post-Offer Query</option>
        <option value="CLOSED">Closed</option>
      </select>

      {/* SUMMARY */}
      <pre>{JSON.stringify(summary, null, 2)}</pre>

      {/* TABLE */}
      <table border="1" cellPadding="6" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>RFQ No</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r["RFQ NO"]}</td>
              <td>{r["CUSTOMER NAME"]}</td>
              <td>{r.canonical_status}</td>
              <td>{r["DUE DATE"]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <button onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
      <button onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  );
}
