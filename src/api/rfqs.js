// src/api/rfqs.js

// 🔒 HARD FAIL-SAFE API BASE
// - Uses Vercel env if present
// - Falls back to Railway backend (production-safe)
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://level50-backend-final-production-012c.up.railway.app";

/**
 * fetchRFQs
 * Calls backend /rfqs/filter endpoint
 *
 * @param {Object} params
 * @param {AbortSignal} signal
 * @returns {Promise<Object>}
 */
export async function fetchRFQs(params = {}, signal) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE}/rfqs/filter?${query}`;

  // 🔍 DEBUG (you WILL see this in console)
  console.log("RFQ FETCH →", url);

  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(`RFQ API failed: ${res.status}`);
  }

  return res.json();
}
