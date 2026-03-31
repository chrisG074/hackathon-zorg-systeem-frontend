import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { Building2, LogOut, Filter, ArrowLeft, User } from 'lucide-react';
// import ReportCard from '../components/ReportCard'; // Zorg dat deze import klopt als je deze later gebruikt

// Tijdelijke Dummy Data (vervang dit later door een fetch call naar je backend)
const MOCK_MELDINGEN = [
  { id: 1, type: 'Facilitair', categorie: 'Kapot bed', beschrijving: 'Het bed op kamer 104 gaat niet meer omhoog.', datum: '2026-03-31', betrokkene: 'Kamer 104' },
  { id: 2, type: 'MIC', categorie: 'Valincident', beschrijving: 'Mevrouw de Vries is gevallen in de badkamer.', datum: '2026-03-31', betrokkene: 'Mevr. de Vries' },
  { id: 3, type: 'MIM', categorie: 'Agressie', beschrijving: 'Bewoner was verbaal agressief tijdens medicatie ronde.', datum: '2026-03-30', betrokkene: 'Dhr. Pietersen' },
  { id: 4, type: 'Facilitair', categorie: 'Lekkage', beschrijving: 'Kraan drupt op de tweede verdieping.', datum: '2026-03-30', betrokkene: '2e Verdieping' },
];

export default function Overzicht() {
  const navigate = useNavigate();
  const [actieveFilter, setActieveFilter] = useState('Alle');
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    toast.success('Succesvol uitgelogd');
    navigate('/login');
  };

  // Filter logica
  const gefilterdeMeldingen = actieveFilter === 'Alle' 
    ? MOCK_MELDINGEN 
    : MOCK_MELDINGEN.filter(melding => melding.type === actieveFilter);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar (Identiek aan dashboard voor consistentie) */}
      <nav className="bg-primary shadow-lg border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary-foreground">
                  Voice-First Rapportage
                </h1>
                <p className="text-xs text-primary-foreground/70">
                  Zorg Management Systeem
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Uitloggen
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Alle Meldingen
            </h2>
            <p className="text-muted-foreground">Bekijk en filter alle rapportages</p>
          </div>
        </div>

        {/* Filter Sectie */}
        <Card className="p-4 bg-card flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-muted-foreground mr-4">
            <Filter className="h-5 w-5" />
            <span className="font-semibold">Filter op:</span>
          </div>
          
          {['Alle', 'Facilitair', 'MIC', 'MIM'].map((filterType) => (
            <Button
              key={filterType}
              variant={actieveFilter === filterType ? 'default' : 'outline'}
              onClick={() => setActieveFilter(filterType)}
              className="rounded-full"
            >
              {filterType}
            </Button>
          ))}
        </Card>

        {/* Lijst met Meldingen */}
        <div className="grid gap-4">
          {gefilterdeMeldingen.length === 0 ? (
            <Card className="p-12 text-center bg-card">
              <p className="text-muted-foreground font-medium">Geen meldingen gevonden voor deze filter.</p>
            </Card>
          ) : (
            gefilterdeMeldingen.map((melding) => (
              <Card key={melding.id} className="p-6 bg-card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      melding.type === 'Facilitair' ? 'bg-accent/20 text-accent' :
                      melding.type === 'MIC' ? 'bg-destructive/20 text-destructive' :
                      'bg-secondary/20 text-secondary'
                    }`}>
                      {melding.type}
                    </span>
                    <h3 className="font-bold text-lg">{melding.categorie}</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{melding.datum}</span>
                </div>
                
                {/* NIEUW: Weergave van de betrokken persoon/locatie */}
                {melding.betrokkene && (
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground/90 mb-2 bg-muted/50 w-fit px-2 py-1 rounded-md">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{melding.betrokkene}</span>
                  </div>
                )}
                
                <p className="text-foreground/80 mt-2">{melding.beschrijving}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}