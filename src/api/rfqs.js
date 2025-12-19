const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://level50-backend-final-production-012c.up.railway.app";

export async function fetchRFQs({
  last_n_days = 10000,
  status = "",
  search = "",
  page = 1,
  page_size = 50,
}) {
  const params = new URLSearchParams({
    last_n_days,
    page,
    page_size,
  });

  if (status) params.append("status", status);
  if (search) params.append("search", search);

  const res = await fetch(`${API_BASE}/rfqs/filter?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch RFQs");
  }
  return res.json();
}
