import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ShieldAlert, UserCog } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5258';

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/users`, { 
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error('Kan gebruikers niet ophalen. Ben je wel Admin?');
      }
    } catch (error) {
      toast.error('Netwerkfout bij ophalen gebruikers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/users/${userId}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        toast.success(`Rol succesvol gewijzigd naar ${newRole}`);
        fetchUsers();
      } else {
        toast.error('Fout bij wijzigen rol.');
      }
    } catch (error) {
      toast.error('Netwerkfout bij wijzigen rol.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Laden...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold text-foreground">Admin Paneel</h2>
      </div>

      <div className="grid gap-4">
        {users.map(user => (
          <Card key={user.id} className="p-4 flex justify-between items-center bg-card">
            <div className="flex items-center gap-4">
              <UserCog className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-semibold">{user.email}</p>
                <p className="text-sm text-muted-foreground">Huidige rol: {user.roles.join(', ') || 'Geen'}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={user.roles.includes('Admin') ? "default" : "outline"}
                onClick={() => handleRoleChange(user.id, 'Admin')}
              >
                Maak Admin
              </Button>
              <Button 
                variant={user.roles.includes('Verpleegkundige') ? "default" : "outline"}
                onClick={() => handleRoleChange(user.id, 'Verpleegkundige')}
              >
                Maak Verpleegkundige
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}