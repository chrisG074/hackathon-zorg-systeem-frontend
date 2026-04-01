import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ConversationBubble } from '../components/ConversationBubble';
import { VoiceVisualizer } from '../components/VoiceVisualizer';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Keyboard,
  Send,
  Volume2,
} from 'lucide-react';
import { ConversationMessage, ReportType } from '../types.js';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { useSpeech } from '../hooks/useSpeech';

export default function VoiceConversation() {
  const navigate = useNavigate();
  const { type } = useParams();
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [useKeyboard, setUseKeyboard] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [formData, setFormData] = useState({})
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState('prompt');
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const hasSpokenIntroRef = useRef(false);
  const { speak, stop } = useSpeech();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5258';

  // Check microphone permission on mount
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

  // Initialize speech recognition when permission is granted
  useEffect(() => {
    if (microphonePermission === 'granted') {
      initializeSpeechRecognition();
    }
  }, [microphonePermission]);

  // Send message to AI and get response
  const sendToAi = async (userMessage) => {
    try {
      setAiLoading(true);
      
      // Create context message with incident type
      let typeContext = '';
      if (type === 'facilitair') {
        typeContext = 'Dit is een facilitair melding.';
      } else if (type === 'mic') {
        typeContext = 'Dit is een MIC melding.';
      } else if (type === 'mim') {
        typeContext = 'Dit is een MIM melding.';
      }
      
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: typeContext + userMessage,
          type: type,
          context: formData
        })
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      
      // Try to parse JSON response from LM Studio format
      let aiReply = '';
      try {
        if (typeof data === 'string') {
          const parsed = JSON.parse(data);
          aiReply = parsed.choices?.[0]?.message?.content || data;
        } else if (data.choices) {
          aiReply = data.choices[0].message.content;
        } else {
          aiReply = data.reply || data.message || JSON.stringify(data);
        }
      } catch {
        aiReply = typeof data === 'string' ? data : JSON.stringify(data);
      }
      
      return aiReply;
    } catch (error) {
      console.error('Error calling AI:', error);
      toast.error('Fout bij AI communicatie. Controleer of de server actief is.', {
        duration: 4000,
      });
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  // Request microphone access
  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      setMicrophonePermission('granted');
      toast.success('Microfoon toegang verleend!', {
        duration: 2000,
      });
      // Speech recognition will initialize automatically via the useEffect that watches microphonePermission
      
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

    // Don't reinitialize if already initialized
    if (recognitionRef.current) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'nl-NL';
    recognitionRef.current.continuous = false;
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
          // Don't show error for aborted (user stopped manually)
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
    // Start AI conversation
    if (messages.length === 0) {
      const introMessage = `Hallo! Ik ben SIMO, je AI assistent. Ik zal je helpen met het indienen van je melding voor ${type}. Kun je alsjeblieft specifiek vertellen wat er is gebeurd?`;

      setMessages([
        {
          role: 'assistant',
          content: introMessage,
          fieldName: null,
        },
      ]);

      // Only speak intro if TTS is available
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
      stop(); // Stop any ongoing speech when unmounting
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

    // Stop AI speech if we're interrupting it
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    }

    setCurrentInput('');
    setIsListening(true);
    
    // Ensure recognition is initialized
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }

    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      
      // If recognition is already started or in a weird state, abort and retry
      if (error.name === 'InvalidStateError') {
        recognitionRef.current?.abort();
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
            setIsListening(true);
          } catch (retryError) {
            console.error('Retry failed:', retryError);
            toast.error('Kon microfoon niet starten. Probeer de pagina te vernieuwen.');
          }
        }, 100);
      }
    }
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  const handleSubmitAnswer = async () => {
    if (!currentInput.trim() || aiLoading) return;

    // Stop listening if active
    if (isListening) {
      stopListening();
    }

    // Stop speaking if active
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    }

    const userInput = currentInput;
    setCurrentInput(''); // Clear input immediately for better UX
    setUseKeyboard(false); // Hide keyboard input if used

    // Add user message to conversation
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userInput,
      },
    ]);

    // Send to AI and wait for response
    const aiResponseContent = await sendToAi(userInput);
    
    if (aiResponseContent) {
      // Create new AI message
      const aiMessage = {
        role: 'assistant',
        content: aiResponseContent,
        fieldName: null,
      };

      // Add AI response to conversation
      setMessages((prev) => [...prev, aiMessage]);

      // Read response aloud
      setIsSpeaking(true);
      speak(aiResponseContent, () => {
        setIsSpeaking(false);
      });
    }
  };

  // Format type for display
  const displayType = type ? type.charAt(0).toUpperCase() + type.slice(1) : '';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col max-w-3xl mx-auto w-full shadow-xl">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10 shadow-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            stop(); // Stop speaking if leaving
            navigate('/nieuwe-melding');
          }}
          className="text-primary-foreground hover:bg-primary/20 shrink-0"
          title="Terug"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Nieuwe {displayType} Melding</h2>
          <p className="text-sm text-primary-foreground/80 hidden sm:block">
            Simo helpt je met het invullen van de melding
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (isSpeaking) {
              stop();
              setIsSpeaking(false);
            } else if (messages.length > 0) {
              // Read the last assistant message
              const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
              if (lastAssistantMsg) {
                setIsSpeaking(true);
                speak(lastAssistantMsg.content, () => setIsSpeaking(false));
              }
            }
          }}
          className={`shrink-0 ${isSpeaking ? 'text-accent' : 'text-primary-foreground'}`}
          title={isSpeaking ? "Stop afspelen" : "Lees laatste bericht voor"}
        >
          <Volume2 className={`h-6 w-6 ${isSpeaking ? 'animate-pulse' : ''}`} />
        </Button>
      </div>

      {/* Permission Alert */}
      {microphonePermission === 'denied' && (
        <Alert variant="destructive" className="m-4 border-2 rounded-xl">
          <AlertDescription className="font-medium text-base py-1">
            Toegang tot de microfoon is geweigerd. Gebruik het toetsenbord of sta toegang toe in je browserinstellingen (klik op het slotje in de adresbalk).
          </AlertDescription>
        </Alert>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <ConversationBubble key={index} message={msg} />
          ))}
          {aiLoading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-gray-200 text-gray-800 rounded-tl-none flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4 pb-8 sm:pb-4 fixed bottom-0 w-full max-w-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl">
        <div className="flex flex-col gap-4">
          
          {/* Status indicators */}
          <div className="h-24 flex items-center justify-center">
            {isListening ? (
              <div className="w-full flex flex-col items-center gap-2">
                <VoiceVisualizer isListening={true} />
                <p className="text-sm font-medium text-blue-600 animate-pulse">
                  Ik luister... (Spreek nu)
                </p>
                {currentInput && (
                  <p className="text-sm text-gray-500 truncate max-w-full px-4">
                    "{currentInput}"
                  </p>
                )}
              </div>
            ) : useKeyboard ? (
              <div className="w-full h-full flex flex-col justify-end">
                <p className="text-sm font-medium text-gray-600 mb-2 pl-1">
                  Typ je antwoord:
                </p>
                <div className="flex gap-2">
                  <Input
                    autoFocus
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder="Typ hier..."
                    onKeyDown={(e) => e.key === 'Enter' && !aiLoading && handleSubmitAnswer()}
                    className="flex-1 h-14 text-lg"
                    disabled={aiLoading}
                  />
                  <Button 
                    size="lg" 
                    onClick={handleSubmitAnswer}
                    disabled={!currentInput.trim() || aiLoading}
                    className="h-14 px-8"
                  >
                    {aiLoading ? (
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      </div>
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-4">
                {!isListening ? (
                  <Button
                    size="lg"
                    onClick={startListening}
                    disabled={aiLoading}
                    className="h-20 w-20 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Mic className="h-8 w-8" />
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={stopListening}
                    variant="destructive"
                    className="h-20 w-20 rounded-full"
                  >
                    <MicOff className="h-8 w-8" />
                  </Button>
                )}
                
                {currentInput && (
                  <Button
                    size="lg"
                    onClick={handleSubmitAnswer}
                    disabled={aiLoading}
                    className="h-20 px-8 rounded-full bg-green-600 hover:bg-green-700"
                  >
                    Verstuur "{currentInput.substring(0, 15)}..."
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Toggle buttons */}
          <div className="flex justify-center gap-2">
            {!useKeyboard ? (
              <Button
                variant="outline"
                onClick={() => {
                  if (isListening) stopListening();
                  setUseKeyboard(true);
                }}
                className="text-gray-600 rounded-full"
              >
                <Keyboard className="h-4 w-4 mr-2" />
                Liever typen
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setUseKeyboard(false)}
                className="text-gray-600 rounded-full"
              >
                <Mic className="h-4 w-4 mr-2" />
                Liever spreken
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}