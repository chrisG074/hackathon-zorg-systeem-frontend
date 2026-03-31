import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner'; 
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import ReportTypeSelection from './pages/nieuwe-melding';
import VoiceConversation from './pages/voiceConversation';
import Overzicht from './pages/Overzicht';
import ProtectedRoute from './components/ProtectedRoute'; // Gebruik nu het losse bestand

const AiAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error("Je browser ondersteunt geen spraakherkenning.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Ik luister... Spreek nu.");
    };

    recognition.onresult = async (event) => {
      const gesprokenTekst = event.results[0][0].transcript;
      setIsListening(false);
      
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        const start = activeElement.value;
        activeElement.value = start ? `${start} ${gesprokenTekst}` : gesprokenTekst;
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        toast.success("Tekst toegevoegd!");
      }

      await askAi(gesprokenTekst);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Microfoon fout.");
    };

    recognition.start();
  };

  const askAi = async (prompt) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5258/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });

      if (!response.ok) throw new Error("Backend onbereikbaar");

      const aiData = await response.json();
      const antwoord = aiData.choices[0].message.content;

      toast.info("AI Assistent:", {
        description: antwoord,
        duration: 10000,
      });

    } catch (error) {
      console.error(error);
      toast.error("AI verbinding mislukt. Check poort 5258.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999 }}>
      <button
        onClick={startListening}
        disabled={isListening || loading}
        style={{
          backgroundColor: isListening ? '#ef4444' : '#2563eb',
          color: 'white', padding: '15px', borderRadius: '50%', border: 'none',
          cursor: 'pointer', width: '60px', height: '60px', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}
      >
        {loading ? '⏳' : '🎤'}
      </button>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors /> 
      <AiAssistant />
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/conversatie/:type" element={<VoiceConversation />} />
          
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
          <Route 
            path="/overzicht" 
            element={
              <ProtectedRoute>
                <Overzicht />
              </ProtectedRoute>
            } 
          />
          {/* NIEUWE ADMIN ROUTE */}
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
        </Routes>
      </div>
    </Router>
  );
}