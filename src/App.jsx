import { Routes, Route } from "react-router-dom";
import AuditPage from "./pages/AuditPage";
import RFQDashboard from "./pages/RFQDashboard";
import RFQPage from "./pages/RFQPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RFQPage />} />
      <Route path="/dashboard" element={<RFQDashboard />} />
      <Route path="/audit" element={<AuditPage />} />
    </Routes>
  );
}
