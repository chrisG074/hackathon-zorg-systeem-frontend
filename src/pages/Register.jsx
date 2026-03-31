import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Building2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5258';

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        throw new Error("Ongeldig antwoord van de server.");
      }

      if (response.ok) {
        toast.success('Account succesvol aangemaakt! Je kunt nu inloggen.');
        navigate('/login');
      } else {
        // Toon de specifieke error (zoals wachtwoord vereisten) uit de backend
        toast.error(data.message || 'Er is iets misgegaan bij het registreren.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Kan de server niet bereiken. Controleer of de backend draait.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center flex flex-col items-center gap-3">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Building2 className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">SoftZorg</h1>
          <p className="text-muted-foreground">Zorg Management Systeem</p>
        </div>
      </div>

      <Card className="w-full max-w-md p-8 shadow-2xl border-primary/20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Nieuw Account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Maak een verpleegkundig account aan
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">E-mailadres</label>
            <input 
              type="email" 
              required
              className="w-full p-3 rounded-md border bg-background"
              placeholder="naam@zorg.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Wachtwoord</label>
            <input 
              type="password" 
              required
              className="w-full p-3 rounded-md border bg-background"
              placeholder="Minimaal 6 tekens, 1 hoofdletter, 1 cijfer"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold mt-4"
            disabled={loading}
          >
            <UserPlus className="h-5 w-5 mr-2" />
            {loading ? 'Bezig met aanmaken...' : 'Account Aanmaken'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Al een account? </span>
          <button 
            onClick={() => navigate('/login')}
            className="text-primary font-semibold hover:underline"
          >
            Log in
          </button>
        </div>
      </Card>
    </div>
  );
}