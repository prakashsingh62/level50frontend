const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://level50-backend-final-production-012c.up.railway.app";

export async function fetchRFQs({
  status = "",
  page = 1,
  page_size = 50,
  last_n_days = 10000,
} = {}) {
  const params = new URLSearchParams();

  if (status) params.append("status", status);
  params.append("page", page);
  params.append("page_size", page_size);
  params.append("last_n_days", last_n_days);

  const res = await fetch(`${API_BASE}/rfqs/filter?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`RFQ fetch failed: ${res.status}`);
  }

  return res.json();
}
