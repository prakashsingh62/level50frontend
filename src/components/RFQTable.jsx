import { useState, useEffect } from "react";
import { api } from "../api";
import RFQDrawer from "./RFQDrawer";

export default function RFQTable() {
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState("");
  const [vendor, setVendor] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [drawerRow, setDrawerRow] = useState(null);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await api.get("/search-rfq", {
        params: {
          q: search,
          customer,
          vendor,
          status,
          page,
          page_size: pageSize,
        },
      });

      const items = res.data.results || res.data.items || [];
      setData(items);
      setTotal(res.data.total || items.length);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(fetchData, 200);
    return () => clearTimeout(t);
  }, [search, customer, vendor, status, page]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const getStatusColor = (v) => {
    if (!v) return "text-gray-600";
    const s = v.toLowerCase();
    if (s.includes("won")) return "text-green-600 font-semibold";
    if (s.includes("lost")) return "text-red-600 font-semibold";
    if (s.includes("submitted")) return "text-blue-600 font-semibold";
    if (s.includes("pending")) return "text-yellow-700 font-semibold";
    return "text-gray-700";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
      {/* FILTER ROW */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search..."
          className="border p-2 rounded w-1/3"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <input
          placeholder="Customer"
          className="border p-2 rounded"
          value={customer}
          onChange={(e) => {
            setCustomer(e.target.value);
            setPage(1);
          }}
        />

        <input
          placeholder="Vendor"
          className="border p-2 rounded"
          value={vendor}
          onChange={(e) => {
            setVendor(e.target.value);
            setPage(1);
          }}
        />

        <input
          placeholder="Status"
          className="border p-2 rounded"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* TABLE */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 border-b font-semibold text-sm">
          <tr>
            <th className="p-2 w-40">RFQ</th>
            <th className="p-2">Customer</th>
            <th className="p-2 w-32">Value</th>
            <th className="p-2 w-40">Status</th>
          </tr>
        </thead>

        <tbody>
          {loading &&
            [...Array(8)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="p-2"><div className="h-4 bg-gray-200 rounded" /></td>
                <td className="p-2"><div className="h-4 bg-gray-200 rounded" /></td>
                <td className="p-2"><div className="h-4 bg-gray-200 rounded" /></td>
                <td className="p-2"><div className="h-4 bg-gray-200 rounded" /></td>
              </tr>
            ))}

          {!loading && data.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-500">
                No matching RFQs found.
              </td>
            </tr>
          )}

          {!loading &&
            data.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => setDrawerRow(row)}
                className="border-b hover:bg-gray-100 cursor-pointer"
              >
                <td className="p-2">{row["RFQ NO"]}</td>
                <td className="p-2">{row["CUSTOMER NAME"]}</td>
                <td className="p-2">{row["VEPL OFFER VALUE"] || "-"}</td>
                <td className={`p-2 ${getStatusColor(row["CURRENT STATUS"])}`}>
                  {row["CURRENT STATUS"] || "-"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex items-center gap-4 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* DRAWER */}
      {drawerRow && (
        <RFQDrawer row={drawerRow} onClose={() => setDrawerRow(null)} />
      )}
    </div>
  );
}
