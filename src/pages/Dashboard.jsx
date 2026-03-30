import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ReportCard } from '../components/ReportCard';
import { Mic, Wrench, AlertCircle, User, Phone, LogOut, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 23 || currentHour < 7;
  const userEmail = localStorage.getItem('userEmail') || 'gebruiker@zorg.nl';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    toast.success('Succesvol uitgelogd');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="bg-primary shadow-lg border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-primary-foreground">
                  Iris van Lies
                </p>
                <p className="text-xs text-primary-foreground/70">
                  Verpleging Oost
                </p>
              </div>
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
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Dashboard Overzicht
          </h2>
          <p className="text-muted-foreground">Tel: 06-12345678 | {userEmail}</p>
        </div>

        {/* Night Time Alert */}
        {isNightTime && (
          <Card className="p-6 bg-destructive/10 border-destructive/30 shadow-lg">
            <div className="flex items-center gap-4">
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
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
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
            Nieuwe Melding
          </Button>
        </div>

        {/* Quick Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card
            className="p-8 cursor-pointer hover:shadow-xl transition-all border-2 hover:border-primary bg-card group"
            onClick={() => navigate('/nieuwe-melding/facilitair')}
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
            onClick={() => navigate('/nieuwe-melding/mic')}
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
            onClick={() => navigate('/nieuwe-melding/mim')}
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

        {/* Recent Reports */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Mijn recente meldingen</h2>
            <Button variant="outline" size="sm" className="font-semibold">
              Alle meldingen
            </Button>
          </div>
          <div className="space-y-3">
              <Card className="p-12 text-center bg-card">
                <div className="text-muted-foreground space-y-2">
                  <AlertCircle className="h-12 w-12 mx-auto opacity-50" />
                  <p className="font-medium">Nog geen meldingen</p>
                  <p className="text-sm">Begin met het indienen van je eerste melding</p>
                </div>
              </Card>
            {/* ) : (
              recentReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}