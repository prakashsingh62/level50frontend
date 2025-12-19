import { Routes, Route } from "react-router-dom";
import RFQPage from "./pages/RFQPage";
import AuditPage from "./pages/AuditPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RFQPage />} />
      <Route path="/audit" element={<AuditPage />} />
    </Routes>
  );
}
