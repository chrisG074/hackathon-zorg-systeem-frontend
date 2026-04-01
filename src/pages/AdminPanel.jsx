import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ShieldAlert, UserCog } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      // POORT AANGEPAST NAAR 5258
      const response = await fetch('http://localhost:5258/api/auth/users', { 
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
      // POORT AANGEPAST NAAR 5258
      const response = await fetch(`http://localhost:5258/api/auth/users/${userId}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        toast.success(`Rol succesvol gewijzigd naar ${newRole}`);
        fetchUsers(); // Refresh the list
      } else {
        toast.error('Fout bij het wijzigen van de rol.');
      }
    } catch (error) {
      toast.error('Netwerkfout bij het updaten van de rol.');
    }
  };

  if (loading) return <div className="p-8 text-center">Laden...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Paneel - Gebruikersbeheer</h1>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-primary/20">
                <th className="p-3 font-semibold">E-mailadres</th>
                <th className="p-3 font-semibold">Huidige Rol</th>
                <th className="p-3 font-semibold text-right">Acties</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'Admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {user.role === 'Verpleegkundige' ? (
                      <Button size="sm" variant="destructive" onClick={() => handleRoleChange(user.id, 'Admin')}>
                        Maak Admin
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleRoleChange(user.id, 'Verpleegkundige')}>
                        Maak Verpleegkundige
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}