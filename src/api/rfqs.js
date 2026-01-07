const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://level50-backend-final.onrender.com";

/**
 * Fetch RFQs (SAFE)
 * - Does NOT send empty params
 * - Backend-compatible
 * - ✅ FIXED: Transforms backend response to frontend format
 */
export async function fetchRFQs(params = {}, signal) {
  const qs = new URLSearchParams();

  if (params.last_n_days) qs.append("last_n_days", params.last_n_days);
  if (params.page) qs.append("page", params.page);
  if (params.page_size) qs.append("page_size", params.page_size);

  if (params.status && params.status.trim() !== "") {
    qs.append("status", params.status);
  }

  const url = `${API_BASE}/rfqs/filter1?${qs.toString()}`;
  console.log("RFQ FETCH →", url);

  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(`RFQ fetch failed: ${res.status}`);
  }

  const result = await res.json();
  console.log("RAW BACKEND RESPONSE →", result);

  // ✅ CRITICAL FIX: Transform backend response to what frontend expects
  if (result.status === 'success') {
    // Backend has: {status: "success", data: [...], message: "...", count: 5}
    // Frontend expects: {rows: [...], summary: {...}, meta: {...}}
    
    // Transform data array to match frontend field names
    const transformedRows = (result.data || []).map(item => ({
      // Map backend snake_case to frontend UPPERCASE
      'SR.NO': item.sr_no,
      'CUSTOMER NAME': item.customer_name,
      'LOCATION': item.location,
      'RFQ NO': item.rfq_no,
      'RFQ DATE': item.rfq_date,
      'UID NO': item.uid_no,
      'PRODUCT': item.product,
      'FINAL STATUS': item.status || 'UNKNOWN',
      // Keep original for debugging
      _original: item
    }));

    console.log("TRANSFORMED ROWS →", transformedRows);

    // Create summary from status counts
    const statusSummary = {};
    (result.data || []).forEach(item => {
      const status = item.status || 'UNKNOWN';
      statusSummary[status] = (statusSummary[status] || 0) + 1;
    });

    console.log("STATUS SUMMARY →", statusSummary);

    return {
      rows: transformedRows,  // ✅ Frontend expects 'rows'
      summary: statusSummary, // ✅ Status summary
      meta: {
        total: result.count || 0,
        page: params.page || 1,
        pageSize: params.page_size || 50,
        totalPages: Math.ceil((result.count || 0) / (params.page_size || 50))
      },
      // Optional: Keep original response
      _raw: result
    };
  } else {
    // If backend error
    console.log("BACKEND ERROR →", result);
    return {
      rows: [],
      summary: {},
      meta: { total: 0, page: 1, pageSize: 50, totalPages: 0 },
      error: result.message || 'Unknown error'
    };
  }
}
