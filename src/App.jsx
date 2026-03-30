import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner'; // <-- De pop-up speler geïmporteerd!
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';

export default function App() {
  return (
    <Router>
      {/* Deze Toaster zorgt ervoor dat alle toast.success en toast.error werken */}
      <Toaster position="top-right" richColors /> 
      
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}