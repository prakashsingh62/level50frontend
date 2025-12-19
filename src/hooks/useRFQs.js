import { useEffect, useState, useCallback } from "react";
import { fetchRFQs } from "../api/rfqs";

/**
 * useRFQs
 * Data-only hook (NO JSX)
 */
export default function useRFQs({
  lastNDays = 10000,
  status = "",
  page = 1,
  pageSize = 50,
} = {}) {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRFQs = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchRFQs(
          {
            last_n_days: lastNDays,
            status,
            page,
            page_size: pageSize,
          },
          signal
        );

        setRows(Array.isArray(data.rows) ? data.rows : []);
        setSummary(data.summary || {});
        setMeta(data.meta || {});
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("useRFQs error:", err);
        setError(err.message || "Failed to load RFQs");
      } finally {
        setLoading(false);
      }
    },
    [lastNDays, status, page, pageSize]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadRFQs(controller.signal);
    return () => controller.abort();
  }, [loadRFQs]);

  return {
    rows,
    summary,
    meta,
    loading,
    error,
    reload: () => loadRFQs(),
  };
}
