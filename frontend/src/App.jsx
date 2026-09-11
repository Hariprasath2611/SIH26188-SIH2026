import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewScreening from './pages/NewScreening';
import ScreeningHistory from './pages/ScreeningHistory';
import CaseDetails from './pages/CaseDetails';
import BlockchainAudit from './pages/BlockchainAudit';
import Profile from './pages/Profile';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('idshield_theme') || 'light';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('idshield_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('idshield_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('idshield_token');
    localStorage.removeItem('idshield_user');
    setUser(null);
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} theme={theme} onToggleTheme={toggleTheme} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar user={user} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-screening" element={<NewScreening />} />
            <Route path="/history" element={<ScreeningHistory />} />
            <Route path="/case/:caseId" element={<CaseDetails />} />
            <Route path="/blockchain-audit" element={<BlockchainAudit />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
