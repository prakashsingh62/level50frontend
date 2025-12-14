const BASE_URL = "https://level50-backend-final.vercel.app";

export async function fetchAuditReport() {
  const res = await fetch(`${BASE_URL}/api/audit/report`);
  if (!res.ok) {
    throw new Error("Failed to fetch audit report");
  }
  return res.json();
}
