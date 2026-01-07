import { useEffect, useState } from "react";
import { fetchRFQs } from "../api/rfqs";

export default function useRFQs({
  lastNDays = 10000,
  status = "",
  page = 1,
  pageSize = 50,
} = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔥 useRFQs called with:", { lastNDays, status, page, pageSize });

    async function load() {
      try {
        const data = await fetchRFQs({
          last_n_days: lastNDays,
          status,
          page,
          page_size: pageSize,
        });

        console.log("🔥 fetchRFQs returned:", data);
        console.log("🔥 Rows length:", data.rows?.length);
        
        // FORCE SET DATA (even if empty)
        setRows(data.rows || []);
        
        // DEBUG: Alert if data exists
        if (data.rows && data.rows.length > 0) {
          console.log("✅ DATA READY FOR TABLE");
          // Temporary alert
          setTimeout(() => {
            alert(`✅ ${data.rows.length} RFQs loaded in hook!\nCheck table now.`);
          }, 500);
        }
        
      } catch (e) {
        console.error("❌ Error in useRFQs:", e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [lastNDays, status, page, pageSize]);

  return { 
    rows, 
    meta: { total: rows.length }, 
    summary: {}, 
    loading, 
    error: null 
  };
}
