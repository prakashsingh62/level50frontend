import { useEffect, useState } from "react";
import { fetchRFQs } from "../api/rfqs";
import RFQTable from "../components/RFQTable";

const STATUS_OPTIONS = [
  "",
  "VENDOR PENDING",
  "QUOTATION RECEIVED",
  "OFFER SUBMITTED",
  "POST-OFFER QUERY",
  "CLARIFICATION",
  "UNKNOWN",
];

export default function RFQPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    fetchRFQs({ status, search })
      .then((data) => {
        if (active) setRows(data.rows || []);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [status, search]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">RFQ Dashboard</h1>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s || "All Status"}
            </option>
          ))}
        </select>

        <input
          placeholder="Search RFQ / Customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      {/* States */}
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && <RFQTable rows={rows} />}
    </div>
  );
}
