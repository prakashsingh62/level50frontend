export async function getAuditReport() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/audit/report`);
  if (!res.ok) throw new Error("API error");
  return res.json();
}
