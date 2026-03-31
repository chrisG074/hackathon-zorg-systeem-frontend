import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ConversationBubble } from '../components/ConversationBubble';
import { VoiceVisualizer } from '../components/VoiceVisualizer';
import { BodyMap } from '../components/BodyMap';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Keyboard,
  Send,
  AlertTriangle,
  Volume2,
} from 'lucide-react';
import { ConversationMessage, ReportType } from '../types.js';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { useSpeech } from '../hooks/useSpeech';

const facilitairQuestions = [
  { field: 'location', question: 'In welke kamer of ruimte is het probleem?', type: 'text' },
  {
    field: 'equipmentType',
    question: 'Wat voor hulpmiddel of apparaat betreft het?',
    type: 'select',
    options: ['Hoog-laag bed', 'Tillift', 'Rolstoel', 'Douchetoilet', 'Anders'],
  },
  {
    field: 'isUrgent',
    question: 'Is er sprake van spoed tegen een meerprijs van 152,75?',
    type: 'boolean',
    showUrgencyWarning: true,
  },
  { field: 'description', question: 'Kun je het probleem kort omschrijven?', type: 'text' },
];

const micQuestions = [
  { field: 'clientName', question: 'Wat is de naam van de cliënt?', type: 'text' },
  {
    field: 'bodyLocation',
    question: 'Waar op het lichaam is het letsel? Klik op de lichaamskaart.',
    type: 'bodymap',
  },
  {
    field: 'healthComplaints',
    question: 'Welke gezondheidsklachten zijn er?',
    type: 'select',
    options: ['Pijn', 'Blauwe plek', 'Wond', 'Botbreuk', 'Misselijkheid', 'Bloeding'],
  },
  { field: 'description', question: 'Wat is er precies gebeurd?', type: 'text' },
];

const mimQuestions = [
  {
    field: 'category',
    question: 'Wat voor incident betreft het?',
    type: 'select',
    options: ['Agressie', 'Valpartij', 'Prikincident', 'Overbelasting', 'Anders'],
  },
  { field: 'description', question: 'Kun je toelichten wat er is gebeurd?', type: 'text' },
  { field: 'supervisor', question: 'Wie is je leidinggevende?', type: 'text' },
  {
    field: 'workAbsence',
    question: 'Is er sprake van arbeidsverzuim?',
    type: 'boolean',
  },
];

export default function VoiceConversation() {
  const navigate = useNavigate();
  const { type } = useParams();
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [useKeyboard, setUseKeyboard] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState({})
  const [showUrgencyAlert, setShowUrgencyAlert] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState('prompt');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const hasSpokenIntroRef = useRef(false);
  const { speak, stop } = useSpeech();

  const questions =
    type === 'facilitair'
      ? facilitairQuestions
      : type === 'mic'
      ? micQuestions
      : mimQuestions;

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
      } catch (error) {
        console.log('Permission API not supported');
      }
    };
    
    checkMicrophonePermission();
  }, []);

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
      
      // Initialize speech recognition after permission granted
      initializeSpeechRecognition();
      
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
    // Ask first question (but don't initialize speech recognition yet)
    if (messages.length === 0) {
      const firstQuestion = questions[0];
      setMessages([
        {
          role: 'assistant',
          content: firstQuestion.question,
          fieldName: firstQuestion.field,
        },
      ]);

      // Only speak intro if TTS is available (no microphone needed for TTS)
      if (!hasSpokenIntroRef.current && 'speechSynthesis' in window) {
        hasSpokenIntroRef.current = true;
        setTimeout(() => {
          setIsSpeaking(true);
          const introText = 'Welkom bij de spraakmelding. Klik op "Microfoon Toegang Toestaan" om spraakherkenning te gebruiken, of klik op het toetsenbord-icoon om te typen.';
          speak(introText, () => {
            setIsSpeaking(false);
            // Automatically speak the first question after intro
            setTimeout(() => {
              setIsSpeaking(true);
              speak(firstQuestion.question, () => setIsSpeaking(false));
            }, 500);
          });
        }, 500);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
      stop();
    };
  }, []);

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
          } catch (e) {
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

  const handleSubmitAnswer = () => {
    if (!currentInput.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: currentInput, fieldName: currentQuestion.field },
    ]);

    // Save to form data
    const newFormData = { ...formData };
    
    if (currentQuestion.type === 'boolean') {
      const answer = currentInput.toLowerCase();
      newFormData[currentQuestion.field] = answer.includes('ja') || answer.includes('yes');
    } else if (currentQuestion.field === 'healthComplaints') {
      // For multi-select, just store as array
      newFormData[currentQuestion.field] = [currentInput];
    } else {
      newFormData[currentQuestion.field] = currentInput;
    }
    
    setFormData(newFormData);
    setCurrentInput('');

    // Check for urgency warning
    if (currentQuestion.showUrgencyWarning && newFormData[currentQuestion.field]) {
      setShowUrgencyAlert(true);
      setTimeout(() => setShowUrgencyAlert(false), 5000);
    }

    // Move to next question or complete
    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestion = questions[currentQuestionIndex + 1];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: nextQuestion.question,
            fieldName: nextQuestion.field,
          },
        ]);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 500);
    } else {
      // All questions answered
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Bedankt! Ik heb alle informatie. Laten we je melding nog even controleren.',
          },
        ]);
        setTimeout(() => {
          navigate('/review', { state: { formData, type } });
        }, 1500);
      }, 500);
    }
  };

  const handleBodyMapSelect = (locations) => {
    setCurrentInput(locations.join(', '));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isBodyMapQuestion = currentQuestion?.type === 'bodymap';

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

        {showUrgencyAlert && (
          <Alert className="mb-4 bg-orange-50 border-orange-300">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Let op: Je kiest voor spoed (€152,75). Zorg dat je coach/coördinator akkoord is.
            </AlertDescription>
          </Alert>
        )}

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
          
          {isBodyMapQuestion && messages.length > 0 && (
            <Card className="p-6">
              <BodyMap
                selectedLocations={
                  currentInput ? currentInput.split(', ') : []
                }
                onLocationSelect={handleBodyMapSelect}
              />
            </Card>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <VoiceVisualizer isListening={isListening} />

          {useKeyboard || isBodyMapQuestion ? (
            <div className="flex gap-2">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type hier je antwoord..."
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                className="flex-1 h-14 text-lg"
                disabled={isBodyMapQuestion}
              />
              <Button
                size="lg"
                onClick={handleSubmitAnswer}
                disabled={!currentInput.trim()}
                className="h-14 px-8"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              {!isListening ? (
                <Button
                  size="lg"
                  onClick={startListening}
                  className="h-20 w-20 rounded-full bg-blue-600 hover:bg-blue-700"
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
                  className="h-20 px-8"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Verzenden
                </Button>
              )}
            </div>
          )}

          {currentInput && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Je hebt gezegd:</p>
              <p className="text-base font-medium">{currentInput}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}