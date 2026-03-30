import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReportTypeSelection from './pages/nieuwe-melding';

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nieuwe-melding" element={<ReportTypeSelection />} />
        </Routes>
      </div>
    </Router>
  );
}