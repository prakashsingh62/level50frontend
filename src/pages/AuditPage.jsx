import { useEffect, useMemo, useState } from "react";
import { getAuditReport } from "../api";

const PRESET_KEY = "audit_presets_v1";

export default function AuditPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // presets
  const [presets, setPresets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PRESET_KEY)) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    getAuditReport()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  // persist presets
  useEffect(() => {
    localStorage.setItem(PRESET_KEY, JSON.stringify(presets));
  }, [presets]);

  const filteredRows = useMemo(() => {
    if (!data?.rows) return [];

    return data.rows.filter((r) => {
      const text = `${r.timestamp} ${r.run_id} ${r.status} ${r.error_type} ${r.remarks}`.toLowerCase();
      if (search && !text.includes(search.toLowerCase())) return false;

      if (fromDate && r.timestamp < fromDate) return false;
      if (toDate && r.timestamp > toDate) return false;

      return true;
    });
  }, [data, search, fromDate, toDate]);

  const savePreset = () => {
    const name = prompt("Preset name?");
    if (!name) return;

    setPresets((p) => ({
      ...p,
      [name]: { search, fromDate, toDate }
    }));
  };

  const applyPreset = (p) => {
    setSearch(p.search || "");
    setFromDate(p.fromDate || "");
    setToDate(p.toDate || "");
  };

  const deletePreset = (name) => {
    if (!confirm(`Delete preset "${name}"?`)) return;
    setPresets((p) => {
      const copy = { ...p };
      delete copy[name];
      return copy;
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Audit Report</h1>
      <p style={{ color: "#666" }}>
        🔒 Safe Mode — Read only. Table UI in progress.
      </p>

      {/* FILTER BAR */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Global search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <button onClick={savePreset}>Save Preset</button>
      </div>

      {/* PRESETS */}
      {Object.keys(presets).length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {Object.entries(presets).map(([name, p]) => (
            <span key={name} style={{ marginRight: 8 }}>
              <button onClick={() => applyPreset(p)}>{name}</button>
              <button onClick={() => deletePreset(name)}>✕</button>
            </span>
          ))}
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {!data && !error && <p>Loading…</p>}

      {data && (
        <table border="1" cellPadding="8" cellSpacing="0" width="100%">
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
