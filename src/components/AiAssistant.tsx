import React, { useState, useEffect } from 'react';

// Typen voor de browser spraakherkenning
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const AiAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Helaas, je browser ondersteunt geen spraakherkenning. Probeer Chrome of Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL'; // Nederlands instellen
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      askAi(text); // Stuur de tekst direct naar de AI
    };

    recognition.onerror = (event: any) => {
      console.error("Spraakfout:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const askAi = async (question: string) => {
    setLoading(true);
    try {
      const response = await fetch('https://localhost:7113/api/ai/chat', { // Let op: check je eigen poort!
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question })
      });

      const data = await response.json();
      
      // LM Studio geeft een OpenAI-stijl JSON terug. We halen de content eruit:
      const resultJson = JSON.parse(data); 
      const reply = resultJson.choices[0].message.content;
      
      setAiResponse(reply);
    } catch (error) {
      setAiResponse("Fout bij het ophalen van AI antwoord. Staat LM Studio aan?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white shadow-2xl rounded-2xl border w-80 z-50">
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
        🤖 Zorg Assistent
      </h3>
      
      <div className="mb-4 h-32 overflow-y-auto text-sm border-b pb-2">
        {transcript && <p className="text-blue-600 mb-2"><strong>Jij:</strong> {transcript}</p>}
        {loading ? <p className="animate-pulse">AI denkt na...</p> : 
         aiResponse && <p className="text-gray-800"><strong>AI:</strong> {aiResponse}</p>}
      </div>

      <button
        onClick={startListening}
        disabled={isListening || loading}
        className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
          isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isListening ? 'Aan het luisteren...' : '🎤 Klik en spreek'}
      </button>
    </div>
  );
};