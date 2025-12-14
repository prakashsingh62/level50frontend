import { Routes, Route } from "react-router-dom";
import AuditPage from "./pages/AuditPage";
import RFQDashboard from "./pages/RFQDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RFQDashboard />} />
      <Route path="/audit" element={<AuditPage />} />
    </Routes>
  );
}
