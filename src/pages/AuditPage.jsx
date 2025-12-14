import { useEffect, useMemo, useState } from "react";
import { getAuditReport } from "../api";

const PRESET_KEY = "audit_presets_v2";

/* ---------- helpers ---------- */
function parseTimestamp(ts) {
  if (!ts || typeof ts !== "string") return null;
  const clean = ts.replace(" IST", "");
  const [date, time] = clean.split(" ");
  if (!date) return null;
  const [d, m, y] = date.split("/").map(Number);
  if (!d || !m || !y) return null;
  let hh = 0, mm = 0, ss = 0;
  if (time) [hh, mm, ss] = time.split(":").map(Number);
  return new Date(y, m - 1, d, hh || 0, mm || 0, ss || 0);
}

function todayRange() {
  const t = new Date();
  const d = t.toISOString().slice(0, 10);
  return { fromDate: d, toDate: d };
}

function last7Range() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 6);
  return {
    fromDate: from.toISOString().slice(0, 10),
    toDate: to.toISOString().slice(0, 10),
  };
}

function csvEscape(v) {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/* ---------- page ---------- */
export default function AuditPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // presets
  const [presets, setPresets] = useState({});
  const [activePreset, setActivePreset] = useState(null);

  /* ---------- load ---------- */
  useEffect(() => {
    getAuditReport()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  /* ---------- init presets ---------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(PRESET_KEY) || "{}");
    const defaults = {
      Today: { search: "", ...todayRange() },
      "Last 7 Days": { search: "", ...last7Range() },
      "Errors Only": { search: "error", fromDate: "", toDate: "" },
    };
    setPresets({ ...defaults, ...saved });
  }, []);

  /* ---------- persist presets ---------- */
  useEffect(() => {
    localStorage.setItem(PRESET_KEY, JSON.stringify(presets));
  }, [presets]);

  /* ---------- filtering ---------- */
  const filteredRows = useMemo(() => {
    if (!data?.rows) return [];

    const q = search.toLowerCase();
    const from = fromDate ? new Date(fromDate + "T00:00:00") : null;
    const to = toDate ? new Date(toDate + "T23:59:59") : null;

    return data.rows.filter((r) => {
      const text = `${r.timestamp} ${r.run_id} ${r.status} ${r.error_type} ${r.remarks}`.toLowerCase();
      if (q && !text.includes(q)) return false;

      if (from || to) {
        const dt = parseTimestamp(r.timestamp);
        if (!dt) return false;
        if (from && dt < from) return false;
        if (to && dt > to) return false;
      }
      return true;
    });
  }, [data, search, fromDate, toDate]);

  /* ---------- presets ---------- */
  const savePreset = () => {
    const name = prompt("Preset name?");
    if (!name) return;
    if (presets[name] && !confirm(`Preset "${name}" exists. Overwrite?`)) return;
    setPresets((p) => ({ ...p, [name]: { search, fromDate, toDate } }));
    setActivePreset(name);
  };

  const applyPreset = (name) => {
    const p = presets[name];
    if (!p) return;
    setSearch(p.search || "");
    setFromDate(p.fromDate || "");
    setToDate(p.toDate || "");
    setActivePreset(name);
  };

  const deletePreset = (name) => {
    if (!confirm(`Delete preset "${name}"?`)) return;
    setPresets((p) => {
      const c = { ...p };
      delete c[name];
      return c;
    });
    if (activePreset === name) setActivePreset(null);
  };

  /* ---------- EXPORT (Phase-4.4) ---------- */
  const exportCSV = () => {
    const headers = ["Timestamp", "Run ID", "Status", "Error Type", "Remarks"];
    const rows = filteredRows.map((r) => [
      r.timestamp,
      r.run_id,
      r.status,
      r.error_type,
      r.remarks,
    ]);

    const csv =
      headers.join(",") +
      "\n" +
      rows.map((row) => row.map(csvEscape).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- render ---------- */
  return (
    <div style={{ padding: 20 }}>
      <h1>Audit Report</h1>
      <p style={{ color: "#666" }}>🔒 Safe Mode — Read only.</p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Global search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <button onClick={savePreset}>Save Preset</button>
        <button onClick={exportCSV}>Export CSV</button>
      </div>

      {/* Presets */}
      <div style={{ marginBottom: 12 }}>
        {Object.keys(presets).map((name) => (
          <span key={name} style={{ marginRight: 8 }}>
            <button
              onClick={() => applyPreset(name)}
              style={{
                fontWeight: activePreset === name ? "bold" : "normal",
                borderBottom: activePreset === name ? "2px solid #000" : "none",
              }}
            >
              {name}
            </button>
            <button onClick={() => deletePreset(name)}>✕</button>
          </span>
        ))}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {!data && !error && <p>Loading…</p>}

      {data && (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Run ID</th>
              <th>Status</th>
              <th>Error Type</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan="5" align="center">No records</td>
              </tr>
            )}
            {filteredRows.map((r, i) => (
              <tr key={i}>
                <td>{r.timestamp}</td>
                <td>{r.run_id || "-"}</td>
                <td>{r.status}</td>
                <td>{r.error_type || "-"}</td>
                <td>{r.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
