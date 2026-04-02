import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Building2, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react'; // Toegevoegd voor animaties

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
        localStorage.setItem('userRoles', JSON.stringify(data.roles)); 
        toast.success('Succesvol ingelogd');
        navigate('/dashboard');
      } else {
        setError(data.message || 'E-mail of wachtwoord onjuist');
      }
    } catch (err) {
      setError('Kan de server niet bereiken. Controleer je internetverbinding of de live backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4 relative overflow-hidden">
      {/* Subtiele achtergrond decoratie */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="w-full p-8 shadow-2xl border-slate-100 rounded-3xl bg-white/80 backdrop-blur-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary/10 p-4 rounded-3xl mb-5 shadow-inner">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">SIMO</h1>
            <p className="text-slate-500 mt-2 text-center font-medium">Log in op het zorgportaal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="bg-destructive/10 text-destructive p-4 rounded-2xl flex items-start gap-3 text-sm border border-destructive/20"
              >
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{error}</p>
              </motion.div>
            )}
            
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-slate-700 font-bold ml-1">E-mailadres</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  id="email"
                  type="email" 
                  placeholder="naam@zorg.nl" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white transition-all text-base"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-slate-700 font-bold ml-1">Wachtwoord</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white transition-all text-base"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Bezig met inloggen...
                </>
              ) : (
                'Inloggen'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm">
            <span className="text-slate-500 font-medium">Nog geen account? </span>
            <button 
              type="button"
              onClick={() => navigate('/register')}
              className="text-primary font-bold hover:text-blue-700 transition-colors"
            >
              Registreer hier
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-slate-400 font-medium">
            <p>Problemen met inloggen? Neem contact op met IT support.</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}