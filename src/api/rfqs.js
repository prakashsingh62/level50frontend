const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://level50-backend-final.onrender.com";

export async function fetchRFQs(params = {}, signal) {
  const qs = new URLSearchParams();
  if (params.last_n_days) qs.append("last_n_days", params.last_n_days);
  if (params.page) qs.append("page", params.page);
  if (params.page_size) qs.append("page_size", params.page_size);
  if (params.status && params.status.trim() !== "") {
    qs.append("status", params.status);
  }

  const url = `${API_BASE}/rfqs/filter1?${qs.toString()}`;
  console.log("🔥 RFQ FETCH:", url);

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const result = await res.json();
  console.log("🔥 BACKEND RAW:", result);

  // SIMPLE TRANSFORM
  const rows = (result.data || []).map(item => ({
    'SR.NO': item.sr_no,
    'CUSTOMER NAME': item.customer_name,
    'LOCATION': item.location,
    'RFQ NO': item.rfq_no,
    'RFQ DATE': item.rfq_date,
    'UID NO': item.uid_no,
    'PRODUCT': item.product,
    'FINAL STATUS': item.status || 'UNKNOWN'
  }));

  console.log("🔥 TRANSFORMED ROWS:", rows);

  return {
    rows: rows,  // ✅ Yeh important hai
    summary: {},
    meta: {
      total: result.count || 0,
      page: params.page || 1,
      pageSize: params.page_size || 50
    }
  };
}
