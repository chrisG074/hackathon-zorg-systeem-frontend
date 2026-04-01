import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Filter, ArrowLeft, User, Loader2, AlertCircle, Calendar, Wrench } from 'lucide-react';

export default function Overzicht() {
  const navigate = useNavigate();
  const [actieveFilter, setActieveFilter] = useState('Alle');
  
  const [meldingen, setMeldingen] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5258';

  useEffect(() => {
    const fetchMeldingen = async () => {
      try {
        const response = await fetch(`${API_URL}/api/meldingen`); 
        
        if (!response.ok) {
          throw new Error('Kon de meldingen niet ophalen van de server.');
        }
        
        const data = await response.json();
        setMeldingen(data); 
      } catch (err) {
        console.error("Fout bij ophalen database:", err);
        setError("Er is een probleem met de verbinding naar de database.");
      } finally {
        setIsLoading(false); 
      }
    };

    fetchMeldingen();
  }, [API_URL]);

  const gefilterdeMeldingen = actieveFilter === 'Alle' 
    ? meldingen 
    : meldingen.filter(melding => melding.type === actieveFilter);

  const getTypeStyling = (type) => {
    switch(type) {
      case 'Facilitair': return { color: 'text-blue-700', bg: 'bg-blue-100', border: 'bg-blue-500', icon: <Wrench className="h-5 w-5" /> };
      case 'MIC': return { color: 'text-red-700', bg: 'bg-red-100', border: 'bg-red-500', icon: <AlertCircle className="h-5 w-5" /> };
      case 'MIM': return { color: 'text-purple-700', bg: 'bg-purple-100', border: 'bg-purple-500', icon: <User className="h-5 w-5" /> };
      default: return { color: 'text-slate-700', bg: 'bg-slate-100', border: 'bg-slate-400', icon: <AlertCircle className="h-5 w-5" /> };
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-12">
      <div className="bg-white border-b border-slate-200 w-full px-6 md:px-10 py-8 shadow-sm mb-6"> {/* Fluid header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')} className="shrink-0 rounded-full hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Meldingen Overzicht
            </h1>
            <p className="text-slate-500 font-medium mt-1">Bekijk en filter alle geregistreerde rapportages</p>
          </div>
        </div>
      </div>

      <div className="w-full px-6 md:px-10 space-y-6"> {/* Fluid content */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 inline-flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-slate-500 pl-3 pr-2 border-r border-slate-200">
            <Filter className="h-4 w-4" />
            <span className="font-semibold text-sm hidden sm:inline">Filter</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {['Alle', 'Facilitair', 'MIC', 'MIM'].map((filterType) => (
              <Button
                key={filterType}
                variant={actieveFilter === filterType ? 'default' : 'ghost'}
                onClick={() => setActieveFilter(filterType)}
                className={`rounded-xl px-6 transition-all duration-200 ${
                  actieveFilter === filterType 
                    ? 'shadow-md font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`}
                size="sm"
              >
                {filterType}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 mt-6">
          {isLoading && (
            <Card className="p-16 text-center bg-white flex flex-col items-center justify-center text-slate-500 border border-slate-200 rounded-2xl shadow-sm">
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
              <p className="text-lg font-medium">Meldingen ophalen uit de database...</p>
            </Card>
          )}

          {error && !isLoading && (
            <Card className="p-12 text-center bg-red-50 border border-red-200 text-red-600 rounded-2xl shadow-sm">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-bold">{error}</p>
              <p className="text-sm mt-2 text-red-500/80 font-medium">Check of de backend applicatie actief is.</p>
            </Card>
          )}

          {!isLoading && !error && gefilterdeMeldingen.length === 0 && (
            <Card className="p-16 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700">Geen meldingen gevonden</h3>
              <p className="text-slate-500 font-medium mt-2">Er zijn momenteel geen meldingen in deze categorie.</p>
            </Card>
          )}

          {!isLoading && !error && gefilterdeMeldingen.map((melding) => {
            const style = getTypeStyling(melding.type);
            
            return (
              <Card 
                key={melding.id} 
                className="overflow-hidden bg-white hover:shadow-md transition-all duration-200 border border-slate-200 rounded-2xl flex flex-col sm:flex-row group"
              >
                <div className={`h-2 sm:h-auto sm:w-3 shrink-0 ${style.border}`} />
                
                <div className="p-6 flex-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${style.bg} ${style.color}`}>
                        {style.icon}
                      </div>
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${style.color}`}>
                          {melding.type}
                        </span>
                        <h3 className="font-bold text-xl text-slate-900 mt-0.5">{melding.categorie}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <Calendar className="h-4 w-4" />
                      {melding.datum || new Date().toLocaleDateString('nl-NL')}
                    </div>
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed mb-4 text-[15px]">
                    {melding.beschrijving}
                  </p>

                  {melding.betrokkene && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 w-fit px-3 py-1.5 rounded-lg border border-slate-200">
                      <User className="h-4 w-4 text-slate-500" />
                      <span>Betrokkene: {melding.betrokkene}</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}