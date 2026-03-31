import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Building2, LogOut, List, LayoutDashboard, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Haal de email op, of gebruik een fallback
  const userEmail = localStorage.getItem('userEmail') || 'gebruiker@zorg.nl';
  
  // Maak dynamisch een naam van de email (bijv: jan.smit@zorg.nl -> Jan Smit)
  const userName = userEmail
    .split('@')[0]
    .split('.')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    toast.success('Succesvol uitgelogd');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Overzicht', path: '/overzicht', icon: List },
  ];

  return (
    <nav className="bg-primary shadow-lg border-b border-primary/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-foreground leading-tight">
                Voice-First Rapportage
              </h1>
              <p className="text-xs text-primary-foreground/70 hidden sm:block">
                Zorg Management Systeem
              </p>
            </div>
          </div>

          {/* Desktop Menu (verbergt op kleine schermen) */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => navigate(item.path)}
                    className={isActive ? "" : "text-primary-foreground hover:bg-primary-foreground/10"}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                );
              })}
            </div>

            <div className="h-8 w-px bg-primary-foreground/20" /> {/* Visuele scheiderlijn */}

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-primary-foreground">
                  {userName}
                </p>
                <p className="text-xs text-primary-foreground/70">
                  {userEmail}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-primary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                title="Uitloggen"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Hamburger Menu Knop (alleen zichtbaar op mobiel) */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobiel Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10 pb-4 pt-2 px-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="space-y-1 mb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActive ? "" : "text-primary-foreground hover:bg-primary-foreground/10"}`}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false); // Sluit menu na klikken
                  }}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Button>
              );
            })}
          </div>
          
          <div className="pt-4 border-t border-primary-foreground/10">
            <div className="mb-4 px-2">
              <p className="text-sm font-semibold text-primary-foreground">
                {userName}
              </p>
              <p className="text-xs text-primary-foreground/70">
                {userEmail}
              </p>
            </div>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Uitloggen
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}