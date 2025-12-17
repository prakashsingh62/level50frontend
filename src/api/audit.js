const BASE = import.meta.env.VITE_API_BASE_URL;

export async function getAuditReport({ page = 1, limit = 25 } = {}) {
  const res = await fetch(
    `${BASE}/api/audit/report?page=${page}&limit=${limit}`
  );
  if (!res.ok) throw new Error("Audit fetch failed");
  return res.json();
}
