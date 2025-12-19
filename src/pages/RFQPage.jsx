import { useState } from "react";
import useRFQs from "../hooks/useRFQs";

const STATUS_COLORS = {
  "VENDOR PENDING": "bg-yellow-100 text-yellow-800",
  "QUOTATION RECEIVED": "bg-green-100 text-green-800",
  "CLARIFICATION": "bg-purple-100 text-purple-800",
  "OFFER SUBMITTED": "bg-blue-100 text-blue-800",
  "POST-OFFER QUERY": "bg-orange-100 text-orange-800",
  "CLOSED": "bg-gray-200 text-gray-800",
  "UNKNOWN": "bg-red-100 text-red-800",
};

export default function RFQPage() {
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  const { rows, summary, loading, error } = useRFQs({
    lastNDays: 10000,
    status,
  });

  const statuses = Object.entries(summary || {});

  const handleSelect = (value) => {
    setStatus(value);
    setOpen(false); // ✅ auto-close dropdown
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">RFQ Dashboard</h1>

      {/* STATUS DROPDOWN */}
      <div className="relative inline-block mb-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="border px-3 py-1 rounded bg-white"
        >
          {status || "ALL STATUS"} ▾
        </button>

        {open && (
          <div className="absolute z-10 bg-white border rounded shadow mt-1 w-60">
            <div
              onClick={() => handleSelect("")}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              ALL STATUS
            </div>

            {statuses.map(([key, count]) => (
              <div
                key={key}
                onClick={() => handleSelect(key)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
              >
                <span>{key}</span>
                <span className="text-sm text-gray-500">({count})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STATES */}
      {loading && <div className="mt-6 text-gray-500">Loading RFQs…</div>}
      {error && <div className="mt-6 text-red-600">{error}</div>}

      {/* EMPTY STATE */}
      {!loading && rows.length === 0 && (
        <div className="mt-10 text-center text-gray-500">
          No RFQs found for this status.
        </div>
      )}

      {/* TABLE */}
      {rows.length > 0 && (
        <div className="overflow-auto border rounded max-h-[70vh]">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 bg-gray-100 z-20">
              <tr>
                <th className="sticky left-0 bg-gray-100 z-30 border px-2 py-1">
                  SR.NO
                </th>
                <th className="sticky left-[60px] bg-gray-100 z-30 border px-2 py-1">
                  CUSTOMER NAME
                </th>
                <th className="border px-2 py-1">LOCATION</th>
                <th className="border px-2 py-1">RFQ NO</th>
                <th className="border px-2 py-1">RFQ DATE</th>
                <th className="border px-2 py-1">PRODUCT</th>
                <th className="border px-2 py-1">STATUS</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => {
                const statusText = row["FINAL STATUS"] || "UNKNOWN";
                const badge =
                  STATUS_COLORS[statusText] || STATUS_COLORS.UNKNOWN;

                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="sticky left-0 bg-white z-10 border px-2 py-1">
                      {row["SR.NO"]}
                    </td>
                    <td className="sticky left-[60px] bg-white z-10 border px-2 py-1">
                      {row["CUSTOMER NAME"]}
                    </td>
                    <td className="border px-2 py-1">{row.LOCATION}</td>
                    <td className="border px-2 py-1">{row["RFQ NO"]}</td>
                    <td className="border px-2 py-1">{row["RFQ DATE"]}</td>
                    <td className="border px-2 py-1">{row.PRODUCT}</td>
                    <td className="border px-2 py-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${badge}`}
                      >
                        {statusText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
