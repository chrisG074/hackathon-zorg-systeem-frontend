import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

import Register from './pages/Register';
import Login from './pages/Login';
import ReportTypeSelection from './pages/nieuwe-melding';

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Standaard doorsturen naar dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Openbare routes (waar je bij mag zonder in te loggen) */}
          <Route path="/register" element={<Register />} />
          
          {/* Haal deze uit de comments zodra we Login.jsx hebben gemaakt */}
          {/* <Route path="/login" element={<Login />} /> */}

          {/* Besloten routes (hier voegen we later een beveiliging aan toe) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/nieuwe-melding" element={<ReportTypeSelection />} />
        </Routes>
      </div>
    </Router>
  );
}