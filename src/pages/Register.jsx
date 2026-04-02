import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Mic, Wrench, AlertCircle, User, Phone, ArrowRight, Sun, Moon, Sunrise, Sunset, Activity, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [TimeIcon, setTimeIcon] = useState(Sun);
  
  // Nieuwe state voor de meldingen
  const [recenteMeldingen, setRecenteMeldingen] = useState([]);
  const [isLoadingMeldingen, setIsLoadingMeldingen] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5258';

  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 23 || currentHour < 7;
  const userEmail = localStorage.getItem('userEmail') || 'gebruiker@zorg.nl';
  const userName = userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1);

  // Bestaande begroeting logic
  useEffect(() => {
    if (currentHour >= 6 && currentHour < 12) {
      setGreeting('Goedemorgen');
      setTimeIcon(Sunrise);
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting('Goedemiddag');
      setTimeIcon(Sun);
    } else if (currentHour >= 18 && currentHour < 23) {
      setGreeting('Goedenavond');
      setTimeIcon(Sunset);
    } else {
      setGreeting('Goedenacht');
      setTimeIcon(Moon);
    }
  }, [currentHour]);

  // NIEUW: Fetch de meest recente meldingen
  useEffect(() => {
    const fetchRecenteMeldingen = async () => {
      try {
        const response = await fetch(`${API_URL}/api/meldingen`);
        if (response.ok) {
          const data = await response.json();
          // Pak alleen de 3 meest recente meldingen voor het dashboard
          setRecenteMeldingen(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Kon recente meldingen niet ophalen:', error);
      } finally {
        setIsLoadingMeldingen(false);
      }
    };

    fetchRecenteMeldingen();
  }, [API_URL]);

  // NIEUW: Functie om de datum om te zetten naar "zoveel tijd geleden"
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Onbekend';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Zojuist';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min geleden`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} uur geleden`;
    if (diffInSeconds < 172800) return 'Gisteren';
    return `${Math.floor(diffInSeconds / 86400)} dgn geleden`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Hero / Welcome Banner */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-8 sm:py-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <TimeIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {greeting}, {userName}
              </h1>
              <p className="text-slate-500 font-medium mt-1">Wat wil je vandaag melden?</p>
            </div>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-full text-sm font-medium text-slate-600 flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
            <Phone className="h-4 w-4 shrink-0" />
            Interne helpdesk: 06-12345678
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10 mt-6">
        {/* Night Time Alert */}
        {isNightTime && (
          <Card className="p-0 bg-red-50 border-red-200 shadow-md overflow-hidden rounded-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6">
              <div className="p-4 bg-red-100 rounded-full shrink-0 hidden sm:block">
                <Phone className="h-8 w-8 text-red-600 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 sm:hidden mb-2">
                  <Phone className="h-6 w-6 text-red-600 animate-pulse" />
                  <h3 className="text-lg font-bold text-red-800">Nachtprotocol actief</h3>
                </div>
                <h3 className="text-lg font-bold text-red-800 hidden sm:block">Nachtprotocol is actief</h3>
                <p className="text-red-600 font-medium mt-1 text-sm sm:text-base">
                  Voor spoedeisende en levensbedreigende zaken, bel direct de Zorgcentrale.
                </p>
              </div>
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto mt-2 sm:mt-0"
                onClick={() => window.open('tel:0534603500')}
              >
                Bel direct 053-460 3500
              </Button>
            </div>
          </Card>
        )}

        {/* Main Action Area */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="group relative overflow-hidden w-full max-w-2xl min-h-[6rem] sm:min-h-[8rem] h-auto py-6 sm:py-0 px-4 text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            onClick={() => navigate('/nieuwe-melding')}
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <Mic className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-center">Start de slimme assistent (SIMO)</span>
          </Button>
        </div>

        {/* Quick Selection Cards */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Snelkeuze categorieën</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Card
              className="p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-blue-400 bg-white group rounded-2xl"
              onClick={() => navigate('/conversatie/facilitair')}
            >
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                  <Wrench className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 group-hover:text-blue-600 transition-colors">Facilitair</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Defecten, reparaties & middelen</p>
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-hover:text-blue-600 transition-colors mt-2" />
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-red-400 bg-white group rounded-2xl"
              onClick={() => navigate('/conversatie/mic')}
            >
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-50 rounded-2xl flex items-center justify-center group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300">
                  <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 group-hover:text-red-600 transition-colors">MIC</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Incidenten rondom de cliënt</p>
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-hover:text-red-600 transition-colors mt-2" />
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-purple-400 bg-white group rounded-2xl"
              onClick={() => navigate('/conversatie/mim')}
            >
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300">
                  <User className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 group-hover:text-purple-600 transition-colors">MIM</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Incidenten met medewerkers</p>
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300 group-hover:text-purple-600 transition-colors mt-2" />
              </div>
            </Card>
          </div>
        </div>

        {/* NIEUW: Recente Meldingen Sectie */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Nieuwste meldingen
            </h2>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {isLoadingMeldingen ? (
              <div className="text-center py-10">
                <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto opacity-50"></div>
                <p className="text-sm font-bold text-slate-400 mt-3 uppercase tracking-wider">Laden...</p>
              </div>
            ) : recenteMeldingen.length === 0 ? (
              <Card className="p-8 text-center bg-white border-dashed border-2 border-slate-200 rounded-2xl">
                <p className="text-slate-500 font-bold">Nog geen recente meldingen in het systeem.</p>
              </Card>
            ) : (
              recenteMeldingen.map((melding) => (
                <Card 
                  key={melding.id} 
                  className="p-4 sm:p-5 bg-white hover:shadow-lg transition-all duration-300 border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-center justify-between group overflow-hidden relative"
                >
                  {/* Gekleurde balk aan de zijkant */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    melding.type === 'Facilitair' ? 'bg-blue-500' :
                    melding.type === 'MIC' ? 'bg-red-500' :
                    'bg-purple-500'
                  }`} />

                  <div className="flex items-start sm:items-center gap-4 pl-2">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          melding.type === 'Facilitair' ? 'bg-blue-50 text-blue-600' :
                          melding.type === 'MIC' ? 'bg-red-50 text-red-600' :
                          'bg-purple-50 text-purple-600'
                        }`}>
                          {melding.type}
                        </span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md">
                          <Clock className="h-3 w-3" />
                          {getTimeAgo(melding.datum)}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-base">{melding.categorie}</h4>
                      {melding.betrokkene && (
                        <p className="text-sm text-slate-500 mt-0.5 font-medium flex items-center gap-1">
                          <User className="h-3.5 w-3.5 opacity-70" />
                          {melding.betrokkene}
                        </p>
                      )}
                    </div>
                  </div>

                  {melding.isSpoed && (
                    <div className="shrink-0 sm:ml-auto self-start sm:self-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest animate-pulse border border-red-100">
                        <AlertCircle className="h-3.5 w-3.5" /> Spoed
                      </span>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}