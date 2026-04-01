import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
// Let op: Building2 is hier verwijderd uit de imports
import { LogOut, List, LayoutDashboard, Menu, X, User } from 'lucide-react';
import { toast } from 'sonner';
import simoLogo from '../assets/SIMO-logo.png'; // Het nieuwe logo geïmporteerd

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userEmail = localStorage.getItem('userEmail') || 'gebruiker@zorg.nl';
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  const isAdmin = userRoles.includes('Admin');
  
  const userName = userEmail
    .split('@')[0]
    .split('.')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('token');
    toast.success('Succesvol uitgelogd');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Overzicht', path: '/overzicht', icon: List });
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-primary shadow-lg border-b border-primary-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Hier is het nieuwe logo geplaatst */}
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer group py-2" 
              onClick={() => handleNavigation('/dashboard')}
            >
              <img 
                src={simoLogo} 
                alt="SIMO Logo" 
                className="h-9 sm:h-11 w-auto group-hover:opacity-80 transition-opacity drop-shadow-sm" 
              />
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex space-x-2 mr-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`flex items-center rounded-xl transition-all ${
                      isActive 
                        ? "bg-white text-primary shadow-sm" 
                        : "text-primary-foreground hover:bg-primary-foreground/10 hover:text-white"
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center border-l border-primary-foreground/20 pl-6 space-x-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-primary-foreground/70 uppercase tracking-wider">Ingelogd als</p>
                <p className="text-sm font-semibold text-primary-foreground flex items-center gap-2">
                  <User className="h-3 w-3" />
                  {userName}
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleLogout}
                className="bg-red-500/90 hover:bg-red-600 text-white border-none rounded-xl shadow-sm"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Uitloggen</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10 absolute w-full shadow-2xl transition-all duration-300 ease-in-out">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`flex items-center justify-start w-full rounded-xl h-14 text-base ${
                      isActive 
                        ? "bg-white text-primary font-bold shadow-sm" 
                        : "text-primary-foreground hover:bg-primary-foreground/10"
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Button>
                );
              })}
            </div>

            <div className="border-t border-primary-foreground/20 pt-4 mt-4">
              <div className="flex items-center px-2 mb-4">
                <div className="bg-primary-foreground/10 p-3 rounded-full mr-4">
                  <User className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-primary-foreground/70 uppercase">Ingelogd als</p>
                  <p className="text-lg font-bold text-primary-foreground">{userName}</p>
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full justify-start bg-red-500/90 hover:bg-red-600 text-white rounded-xl h-14 text-base"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Uitloggen
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}