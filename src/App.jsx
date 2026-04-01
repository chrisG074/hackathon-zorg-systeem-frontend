import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner'; 

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import ReportTypeSelection from './pages/nieuwe-melding';
import VoiceConversation from './pages/voiceConversation';
import Overzicht from './pages/Overzicht';
import AdminPanel from './pages/AdminPanel'; // <-- Nieuwe import voor het Admin Paneel

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors /> 

      <Routes>
        {/* === Publieke Routes === */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* === Beveiligde Routes (Met globale Layout/Navbar) === */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          
          {/* Standaard beveiligde pagina's (Voor iedereen) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nieuwe-melding" element={<ReportTypeSelection />} />
          <Route path="/conversatie/:type" element={<VoiceConversation />} />
          
          {/* Admin Routes (Extra check voor adminOnly) */}
          <Route 
            path="/overzicht" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Overzicht />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin-paneel" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}