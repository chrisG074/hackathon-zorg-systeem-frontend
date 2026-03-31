import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import ReportTypeSelection from './pages/nieuwe-melding';
import VoiceConversation from './pages/voiceConversation';
import Overzicht from './pages/Overzicht';
// Wrapper component om routes te beveiligen
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors /> 
      
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/conversatie/:type" element={<VoiceConversation />} />
          
          {/* Beveiligde Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/nieuwe-melding" 
            element={
              <ProtectedRoute>
                <ReportTypeSelection />
              </ProtectedRoute>
            } 
          />
          {/* NIEUWE OVERZICHT ROUTE */}
          <Route 
            path="/overzicht" 
            element={
              <ProtectedRoute>
                <Overzicht />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}