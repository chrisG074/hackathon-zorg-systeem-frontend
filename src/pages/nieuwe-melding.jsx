import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Wrench, AlertCircle, User, ArrowLeft } from 'lucide-react';

export default function ReportTypeSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar dashboard
        </Button>

        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Nieuwe Melding</h1>
          <p className="text-muted-foreground text-lg">Kies het type melding</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <Card
            className="p-8 cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-primary bg-card hover:scale-105"
            onClick={() => navigate('/conversatie/facilitair')}
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-24 h-24 bg-accent/20 rounded-xl flex items-center justify-center">
                <Wrench className="h-12 w-12 text-accent" />
              </div>
              <h3 className="font-bold text-2xl text-card-foreground">Facilitair</h3>
              <p className="text-muted-foreground">
                Meld storingen, defecte hulpmiddelen en technische problemen
              </p>
              <div className="pt-4 space-y-2 text-sm text-muted-foreground text-left border-t border-border">
                <p>• Hoog-laag bed</p>
                <p>• Tillift</p>
                <p>• Rolstoel</p>
                <p>• Douchetoilet</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-8 cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-primary bg-card hover:scale-105"
            onClick={() => navigate('/conversatie/mic')}
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-24 h-24 bg-destructive/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <h3 className="font-bold text-2xl text-card-foreground">MIC</h3>
              <p className="text-muted-foreground">
                Meld incidenten met cliënten zoals vallen, verwondingen
              </p>
              <div className="pt-4 space-y-2 text-sm text-muted-foreground text-left border-t border-border">
                <p>• Valpartij</p>
                <p>• Verwonding</p>
                <p>• Medicatie incident</p>
                <p>• Gezondheidsprobleem</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-8 cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-primary bg-card hover:scale-105"
            onClick={() => navigate('/conversatie/mim')}
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-24 h-24 bg-secondary/20 rounded-xl flex items-center justify-center">
                <User className="h-12 w-12 text-secondary" />
              </div>
              <h3 className="font-bold text-2xl text-card-foreground">MIM</h3>
              <p className="text-muted-foreground">
                Meld incidenten met medewerkers zoals agressie, overbelasting
              </p>
              <div className="pt-4 space-y-2 text-sm text-muted-foreground text-left border-t border-border">
                <p>• Agressie</p>
                <p>• Valpartij</p>
                <p>• Prikincident</p>
                <p>• Overbelasting</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}