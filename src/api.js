const API_BASE =
  "https://level50-backend-final-production-012c.up.railway.app";

export async function fetchAuditReport(limit = 50) {
  const res = await fetch(`${API_BASE}/api/audit/report?limit=${limit}`);
  if (!res.ok) throw new Error("API failed");
  const data = await res.json();
  return data.rows || [];
}
