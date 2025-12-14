import axios from "axios";

const API_BASE = "https://level50-backend-final.vercel.app";

export async function fetchAuditLogs() {
  const res = await axios.get(`${API_BASE}/audit/logs`);
  return res.data;
}
