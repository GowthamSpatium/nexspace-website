import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import VisitorManagement from "./pages/modules/VisitorManagement";
import MeetingRoomBooking from "./pages/modules/MeetingRoomBooking";
import HelpdeskTicketing from "./pages/modules/HelpdeskTicketing";
import FacilityManagement from "./pages/modules/FacilityManagement";
import RoleUserManagement from "./pages/modules/RoleUserManagement";
import AnalyticsInsights from "./pages/modules/AnalyticsInsights";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import EULA from "./pages/EULA";
import PrivacyAndDataProtection from "./pages/PrivacyAndDataProtection";

const LEGAL_PATHS = ["/privacy-policy", "/terms-of-service", "/eula", "/privacy-data-protection"];

const Layout = () => {
  const location = useLocation();
  const isLegal = LEGAL_PATHS.includes(location.pathname);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--text)", transition: "background 0.25s ease, color 0.25s ease" }}>
      {!isLegal && <Nav />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visitor-management" element={<VisitorManagement />} />
          <Route path="/meeting-room-booking" element={<MeetingRoomBooking />} />
          <Route path="/helpdesk-ticketing" element={<HelpdeskTicketing />} />
          <Route path="/facility-management" element={<FacilityManagement />} />
          <Route path="/role-user-management" element={<RoleUserManagement />} />
          <Route path="/analytics-insights" element={<AnalyticsInsights />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/eula" element={<EULA />} />
          <Route path="/privacy-data-protection" element={<PrivacyAndDataProtection />} />
        </Routes>
      </main>
      {!isLegal && <Footer />}
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <Router>
      <Layout />
    </Router>
  </ThemeProvider>
);

export default App;
