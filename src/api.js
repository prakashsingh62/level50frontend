const BASE_URL = "https://level50-backend-final.vercel.app";

export async function getAuditReport() {
  const res = await fetch(`${BASE_URL}/api/audit/report`);
  if (!res.ok) {
    throw new Error("API error");
  }
  return res.json();
}
