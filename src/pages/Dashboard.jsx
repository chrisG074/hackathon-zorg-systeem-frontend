import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Mic, Wrench, AlertCircle, User, Phone, ArrowRight, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [TimeIcon, setTimeIcon] = useState(Sun);
  
  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 23 || currentHour < 7;
  const userEmail = localStorage.getItem('userEmail') || 'gebruiker@zorg.nl';
  const userName = userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1);

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

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Hero / Welcome Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <TimeIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {greeting}, {userName}
              </h1>
              <p className="text-slate-500 font-medium mt-1">Wat wil je vandaag melden?</p>
            </div>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-full text-sm font-medium text-slate-600 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Interne helpdesk: 06-12345678
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-10 mt-6">
        {/* Night Time Alert */}
        {isNightTime && (
          <Card className="p-0 bg-red-50 border-red-200 shadow-md overflow-hidden rounded-2xl">
            <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap p-6">
              <div className="p-4 bg-red-100 rounded-full shrink-0">
                <Phone className="h-8 w-8 text-red-600 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-800">Nachtprotocol is actief</h3>
                <p className="text-red-600 font-medium mt-1">
                  Voor spoedeisende en levensbedreigende zaken, bel direct de Zorgcentrale.
                </p>
              </div>
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto mt-4 sm:mt-0"
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
            className="group relative overflow-hidden h-32 w-full max-w-2xl text-2xl font-bold bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-3xl"
            onClick={() => navigate('/nieuwe-melding')}
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <Mic className="h-10 w-10 mr-4 group-hover:scale-110 transition-transform duration-300" />
            Start de slimme assistent (SIMO)
          </Button>
        </div>

        {/* Quick Selection Cards */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Snelkeuze categorieën</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-blue-400 bg-white group rounded-2xl"
              onClick={() => navigate('/conversatie/facilitair')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                  <Wrench className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">Facilitair</h3>
                  <p className="text-sm text-slate-500 mt-1">Defecten, reparaties & middelen</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-colors mt-2" />
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-red-400 bg-white group rounded-2xl"
              onClick={() => navigate('/conversatie/mic')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-red-600 transition-colors">MIC</h3>
                  <p className="text-sm text-slate-500 mt-1">Incidenten rondom de cliënt</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-red-600 transition-colors mt-2" />
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-purple-400 bg-white group rounded-2xl"
              onClick={() => navigate('/conversatie/mim')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-purple-600 transition-colors">MIM</h3>
                  <p className="text-sm text-slate-500 mt-1">Incidenten met medewerkers</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-purple-600 transition-colors mt-2" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}