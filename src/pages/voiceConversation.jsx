/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ConversationBubble } from '../components/ConversationBubble';
import { VoiceVisualizer } from '../components/VoiceVisualizer';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Keyboard,
  Send,
  Volume2,
  Sparkles
} from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { toast } from 'sonner';
import { useSpeech } from '../hooks/useSpeech';

export default function VoiceConversation() {
  const navigate = useNavigate();
  const { type } = useParams();
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [useKeyboard, setUseKeyboard] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [formData, setFormData] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState('prompt');
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const hasSpokenIntroRef = useRef(false);
  const { speak, stop } = useSpeech();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5258';

  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        if (navigator.permissions) {
          const result = await navigator.permissions.query({ name: 'microphone' });
          setMicrophonePermission(result.state);
          result.onchange = () => setMicrophonePermission(result.state);
        }
      } catch {
        console.log('Permission API not supported');
      }
    };
    checkMicrophonePermission();
  }, []);

  useEffect(() => {
    if (microphonePermission === 'granted') initializeSpeechRecognition();
  }, [microphonePermission]);

  const sendToAi = async (userMessage) => {
    try {
      setAiLoading(true);
      let typeContext = `TYPE: ${type.toUpperCase()} melding.`;
      const history = messages
        .filter((_, index) => index > 0)
        .map(m => `${m.role === 'user' ? 'Gebruiker' : 'Assistent'}: ${m.content}`)
        .join('\n');

      const fullPrompt = `${typeContext}\nGESPREK:\n${history}\nGebruiker: ${userMessage}\n\nINSTRUCTIE: Scan het gesprek op antwoorden. Stel GEEN vragen over zaken die al genoemd zijn.`;

      const response = await fetch(`${API_URL}/api/Ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, type, context: formData })
      });

      if (!response.ok) throw new Error(`API status ${response.status}`);
      const data = await response.json();

      let aiReply = '';
      if (data.candidates && data.candidates[0]?.content?.parts) {
        const parts = data.candidates[0].content.parts;
        const textPart = parts.find(p => p.text && !p.thought);
        aiReply = textPart ? textPart.text : "Geen antwoord gevonden.";
      } else {
        aiReply = data.message || "Fout bij verwerken AI antwoord.";
      }
      return aiReply;
    } catch (error) {
      toast.error('Fout bij AI communicatie.');
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicrophonePermission('granted');
      return true;
    } catch (error) {
      setMicrophonePermission('denied');
      toast.error('Microfoon toegang geweigerd.');
      return false;
    }
  };

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    if (recognitionRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'nl-NL';
    recognitionRef.current.continuous = false;
    recognitionRef.current.onresult = (event) => {
      setCurrentInput(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onend = () => setIsListening(false);
  };

  useEffect(() => {
    if (messages.length === 0) {
      const introMessage = `Hallo! Ik ben SIMO. Ik help je met de ${type} melding. Wat is er precies gebeurd?`;
      setMessages([{ role: 'assistant', content: introMessage }]);
      if (!hasSpokenIntroRef.current) {
        hasSpokenIntroRef.current = true;
        setTimeout(() => speak(introMessage, () => setIsSpeaking(false)), 500);
      }
    }
    return () => {
      recognitionRef.current?.abort();
      stop();
    };
  }, [type]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = async () => {
    if (microphonePermission !== 'granted') {
      const granted = await requestMicrophoneAccess();
      if (!granted) return;
    }
    if (isSpeaking) stop();
    setCurrentInput('');
    setIsListening(true);
    setTimeout(() => recognitionRef.current?.start(), 50);
  };

  const handleSubmitAnswer = async () => {
    if (!currentInput.trim() || aiLoading) return;
    const userInput = currentInput;
    setCurrentInput('');
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    
    const aiResponse = await sendToAi(userInput);
    if (aiResponse) {
      if (aiResponse.includes('[COMPLEET]')) {
        try {
          const aiData = JSON.parse(aiResponse.split('[COMPLEET]')[1].trim());
          navigate('/review', { state: { formData: aiData, type } });
          return;
        } catch (e) { console.error(e); }
      }
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      speak(aiResponse, () => setIsSpeaking(false));
    }
  };

  const displayType = type?.toUpperCase();

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-4xl mx-auto w-full shadow-2xl overflow-hidden border-x border-slate-100">
      {/* Verbeterde Header */}
      <div className="bg-white/80 backdrop-blur-md border-b p-4 flex items-center gap-4 sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={() => navigate('/nieuwe-melding')} className="rounded-full">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{displayType} Melding</h2>
            <div className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">Live Assistent</div>
          </div>
          <p className="text-xs text-slate-500 font-medium">Simo luistert naar je verhaal</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const lastMsg = [...messages].reverse().find(m => m.role === 'assistant');
            if (lastMsg) speak(lastMsg.content);
          }}
          className="rounded-full border-slate-200"
        >
          <Volume2 className="h-4 w-4 text-slate-600" />
        </Button>
      </div>

      {/* Berichtenlijst met meer ruimte */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
        <div className="max-w-2xl mx-auto space-y-2">
          {messages.map((msg, index) => (
            <ConversationBubble key={index} message={msg} />
          ))}
          
          <AnimatePresence>
            {aiLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 text-slate-400 font-bold text-sm ml-10 py-4"
              >
                <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                Simo denkt na...
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Moderne Floating Input Area */}
      <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="max-w-2xl mx-auto space-y-6">
          
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-4"
              >
                <VoiceVisualizer isListening={true} />
                <p className="text-sm font-bold text-primary animate-pulse tracking-wide uppercase">Spreken...</p>
                {currentInput && (
                  <div className="w-full p-4 bg-blue-50 rounded-2xl border border-blue-100 text-slate-700 italic text-center">
                    "{currentInput}"
                  </div>
                )}
              </motion.div>
            ) : useKeyboard ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2"
              >
                <Input
                  autoFocus
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Typ je bericht..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                  className="h-14 rounded-2xl border-slate-200 text-base px-6 shadow-sm focus:ring-primary/20"
                />
                <Button 
                  onClick={handleSubmitAnswer} 
                  disabled={!currentInput.trim() || aiLoading}
                  className="h-14 w-14 rounded-2xl shadow-lg shadow-primary/20 shrink-0"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <button
                  onClick={startListening}
                  disabled={aiLoading}
                  className="group relative flex items-center justify-center w-24 h-24 bg-primary rounded-full shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 group-hover:opacity-40" />
                  <Mic className="h-10 w-10 text-white relative z-10" />
                </button>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Tik om te praten</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsListening(false);
                setUseKeyboard(!useKeyboard);
                setCurrentInput('');
              }}
              className="text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest"
            >
              {useKeyboard ? <><Mic className="h-3 w-3 mr-2" /> Gebruik Spraak</> : <><Keyboard className="h-3 w-3 mr-2" /> Liever Typen</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}