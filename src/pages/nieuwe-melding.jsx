import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Mic, Send, AlertTriangle, UserCog, Wrench, Shield, BotMessageSquare } from 'lucide-react';

export default function NieuweMelding() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  
  const simoActions = [
    { name: 'MIC Melding', description: 'Incidenten rondom de cliënt', icon: AlertTriangle, color: 'text-red-700', bg: 'bg-red-50', path: '/conversatie/mic' },
    { name: 'MIM Melding', description: 'Incidenten met medewerkers', icon: UserCog, color: 'text-purple-700', bg: 'bg-purple-50', path: '/conversatie/mim' },
    { name: 'Facilitair', description: 'Defecten, reparaties & middelen', icon: Wrench, color: 'text-blue-700', bg: 'bg-blue-50', path: '/conversatie/facilitair' },
    { name: 'Beveiliging', description: 'Onveilige situaties of inbreuk', icon: Shield, color: 'text-orange-700', bg: 'bg-orange-50', path: '/conversatie/beveiliging' },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen pb-12">
      <div className="bg-white border-b border-slate-200 w-full px-6 md:px-10 py-6 shadow-sm mb-6 sticky top-16 z-40">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')} className="shrink-0 rounded-full hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <div className="bg-primary-foreground/10 p-2 rounded-lg text-primary">
                <BotMessageSquare className="h-6 w-6" />
              </div>
              Slimme Assistent (SIMO)
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full px-6 md:px-10 space-y-10">
        <div className="w-full space-y-8">
          {/* User Message */}
          <div className="flex items-start gap-4">
            <img src="https://avatar.vercel.sh/joost-medewerker.png?u=user&s=128" alt="User" className="w-12 h-12 rounded-full border border-slate-200" />
            <div>
              <div className="font-bold text-slate-900">Joost <span className="text-sm font-normal text-slate-500">(Medewerker)</span></div>
              <Card className="p-5 mt-2 rounded-2xl rounded-tl-none bg-blue-600 text-white max-w-2xl font-medium leading-relaxed shadow-lg">
                Hoi SIMO, ik sta hier in appartement 212 en de bewoner vertelde dat de thermostaat van de verwarming kapot is. Het is nogal fris in de kamer.
              </Card>
            </div>
          </div>

          {/* SIMO Message 1 */}
          <div className="flex items-start gap-4 justify-end">
            <div>
              <div className="font-bold text-slate-900 text-right">SIMO <span className="text-sm font-normal text-slate-500">(Assistent)</span></div>
              <Card className="p-5 mt-2 rounded-2xl rounded-tr-none bg-white text-slate-800 max-w-2xl font-medium leading-relaxed shadow-lg border border-slate-100">
                Dag Joost! Dat klinkt niet fijn voor de bewoner. Bedankt voor het doorgeven, ik kan je helpen om deze melding snel op te pakken.
              </Card>
            </div>
            <div className="bg-primary p-3 rounded-full text-white shrink-0 shadow-md">
                <BotMessageSquare className="h-6 w-6" />
            </div>
          </div>

          {/* SIMO Message 2 (Fixed Actions) */}
          <div className="flex items-start gap-4 justify-end">
            <div>
              <Card className="p-6 mt-2 rounded-2xl rounded-tr-none bg-white text-slate-800 max-w-3xl font-medium leading-relaxed shadow-lg border border-slate-100">
                <p>Aan de hand van je verhaal lijkt het te gaan om een facilitaire melding. Ik zal de locatie (appartement 212) en de details over de kapotte thermostaat alvast voor je invullen in het formulier.</p>
                
                <p className="mt-4 mb-5">Bevestig hieronder de categorie of kies een andere:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {simoActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={action.name}
                        variant="ghost"
                        className={`group h-24 rounded-2xl border ${action.bg} hover:border-slate-300 w-full p-4 flex flex-row items-center justify-start gap-4 transition-all duration-200`}
                        onClick={() => navigate(action.path)}
                      >
                        <div className={`p-3 rounded-xl bg-white border border-slate-100 ${action.color} group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <div className={`font-bold text-lg ${action.color}`}>{action.name}</div>
                          <p className="text-slate-500 font-medium text-xs mt-1">{action.description}</p>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </Card>
            </div>
             <div className="bg-primary p-3 rounded-full text-white shrink-0 shadow-md">
                <BotMessageSquare className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 w-full bg-slate-50/90 backdrop-blur-sm border-t border-slate-200 p-4 z-40">
          <div className="w-full px-6 md:px-10 flex items-center gap-3">
            <Button size="icon" variant="outline" className="rounded-full h-12 w-12 bg-white shrink-0 hover:bg-slate-100">
                <Mic className="h-5 w-5 text-slate-500" />
            </Button>
            <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type hier je vraag of vertel wat er aan de hand is..." 
                className="flex-1 px-5 h-12 rounded-full bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
            />
            <Button size="lg" className="h-12 rounded-full px-7 font-bold shadow-lg">
                <Send className="h-5 w-5 mr-2" />
                Verstuur
            </Button>
          </div>
        </div>
        <div className="h-24"></div> {/* Bottom padding for sticky input */}
      </div>
    </div>
  );
}