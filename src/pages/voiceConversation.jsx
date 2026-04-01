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
    
    let typeContext = '';
    if (type === 'facilitair') typeContext = 'TYPE: Facilitair melding.';
    else if (type === 'mic') typeContext = 'TYPE: MIC (Melding Incident Cliënt).';
    else if (type === 'mim') typeContext = 'TYPE: MIM (Melding Incident Medewerker).';

    // 1. Bouw de chatgeschiedenis op uit de bestaande messages state
    // We filteren de introductie er even uit om de focus op de feiten te houden
    const history = messages
      .filter((_, index) => index > 0) // Slaat de eerste SIMO intro over voor minder ruis
      .map(m => `${m.role === 'user' ? 'Gebruiker' : 'Assistent'}: ${m.content}`)
      .join('\n');

    // 2. Maak de definitieve prompt
    // We vertellen de AI expliciet dat hij in de geschiedenis moet kijken
    const fullPrompt = `${typeContext}
Hieronder volgt het gesprek tot nu toe. Gebruik de informatie uit eerdere berichten om te bepalen wat je al weet.

GESPREK:
${history}
Gebruiker: ${userMessage}

INSTRUCTIE: Scan het bovenstaande gesprek op antwoorden. Stel GEEN vragen over zaken die hierboven al zijn genoemd (zoals namen, tijden of locaties).`;

    const response = await fetch('http://localhost:5258/api/Ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: fullPrompt,
        type: type,
        context: formData // formData blijft behouden voor je backend opslag
      })
    });

    if (!response.ok) throw new Error(`API responded with status ${response.status}`);

    const data = await response.json();
    
    let aiReply = '';
    // Parsing voor Gemini 3.1 Thinking
    if (data.candidates && data.candidates[0]?.content?.parts) {
      const parts = data.candidates[0].content.parts;
      // Zoek de tekst part (negeer de thought part)
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
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore errors on cleanup
        }
      }
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speak new assistant messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && messages.length > 1) {
        // Don't speak the first question again since we handle it in the initial useEffect
        setTimeout(() => {
          setIsSpeaking(true);
          speak(lastMessage.content, () => setIsSpeaking(false));
        }, 300);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error('Spraakherkenning wordt niet ondersteund in je browser. Gebruik het toetsenbord.', {
        duration: 4000,
      });
      return;
    }

    // Stop any ongoing speech
    stop();
    setIsSpeaking(false);
    
    setIsListening(true);
    try {
      recognitionRef.current.start();
      toast.info('Luisteren... Spreek nu uw antwoord in.', {
        duration: 2000,
        icon: <Mic className="h-4 w-4" />
      });
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsListening(false);
      
      if (error && error.message && error.message.includes('already started')) {
        // Recognition is already running, stop it first
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
            setIsListening(true);
          } catch {
            toast.error('Kon niet luisteren. Herlaad de pagina en probeer opnieuw.');
          }
        }, 100);
      } else {
        toast.error('Kon niet luisteren. Controleer je microfoon toegang.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentInput.trim()) return;

    // Stop speaking when submitting
    stop();
    setIsSpeaking(false);

    const userMessage = currentInput;
    
    // Add user message to conversation
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage, fieldName: null },
    ]);

    setCurrentInput('');

    // Save to form data
    const newFormData = { ...formData };
    newFormData[`answer_${Object.keys(formData).length}`] = userMessage;
    setFormData(newFormData);

    // Send to SIMO and get response
    const aiResponse = await sendToAi(userMessage);
    
    if (aiResponse) {
      // Add SIMO's response to conversation
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: aiResponse, fieldName: null },
      ]);
      
      // Speak the response
      setTimeout(() => {
        setIsSpeaking(true);
        speak(aiResponse, () => setIsSpeaking(false));
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Annuleren
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold capitalize">{type} Melding</h1>
            {isSpeaking && (
              <div className="flex items-center gap-1 text-blue-600 animate-pulse">
                <Volume2 className="h-5 w-5" />
                <span className="text-sm">Spreekt...</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={() => setUseKeyboard(!useKeyboard)}
            className="ml-auto"
          >
            <Keyboard className="h-4 w-4" />
          </Button>
        </div>

        {/* Microphone Permission Alert */}
        {(microphonePermission === 'denied' || microphonePermission === 'prompt') && !useKeyboard && (
          <Alert className="mb-4 bg-blue-50 border-blue-300">
            <Mic className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              {microphonePermission === 'denied' ? (
                <div className="space-y-2">
                  <p className="font-semibold">Microfoon toegang geweigerd</p>
                  <p className="text-sm">
                    Om spraakherkenning te gebruiken moet je microfoon toegang geven:
                  </p>
                  <ol className="text-sm list-decimal list-inside space-y-1 ml-2">
                    <li>Klik op het slotje/camera-icoon links van de URL</li>
                    <li>Sta microfoon toegang toe voor deze website</li>
                    <li>Herlaad de pagina</li>
                  </ol>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      onClick={requestMicrophoneAccess}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Opnieuw Proberen
                    </Button>
                    <Button 
                      onClick={() => setUseKeyboard(true)}
                      size="sm"
                      variant="outline"
                    >
                      <Keyboard className="h-4 w-4 mr-2" />
                      Gebruik Toetsenbord
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-semibold">Spraakherkenning inschakelen</p>
                  <p className="text-sm">
                    Voor spraakherkenning heeft de app toegang tot je microfoon nodig.
                  </p>
                  <Button 
                    onClick={requestMicrophoneAccess}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 mt-2"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Microfoon Toegang Toestaan
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 bg-white rounded-lg p-6 shadow-sm">
          {messages.map((message, index) => (
            <ConversationBubble key={index} message={message} />
          ))}
          
          {aiLoading && (
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-sm text-gray-600">SIMO denkt na...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <VoiceVisualizer isListening={isListening} />

          {useKeyboard ? (
            <div className="flex gap-2">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type hier je antwoord..."
                onKeyPress={(e) => e.key === 'Enter' && !aiLoading && handleSubmitAnswer()}
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
                  className="h-20 px-8"
                >
                  {aiLoading ? (
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    </div>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Verzenden
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {currentInput && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Je hebt gezegd:</p>
              <div className="flex justify-between items-start gap-4">
                <p className="text-base font-medium flex-1">{currentInput}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCurrentInput('')}
                  className="text-xs"
                >
                  Wissen
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}