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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5258';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRoles', JSON.stringify(data.roles)); // Sla de rollen op
        toast.success('Succesvol ingelogd');
        navigate('/dashboard');
      } else {
        setError(data.message || 'E-mail of wachtwoord onjuist');
      }
    } catch (err) {
      setError('Server onbereikbaar op poort 5258');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-primary">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-3 rounded-2xl mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">SoftZorg</h1>
          <p className="text-slate-500 mt-2">Log in op uw zorgomgeving</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="naam@zorg.nl"
                className="pl-10 h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Wachtwoord</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <Button type="submit" className="w-full h-12" disabled={isLoading}>
            {isLoading ? 'Inloggen...' : 'Inloggen'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Nog geen account?{' '}
              <button onClick={() => navigate('/register')} className="text-primary hover:underline font-medium">
                Registreer hier
              </button>
            </p>
        </div>
      </Card>
    </div>
  );
}