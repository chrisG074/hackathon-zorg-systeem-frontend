import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Filter, ArrowLeft, User, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Overzicht() {
  const navigate = useNavigate();
  const [actieveFilter, setActieveFilter] = useState('Alle');
  
  // Nieuwe states voor het ophalen van data uit de database
  const [meldingen, setMeldingen] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Zodra de pagina laadt, haal data op uit de .NET backend
  useEffect(() => {
    const fetchMeldingen = async () => {
      try {
        const response = await fetch('http://localhost:5258/api/meldingen'); 
        
        if (!response.ok) {
          throw new Error('Kon de meldingen niet ophalen van de server.');
        }
        
        const data = await response.json();
        setMeldingen(data); // Zet de database data in onze state
      } catch (err) {
        console.error("Fout bij ophalen database:", err);
        setError("Er is een probleem met de verbinding naar de database.");
      } finally {
        setIsLoading(false); // Het laden is klaar, of het nu gelukt is of niet
      }
    };

    fetchMeldingen();
  }, []);

  // Filter logica gebruikt nu de 'meldingen' uit de database
  const gefilterdeMeldingen = actieveFilter === 'Alle' 
    ? meldingen 
    : meldingen.filter(melding => melding.type === actieveFilter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 space-y-8 mt-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Alle Meldingen
            </h2>
            <p className="text-muted-foreground">Bekijk en filter alle rapportages uit de database</p>
          </div>
        </div>

        {/* Filter Sectie */}
        <Card className="p-4 bg-card flex items-center gap-4 flex-wrap shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mr-2">
            <Filter className="h-5 w-5" />
            <span className="font-semibold hidden sm:inline">Filter op:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['Alle', 'Facilitair', 'MIC', 'MIM'].map((filterType) => (
              <Button
                key={filterType}
                variant={actieveFilter === filterType ? 'default' : 'outline'}
                onClick={() => setActieveFilter(filterType)}
                className="rounded-full"
                size="sm"
              >
                {filterType}
              </Button>
            ))}
          </div>
        </Card>

        {/* Status Weergave (Laden, Error, of Data) */}
        <div className="grid gap-4">
          {isLoading && (
            <Card className="p-12 text-center bg-card flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p className="font-medium">Meldingen ophalen uit de database...</p>
            </Card>
          )}

          {error && !isLoading && (
            <Card className="p-12 text-center bg-destructive/10 border-destructive/20 text-destructive">
              <AlertCircle className="h-8 w-8 mx-auto mb-4" />
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-2 opacity-80">Check of de C# .NET Backend lokaal draait.</p>
            </Card>
          )}

          {!isLoading && !error && gefilterdeMeldingen.length === 0 && (
            <Card className="p-12 text-center bg-card">
              <p className="text-muted-foreground font-medium">De database is momenteel leeg. Er zijn nog geen meldingen ingediend.</p>
            </Card>
          )}

          {!isLoading && !error && gefilterdeMeldingen.map((melding) => (
            <Card key={melding.id} className="p-6 bg-card hover:shadow-md transition-shadow border-l-4 border-l-primary">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
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
                {/* Zorg dat je backend een 'datum' string of 'createdAt' timestamp terugstuurt */}
                <span className="text-sm text-muted-foreground">{melding.datum || new Date().toLocaleDateString('nl-NL')}</span>
              </div>
              
              {melding.betrokkene && (
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/90 mb-2 bg-muted/50 w-fit px-2 py-1 rounded-md">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{melding.betrokkene}</span>
                </div>
              )}
              
              <p className="text-foreground/80 mt-2">{melding.beschrijving}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}