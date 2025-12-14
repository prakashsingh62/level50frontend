import { useEffect, useState } from "react";
import { fetchAuditReport } from "../api";

export default function AuditPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAuditReport()
      .then(setData)
      .catch(() => setError("Failed to load audit logs"));
  }, []);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Audit Report</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
