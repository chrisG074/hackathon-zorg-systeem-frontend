import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Building2, LogOut, List, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Standaard nav-items (zichtbaar voor iedereen)
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  // Alleen toevoegen als de gebruiker een Admin is
  if (isAdmin) {
    navItems.push({ name: 'Overzicht', path: '/overzicht', icon: List });
  }

  return (
    <nav className="bg-primary shadow-lg border-b border-primary-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Building2 className="h-8 w-8 text-primary-foreground" />
              <span className="ml-3 text-xl font-bold text-primary-foreground tracking-tight">SoftZorg</span>
            </div>
            
            <div className="hidden md:ml-8 md:flex md:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`flex items-center ${isActive ? "bg-white text-primary" : "text-primary-foreground hover:bg-primary-foreground/10"}`}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right mr-4 border-r border-primary-foreground/20 pr-4">
              <p className="text-xs font-medium text-primary-foreground/70 uppercase tracking-wider">Ingelogd als</p>
              <p className="text-sm font-bold text-primary-foreground">{userName}</p>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white border-none"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Uitloggen
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}