import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Filter, ArrowLeft, User, Loader2, AlertCircle, MapPin, Clock } from 'lucide-react';

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
        if (!response.ok) throw new Error('Kon de meldingen niet ophalen.');
        const data = await response.json();
        setMeldingen(data); 
      } catch (err) {
        setError("Verbindingsfout met de database.");
      } finally {
        setIsLoading(false); 
      }
    };
    fetchMeldingen();
  }, [API_URL]);

  const gefilterdeMeldingen = actieveFilter === 'Alle' 
    ? meldingen 
    : meldingen.filter(melding => melding.type === actieveFilter);

  return (
    <div className="bg-slate-50/50 min-h-full pb-12">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 mt-2">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')} className="shrink-0 rounded-xl shadow-sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Overzicht Meldingen
              </h2>
              <p className="text-slate-500 text-sm font-medium">Beheer en bekijk alle binnengekomen rapportages</p>
            </div>
          </div>
        </div>

        {/* Filter Sectie - Mobile friendly scroll */}
        <Card className="p-2 sm:p-4 bg-white flex items-center gap-2 sm:gap-4 shadow-sm border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 text-slate-400 pl-2 shrink-0">
            <Filter className="h-4 w-4" />
            <span className="font-bold text-xs uppercase tracking-wider hidden md:inline">Filter:</span>
          </div>
          
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 sm:pb-0 w-full">
            {['Alle', 'Facilitair', 'MIC', 'MIM'].map((filterType) => (
              <Button
                key={filterType}
                variant={actieveFilter === filterType ? 'default' : 'ghost'}
                onClick={() => setActieveFilter(filterType)}
                className={`rounded-xl px-4 py-1 h-9 text-sm font-semibold transition-all shrink-0 ${
                  actieveFilter === filterType ? 'bg-primary shadow-md' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {filterType}
              </Button>
            ))}
          </div>
        </Card>

        {/* Meldingen Lijst */}
        <div className="grid gap-4 sm:gap-6">
          {isLoading && (
            <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
              <p className="font-bold">Database doorzoeken...</p>
            </div>
          )}

          {error && !isLoading && (
            <Card className="p-8 text-center bg-red-50 border-red-100 text-red-600 rounded-2xl">
              <AlertCircle className="h-10 w-10 mx-auto mb-4 opacity-50" />
              <p className="font-bold text-lg">{error}</p>
              <p className="text-sm mt-1 opacity-80 font-medium">Controleer of de backend API actief is op {API_URL}.</p>
            </Card>
          )}

          {!isLoading && !error && gefilterdeMeldingen.length === 0 && (
            <div className="py-20 text-center bg-white border border-dashed border-slate-300 rounded-3xl">
              <p className="text-slate-400 font-bold text-lg">Geen meldingen gevonden voor "{actieveFilter}"</p>
            </div>
          )}

          {!isLoading && !error && gefilterdeMeldingen.map((melding) => (
            <Card key={melding.id} className="p-5 sm:p-6 bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-slate-200 rounded-2xl relative overflow-hidden group">
              {/* Type Indicator Line */}
              <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                melding.type === 'Facilitair' ? 'bg-blue-500' :
                melding.type === 'MIC' ? 'bg-red-500' :
                'bg-purple-500'
              }`} />

              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      melding.type === 'Facilitair' ? 'bg-blue-50 text-blue-600' :
                      melding.type === 'MIC' ? 'bg-red-50 text-red-600' :
                      'bg-purple-50 text-purple-600'
                    }`}>
                      {melding.type}
                    </span>
                    <h3 className="font-extrabold text-lg text-slate-800">{melding.categorie}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold bg-slate-50 px-2 py-1 rounded-lg">
                    <Clock className="h-3 w-3" />
                    {melding.datum ? new Date(melding.datum).toLocaleDateString('nl-NL') : 'Vandaag'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {melding.betrokkene && (
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-100/50 px-3 py-2 rounded-xl border border-slate-100">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{melding.betrokkene}</span>
                    </div>
                  )}
                  {melding.locatie && (
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-100/50 px-3 py-2 rounded-xl border border-slate-100">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{melding.locatie}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base bg-slate-50/30 p-3 rounded-xl italic border border-slate-50">
                  "{melding.beschrijving}"
                </p>

                {melding.isSpoed && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 w-fit px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter animate-pulse">
                    <AlertCircle className="h-3 w-3" />
                    Spoedmelding
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}