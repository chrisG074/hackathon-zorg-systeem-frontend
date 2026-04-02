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

          result.onchange = () => {
            setMicrophonePermission(result.state);
          };
        }
      } catch {
        console.log('Permission API not supported');
      }
    };

    checkMicrophonePermission();
  }, []);

  useEffect(() => {
    if (microphonePermission === 'granted') {
      initializeSpeechRecognition();
    }
  }, [microphonePermission]);

  const sendToAi = async (userMessage) => {
    try {
      setAiLoading(true);

      let typeContext = '';
      if (type === 'facilitair') typeContext = 'TYPE: Facilitair melding.';
      else if (type === 'mic') typeContext = 'TYPE: MIC (Melding Incident Cliënt).';
      else if (type === 'mim') typeContext = 'TYPE: MIM (Melding Incident Medewerker).';

      const history = messages
        .filter((_, index) => index > 0)
        .map(m => `${m.role === 'user' ? 'Gebruiker' : 'Assistent'}: ${m.content}`)
        .join('\n');

      const fullPrompt = `${typeContext}\nHieronder volgt het gesprek tot nu toe. Gebruik de informatie uit eerdere berichten om te bepalen wat je al weet.\n\nGESPREK:\n${history}\nGebruiker: ${userMessage}\n\nINSTRUCTIE: Scan het bovenstaande gesprek op antwoorden. Stel GEEN vragen over zaken die hierboven al zijn genoemd (zoals namen, tijden of locaties).`;

      const response = await fetch(`${API_URL}/api/Ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          type: type,
          context: formData
        })
      });

      if (!response.ok) throw new Error(`API responded with status ${response.status}`);

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
      console.error('Error calling AI:', error);
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
      toast.success('Microfoon toegang verleend!', {
        duration: 2000,
      });
      return true;
    } catch (error) {
      console.error('Microphone access denied:', error);
      setMicrophonePermission('denied');
      toast.error('Microfoon toegang geweigerd. Sta toegang toe in je browserinstellingen.', {
        duration: 5000,
      });
      return false;
    }
  };

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return;
    }

    if (recognitionRef.current) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'nl-NL';
    recognitionRef.current.continuous = false;
    // Let op: deze event handlers zorgen dat isListening op false gaat zodra er tekst is.
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCurrentInput(transcript);
      setIsListening(false);
      toast.success('Spraak herkend!', {
        duration: 1500,
      });
    };

    recognitionRef.current.onerror = (event) => {
      setIsListening(false);
      console.error('Speech recognition error:', event.error);

      let errorMessage = 'Spraakherkenning mislukt. Probeer opnieuw.';

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'Geen spraak gedetecteerd. Probeer opnieuw en spreek duidelijker.';
          toast.warning(errorMessage, { duration: 4000 });
          break;
        case 'audio-capture':
          errorMessage = 'Geen microfoon gevonden. Controleer je microfoon.';
          toast.error(errorMessage, { duration: 4000 });
          break;
        case 'not-allowed':
          setMicrophonePermission('denied');
          errorMessage = 'Microfoon toegang geweigerd. Klik op "Microfoon Toegang Toestaan" of gebruik het toetsenbord.';
          toast.error(errorMessage, { duration: 6000 });
          break;
        case 'network':
          errorMessage = 'Netwerkfout. Controleer je internetverbinding.';
          toast.error(errorMessage, { duration: 4000 });
          break;
        case 'aborted':
          return;
        default:
          toast.error(errorMessage, { duration: 4000 });
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  };

  useEffect(() => {
    if (messages.length === 0) {
      const introMessage = `Hallo! Ik ben SIMO, je AI assistent. Ik zal je helpen met het indienen van je melding voor ${type}. Kun je alsjeblieft specifiek vertellen wat er is gebeurd?`;

      setMessages([
        {
          role: 'assistant',
          content: introMessage,
          fieldName: null,
        },
      ]);

      if (!hasSpokenIntroRef.current && 'speechSynthesis' in window) {
        hasSpokenIntroRef.current = true;
        setTimeout(() => {
          setIsSpeaking(true);
          speak(introMessage, () => {
            setIsSpeaking(false);
          });
        }, 500);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stop();
    };
  }, [type, speak, stop]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = async () => {
    if (microphonePermission === 'prompt') {
      const granted = await requestMicrophoneAccess();
      if (!granted) return;
    }

    if (microphonePermission === 'denied') {
      toast.error('Microfoon toegang is geblokkeerd. Sta toegang toe in de adresbalk van je browser.', {
        duration: 5000,
      });
      return;
    }

    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    }

    setCurrentInput('');
    setIsListening(true);

    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }

    try {
      recognitionRef.current?.abort();
      setTimeout(() => {
        try {
          recognitionRef.current?.start();
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
          setIsListening(false);
          toast.error('Kon microfoon niet starten. Probeer het opnieuw.');
        }
      }, 50);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  const handleSubmitAnswer = async () => {
    if (!currentInput.trim() || aiLoading) return;

    if (isListening) {
      stopListening();
    }

    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    }

    const userInput = currentInput;
    setCurrentInput('');
    setUseKeyboard(false);

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userInput,
      },
    ]);

    const aiResponse = await sendToAi(userInput);

    if (aiResponse) {
      if (aiResponse.includes('[COMPLEET]')) {
        const parts = aiResponse.split('[COMPLEET]');
        const jsonString = parts[1].trim();

        try {
          const aiData = JSON.parse(jsonString);
          let mappedData = { ...aiData }; 

          navigate('/review', { state: { formData: mappedData, type: type } });
          return;
        } catch (e) {
          console.error("JSON parse error", e);
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: aiResponse, fieldName: null },
      ]);

      setTimeout(() => {
        setIsSpeaking(true);
        speak(aiResponse, () => setIsSpeaking(false));
      }, 300);
    }
  };

  const displayType = type ? type.charAt(0).toUpperCase() + type.slice(1) : '';

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-4xl mx-auto w-full shadow-2xl overflow-hidden border-x border-slate-100">
      
      <div className="bg-white/80 backdrop-blur-md border-b p-4 flex items-center gap-4 sticky top-0 z-20">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            stop();
            navigate('/nieuwe-melding');
          }} 
          className="rounded-full"
        >
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
            if (isSpeaking) {
              stop();
              setIsSpeaking(false);
            } else if (messages.length > 0) {
              const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
              if (lastAssistantMsg) {
                setIsSpeaking(true);
                speak(lastAssistantMsg.content, () => setIsSpeaking(false));
              }
            }
          }}
          className={`rounded-full border-slate-200 ${isSpeaking ? 'bg-primary/5' : ''}`}
          title={isSpeaking ? "Stop afspelen" : "Lees laatste bericht voor"}
        >
          <Volume2 className={`h-4 w-4 text-slate-600 ${isSpeaking ? 'animate-pulse text-primary' : ''}`} />
        </Button>
      </div>

      {microphonePermission === 'denied' && (
        <Alert variant="destructive" className="m-4 border-2 rounded-xl">
          <AlertDescription className="font-medium text-base py-1">
            Toegang tot de microfoon is geweigerd. Gebruik het toetsenbord of sta toegang toe in je browserinstellingen.
          </AlertDescription>
        </Alert>
      )}

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

      {/* Floating Input Area met GECORRIGEERDE statussen */}
      <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] shrink-0">
        <div className="max-w-2xl mx-auto space-y-6">
          
          <AnimatePresence mode="wait">
            {useKeyboard ? (
              // 1. TYPEN MODUS
              <motion.div 
                key="keyboard"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex gap-2"
              >
                <Input
                  autoFocus
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Typ je bericht..."
                  onKeyDown={(e) => e.key === 'Enter' && !aiLoading && handleSubmitAnswer()}
                  className="h-14 rounded-2xl border-slate-200 text-base px-6 shadow-sm focus:ring-primary/20"
                  disabled={aiLoading}
                />
                <Button 
                  onClick={handleSubmitAnswer} 
                  disabled={!currentInput.trim() || aiLoading}
                  className="h-14 w-14 rounded-2xl shadow-lg shadow-primary/20 shrink-0"
                >
                  {aiLoading ? (
                     <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                     </div>
                  ) : (
                     <Send className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
            ) : isListening ? (
              // 2. LUISTER MODUS (Actief aan het opnemen)
              <motion.div 
                key="listening"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-4"
              >
                <VoiceVisualizer isListening={true} />
                <p className="text-sm font-bold text-primary animate-pulse tracking-wide uppercase">Spreken...</p>
                <Button
                   size="icon"
                   onClick={stopListening}
                   variant="destructive"
                   className="h-12 w-12 rounded-full shadow-lg mt-2"
                 >
                   <MicOff className="h-5 w-5" />
                 </Button>
              </motion.div>
            ) : currentInput ? (
              // 3. SPRAAK HERKEND MODUS (Klaar om te verzenden)
              <motion.div 
                key="has-text"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-col gap-4 w-full"
              >
                <div className="w-full p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-slate-700 italic text-center shadow-inner">
                  "{currentInput}"
                </div>
                <div className="flex gap-3 justify-center">
                   <Button
                     onClick={startListening}
                     disabled={aiLoading}
                     variant="outline"
                     className="px-6 rounded-xl h-12 shadow-sm border-slate-200"
                   >
                     <Mic className="h-4 w-4 mr-2" />
                     Opnieuw inspreken
                   </Button>
                   <Button
                     onClick={handleSubmitAnswer}
                     disabled={aiLoading}
                     className="px-8 rounded-xl bg-green-600 hover:bg-green-700 h-12 shadow-lg"
                   >
                     <Send className="h-5 w-5 mr-2" />
                     Verstuur
                   </Button>
                </div>
              </motion.div>
            ) : (
              // 4. IDLE MODUS (Wachten tot de gebruiker wil praten)
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                if (isListening) stopListening();
                setUseKeyboard(!useKeyboard);
                setCurrentInput('');
              }}
              className="text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest mt-2"
            >
              {useKeyboard ? <><Mic className="h-4 w-4 mr-2" /> Liever Spreken</> : <><Keyboard className="h-4 w-4 mr-2" /> Liever Typen</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}