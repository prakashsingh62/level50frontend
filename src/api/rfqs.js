const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch RFQs with filters
 */
export async function fetchRFQs(params = {}) {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${API_BASE}/rfqs/filter?${query}`);

  if (!res.ok) {
    throw new Error("RFQ API failed");
  }

  return res.json();
}
