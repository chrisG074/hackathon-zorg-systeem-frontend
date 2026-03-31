import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner'; // <-- De pop-up speler geïmporteerd!
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import ReportTypeSelection from './pages/nieuwe-melding';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      {/* Deze Toaster zorgt ervoor dat alle toast.success en toast.error werken */}
      <Toaster position="top-right" richColors /> 
      
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/nieuwe-melding" element={<ProtectedRoute><ReportTypeSelection /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}