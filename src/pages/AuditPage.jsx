import { useEffect, useState } from "react";
import { fetchAuditReport } from "../api";

export default function AuditPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAuditReport()
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Failed to load audit logs");
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>Loading audit logs...</div>;
  }

  return (
    <div>
      <h1>Audit Report</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
