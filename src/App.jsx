import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import AppPage from './pages/AppPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';

const BETA_CODE = 'CRAFT2026';

export default function App() {
  const [isBeta, setIsBeta] = useState(() => {
    try { return sessionStorage.getItem('pc_beta') === 'true'; }
    catch { return false; }
  });

  const activateBeta = (code) => {
    if (code.trim().toUpperCase() === BETA_CODE) {
      sessionStorage.setItem('pc_beta', 'true');
      setIsBeta(true);
      return true;
    }
    return false;
  };

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Nav isBeta={isBeta} />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/"         element={<AppPage      isBeta={isBeta} activateBeta={activateBeta} />} />
            <Route path="/pricing"   element={<PricingPage   isBeta={isBeta} />} />
            <Route path="/feedback"  element={<FeedbackPage />} />
            <Route path="/dashboard" element={<DashboardPage isBeta={isBeta} />} />
            <Route path="/roadmap"   element={<RoadmapPage />} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
