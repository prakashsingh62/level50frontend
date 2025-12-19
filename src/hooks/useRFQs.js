import { useEffect, useState } from "react";
import { fetchRFQs } from "../api/rfqs";

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

  useEffect(() => {
    console.log("useRFQs fired");

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchRFQs({
          last_n_days: lastNDays,
          status,
          page,
          page_size: pageSize,
        });

        setRows(Array.isArray(data.rows) ? data.rows : []);
        setSummary(data.summary || {});
        setMeta(data.meta || {});
      } catch (e) {
        console.error("RFQ fetch failed", e);
        setError(e.message || "Failed to load RFQs");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [lastNDays, status, page, pageSize]);

  return { rows, summary, meta, loading, error };
}
