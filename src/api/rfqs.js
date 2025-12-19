const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://level50-backend-final-production-012c.up.railway.app";

export async function fetchRFQs(params = {}, signal) {
  const qs = new URLSearchParams(params).toString();
  const url = `${API_BASE}/rfqs/filter?${qs}`;

  const res = await fetch(url, { signal });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json();
}
