import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register'; // Importeer de nieuwe registratiepagina

// Zodra we de Login pagina maken, kun je deze uit de comments halen:
// import Login from './pages/Login'; 

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
        </Routes>
      </div>
    </Router>
  );
}