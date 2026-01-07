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
    console.log("🚀 useRFQs FIRED with params:", { lastNDays, status, page, pageSize });

    async function load() {
      setLoading(true);
      setError(null);
      setRows([]); // Clear previous data
      setSummary({});
      setMeta({});

      try {
        const data = await fetchRFQs({
          last_n_days: lastNDays,
          status,
          page,
          page_size: pageSize,
        });

        console.log("✅ fetchRFQs RETURNED:", {
          rowsCount: data.rows?.length || 0,
          rowsSample: data.rows?.slice(0, 2),
          summary: data.summary,
          meta: data.meta
        });
        
        // ✅ Now data.rows will exist
        setRows(data.rows || []);
        setSummary(data.summary || {});
        setMeta(data.meta || {});
        
        // Debug log
        if (data.rows && data.rows.length > 0) {
          console.log(`🎉 SUCCESS: Loaded ${data.rows.length} RFQs`);
          console.log("📋 First row fields:", Object.keys(data.rows[0]));
          console.log("📋 First row values:", data.rows[0]);
        } else {
          console.log("⚠️ WARNING: No rows in response");
          console.log("Full data object:", data);
        }
      } catch (e) {
        console.error("❌ RFQ fetch failed", e);
        setError(e.message || "Failed to load RFQs");
        setRows([]);
        setSummary({});
        setMeta({});
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [lastNDays, status, page, pageSize]);

  return { 
    rows, 
    summary, 
    meta, 
    loading, 
    error 
  };
}
