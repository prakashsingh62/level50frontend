const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://level50-backend-final.onrender.com";

/**
 * Fetch RFQs (SAFE)
 * - Does NOT send empty params
 * - Backend-compatible
 */
export async function fetchRFQs(params = {}, signal) {
  const qs = new URLSearchParams();

  if (params.last_n_days) qs.append("last_n_days", params.last_n_days);
  if (params.page) qs.append("page", params.page);
  if (params.page_size) qs.append("page_size", params.page_size);  // ✅ FIX: page_size

  // 🚨 CRITICAL FIX
  if (params.status && params.status.trim() !== "") {  // ✅ FIX: trim()
    qs.append("status", params.status);  // ✅ FIX: qs.append
  }

  const url = `${API_BASE}/rfqs/filter1?${qs.toString()}`;  // ✅ MUST BE /filter1

  console.log("RFQ FETCH →", url);

  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(`RFQ fetch failed: ${res.status}`);
  }

  return res.json();
}
