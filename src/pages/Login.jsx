import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Building2, Lock, Mail, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5258/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('roles', JSON.stringify(data.roles));
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isAuthenticated', 'true');
        
        toast.success('Succesvol ingelogd!');
        navigate('/dashboard'); 
      } else {
        setError(data.message || 'E-mailadres of wachtwoord is onjuist.');
      }
    } catch (err) {
      setError('Kan de server niet bereiken. Controleer of de backend draait.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4 shadow-lg">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Voice-First Rapportage
          </h1>
          <p className="text-slate-300">
            Zorg Management Systeem
          </p>
        </div>

        <Card className="p-8 shadow-2xl border-slate-700">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-card-foreground">
                E-mailadres
              </Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="medewerker@zorginstelling.nl"
                  className="pl-11 h-12 bg-input-background border-border"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-card-foreground">
                Wachtwoord
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-11 h-12 bg-input-background border-border"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Inloggen...' : 'Inloggen'}
            </Button>
          </form>

          {/* Hier zit de nieuwe navigatie naar registreren! */}
          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              Wachtwoord vergeten?{' '}
              <button className="text-primary hover:underline font-medium">
                Herstel account
              </button>
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Nog geen account?{' '}
              <button 
                type="button"
                onClick={() => navigate('/register')}
                className="text-primary hover:underline font-medium"
              >
                Registreer hier
              </button>
            </p>
          </div>
        </Card>

        <p className="text-center text-slate-400 text-sm mt-8">
          © 2026 Voice-First Rapportage. Alle rechten voorbehouden.
        </p>
      </div>
    </div>
  );
}