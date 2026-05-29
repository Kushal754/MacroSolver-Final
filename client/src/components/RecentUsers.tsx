// 1. Importamos los iconos y los hooks (para simular carga)
import { useState, useEffect } from 'react';
import { Users, UserCircle, Target, ChevronRight } from 'lucide-react';

// 2. Definimos la interfaz del usuario (Req #6 - Tipeado)
interface RecentUser {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  macrosMet: number;
}

function RecentUsers() {
  // --- GESTIÓN DE DATOS SIMULADA (Mock API) ---
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulamos una llamada a la API con un ligero retraso
    const fetchRecentUsers = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Carga rápida
      
      // 3. Datos de ejemplo idénticos a v0
      const mockUsers: RecentUser[] = [
        { id: '1', name: 'Alba García', email: 'alba.garcia@ macrosolver.com', joinedDate: '2 days ago', macrosMet: 85 },
        { id: '2', name: 'Javier Pérez', email: 'javier.perez@ macrosolver.com', joinedDate: '4 days ago', macrosMet: 92 },
        { id: '3', name: 'Marta Sanz', email: 'marta.sanz@ macrosolver.com', joinedDate: '1 week ago', macrosMet: 78 },
        { id: '4', name: 'David López', email: 'david.lopez@ macrosolver.com', joinedDate: '10 days ago', macrosMet: 88 },
        { id: '5', name: 'Laura Ruíz', email: 'laura.ruiz@ macrosolver.com', joinedDate: '2 weeks ago', macrosMet: 95 },
      ];
      setUsers(mockUsers);
      setIsLoading(false);
    };
    fetchRecentUsers();
  }, []);

  return (
    // CONTENEDOR DE LA TARJETA DE USUARIOS: bg-card, border-border, shadow-sm
    <div className="bg-card border border-border p-8 rounded-2xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold">Recent Users</h3>
        <div className="p-2.5 rounded-xl bg-secondary text-primary">
          <Users className="h-6 w-6" />
        </div>
      </div>
      
      {/* 4. Lista de usuarios */}
      <div className="flex-1 space-y-5">
        {isLoading ? (
          // Placeholder de carga (Skeleton)
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 bg-secondary rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="w-32 h-4 bg-secondary rounded" />
                <div className="w-48 h-3 bg-secondary rounded" />
              </div>
            </div>
          ))
        ) : (
          // Usuarios reales (Mismo diseño de v0)
          users.map((user) => (
            <div key={user.id} className="flex items-center gap-4 p-2 hover:bg-secondary/40 rounded-xl transition-colors">
              <UserCircle className="h-12 w-12 text-muted-foreground/60" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg truncate">{user.name}</p>
                <p className="text-base text-muted-foreground truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground/80 mt-0.5">joined {user.joinedDate}</p>
              </div>
              <div className="flex items-center gap-2 text-sky-500">
                 <Target className="h-5 w-5" />
                 <span className="font-bold text-lg">{user.macrosMet}%</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentUsers;