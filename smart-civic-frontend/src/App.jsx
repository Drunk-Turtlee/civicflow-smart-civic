// -----------------------------------------------------------------------------
// App.jsx — Application routes
// -----------------------------------------------------------------------------
// Keep this file focused on routing.
// Pages contain screen-level UI; components contain reusable UI.
//
// IMPORTANT:
// The routes below are frontend routes only. They are NOT FastAPI endpoints.
// React Router decides which screen is displayed in the browser.
// -----------------------------------------------------------------------------

import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import CitizenDashboard from "./pages/CitizenDashboard";
import ReportComplaint from "./pages/ReportComplaint";
import ComplaintsPage from "./pages/ComplaintsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/citizen" replace />} />
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/citizen/report" element={<ReportComplaint />} />
        <Route path="/citizen/complaints" element={<ComplaintsPage />} />
        <Route path="/citizen/settings" element={<SettingsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/complaints" element={<ComplaintsPage admin />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/citizen" replace />} />
      </Routes>
    </AppShell>
  );
}