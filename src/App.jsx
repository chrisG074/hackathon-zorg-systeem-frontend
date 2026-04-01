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
import ReviewReport from './pages/reviewReport';

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
          
          {/* Standaard beveiligde pagina's */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nieuwe-melding" element={<ReportTypeSelection />} />
          <Route path="/overzicht" element={<Overzicht />} />
          <Route path="/conversatie/:type" element={<VoiceConversation />} />
          <Route path="/review" element={<ReviewReport />} />

          {/* Admin Route (Extra check voor adminOnly binnen de layout) */}
          <Route 
            path="/admin-overzicht" 
            element={
              <ProtectedRoute adminOnly={true}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Admin Paneel</h1>
                  <p>Alleen toegankelijk voor beheerders.</p>
                </div>
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}