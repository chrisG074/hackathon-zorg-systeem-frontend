import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Mic, Wrench, AlertCircle, User, Phone } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 23 || currentHour < 7;
  const userEmail = localStorage.getItem('userEmail') || 'gebruiker@zorg.nl';

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-7xl mx-auto p-6 space-y-8 mt-4">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Dashboard Overzicht
          </h2>
          <p className="text-muted-foreground">Tel: 06-12345678 | Snelle acties voor {userEmail}</p>
        </div>

        {/* Night Time Alert */}
        {isNightTime && (
          <Card className="p-6 bg-destructive/10 border-destructive/30 shadow-lg">
            <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
              <div className="p-3 bg-destructive/20 rounded-lg">
                <Phone className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-destructive">Nachtprotocol actief</h3>
                <p className="text-sm text-destructive/80">
                  Voor spoedeisende zaken, bel direct de Zorgcentrale
                </p>
              </div>
              <Button
                size="lg"
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold w-full sm:w-auto mt-4 sm:mt-0"
                onClick={() => window.open('tel:0534603500')}
              >
                Bel 053-460 3500
              </Button>
            </div>
          </Card>
        )}

        {/* Main Action Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="h-32 w-full max-w-md text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all"
            onClick={() => navigate('/nieuwe-melding')}
          >
            <Mic className="h-8 w-8 mr-3" />
            Nieuwe Melding Starten
          </Button>
        </div>

        {/* Quick Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card
            className="p-8 cursor-pointer hover:shadow-xl transition-all border-2 hover:border-primary bg-card group"
            onClick={() => navigate('/conversatie/facilitair')}
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-accent/20 rounded-xl flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <Wrench className="h-10 w-10 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-card-foreground">Facilitair</h3>
                <p className="text-sm text-muted-foreground mt-1">Storingen & Hulpmiddelen</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-8 cursor-pointer hover:shadow-xl transition-all border-2 hover:border-primary bg-card group"
            onClick={() => navigate('/conversatie/mic')}
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-destructive/20 rounded-xl flex items-center justify-center group-hover:bg-destructive/30 transition-colors">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-card-foreground">MIC</h3>
                <p className="text-sm text-muted-foreground mt-1">Incidenten Cliënt</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-8 cursor-pointer hover:shadow-xl transition-all border-2 hover:border-primary bg-card group"
            onClick={() => navigate('/conversatie/mim')}
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-secondary/20 rounded-xl flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                <User className="h-10 w-10 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-card-foreground">MIM</h3>
                <p className="text-sm text-muted-foreground mt-1">Incidenten Medewerker</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}