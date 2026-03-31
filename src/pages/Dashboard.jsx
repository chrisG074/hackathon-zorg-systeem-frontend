import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Mic, Wrench, AlertCircle, User } from 'lucide-react';
import Header from '../components/header';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'gebruiker@zorg.nl';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    toast.success('Succesvol uitgelogd');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header navigate={navigate} userEmail={userEmail} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Dashboard Overzicht
          </h2>
        </div>

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