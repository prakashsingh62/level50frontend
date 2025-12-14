import axios from "axios";

const BASE_URL = "https://level50-backend-final.vercel.app";

export async function fetchAuditReport() {
  const res = await axios.get(`${BASE_URL}/api/audit/report`);
  return res.data;
}
