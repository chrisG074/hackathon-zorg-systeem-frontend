import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input'; // Toegevoegd voor consistentie
import { Label } from '../components/ui/label'; // Toegevoegd voor consistentie
import { Card } from '../components/ui/card';
import { Building2, UserPlus, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react'; // Toegevoegd voor animaties

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
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textContent = await response.text();
        console.error("Server antwoordde niet met JSON. Ruwe antwoord:", textContent);
        throw new Error(`Serverfout (${response.status}): De backend crasht mogelijk. Bekijk de F12 console voor de ruwe HTML/tekst.`);
      }

      if (response.ok) {
        toast.success('Account succesvol aangemaakt! Je kunt nu inloggen.');
        navigate('/login');
      } else {
        throw new Error(data.message || 'Er is iets misgegaan bij het registreren (Geen specifieke backend message).');
      }
    } catch (error) {
      console.error("Volledige error:", error);
      toast.error(error.message || 'Kan de server niet bereiken. Controleer of de backend draait.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtiele achtergrond decoratie (hetzelfde als inlog) */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-400/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-6 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">SoftZorg</h1>
            <p className="text-slate-500 font-medium">Zorg Management Systeem</p>
          </div>
        </div>

        <Card className="w-full p-8 shadow-2xl border-slate-100 rounded-3xl bg-white/80 backdrop-blur-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Nieuw Account</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Maak een verpleegkundig account aan
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2.5">
              <Label className="text-slate-700 font-bold ml-1">E-mailadres</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="email" 
                  required
                  className="pl-12 h-12 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white transition-all text-base"
                  placeholder="naam@zorg.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2.5">
              <Label className="text-slate-700 font-bold ml-1">Wachtwoord</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="password" 
                  required
                  className="pl-12 h-12 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white transition-all text-base"
                  placeholder="Minimaal 6 tekens"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="text-xs text-slate-400 ml-1 font-medium mt-1">Minimaal 1 hoofdletter en 1 cijfer vereist.</p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Bezig met aanmaken...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Account Aanmaken
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm">
            <span className="text-slate-500 font-medium">Al een account? </span>
            <button 
              onClick={() => navigate('/login')}
              className="text-primary font-bold hover:text-blue-700 transition-colors"
            >
              Log in
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}