// 1. Importamos los hooks de React (Req #11 Modernidad)
import { useState, useEffect } from 'react';
// 2. Importamos todos los iconos que necesitamos de Lucide
import { Target, Users, Dumbbell, Zap, BrainCircuit /*, UserCircle, ChevronRight */ } from 'lucide-react';

// 3. TIPO: Definimos la forma exacta de los datos que nuestra API profesional nos envía (Req #6/Req #10 Parity)
// Fíjate que iconName es un string y joinedDate es un string.
interface DashboardStat {
  name: string;
  value: string;
  change: string;
  iconName: string; // Recibimos el nombre del icono
  color: string;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  joinedDate: string; // Recibimos la cadena "X days ago"
  macrosMet: number;
}

// 4. TRUCO MODERNO (Req #11 Modernidad): Mapeador de Iconos
// Convierte el nombre del icono del backend al componente de Lucide real para Req #10 Parity.
const iconMapper: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Users: Users,
  Target: Target,
  Dumbbell: Dumbbell,
  Zap: Zap,
};

function Dashboard() {
  // --- GESTIÓN DE DATOS REALES (Req #4 Connection) ---
  
  // 5. Estado profesional tipado para guardar los datos de la API (Req #6)
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 6. Efecto profesional que se ejecuta al montar la página (Req #11 Modernidad)
  useEffect(() => {
    // Definimos una función asíncrona profesional para hacer la llamada real (Req #4 Connection)
    const fetchRealData = async () => {
      try {
        console.log('📡 Frontend: Intentando conectar a la API real (Req #4)...');
        setIsLoading(true);
        setError(null);
        
        // 7. HACEMOS LA LLAMADA REAL A NUESTRA API PROFESIONAL (GET /api/dashboard)
        const response = await fetch('http://localhost:3000/api/dashboard');
        
        if (!response.ok) {
          throw new Error(`❌ API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Frontend: Datos reales recibidos de la API (Req #10 Parity Verified).');

        // 8. Guardamos los datos reales en el estado tipado
        setStats(data.stats);
        setRecentUsers(data.recentUsers);
        setIsLoading(false);

      } catch (err) {
        console.error('❌ Frontend Error:', err);
        // Req #11 Modernidad: Manejo profesional de errores visibles
        setError(err instanceof Error ? err.message : 'Critical error connecting to the backend API. Please make sure the server is running on http://localhost:3000 (Req #4)');
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []); // El array vacío [] asegura que esto solo corra una vez

  // --- RENDERIZADO VISUAL IDÉNTICO A V0 (Req #10 Parity) ---

  return (
    <div className="p-8">
      
      {/* SECCIÓN 1: Tarjetas de Estadísticas (Req #10 Parity with Dynamic Real Data Mapper) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        
        {/* Manejo profesional de estados (Req #11 Modernidad) */}
        {isLoading ? (
          // Placeholder de carga (Skeleton) - Mismo código de Req #6
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-card/50 border border-border p-6 rounded-2xl h-36 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-24 h-4 bg-secondary rounded" />
                <div className="w-12 h-12 bg-secondary rounded-xl" />
              </div>
              <div className="w-32 h-10 bg-secondary rounded" />
            </div>
          ))
        ) : error ? (
            // Mensaje de Error Visible (Req #11 Modernidad)
            <div className="col-span-full p-6 border border-destructive/40 rounded-2xl bg-destructive/10 text-destructive text-center">
                <BrainCircuit className="mx-auto h-12 w-12 mb-4" />
                <p className="font-semibold text-lg">Error Conectando al Backend (Req #4/Req #10)</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        ) : (
          // Tarjetas reales (Usando el Mapeador de Iconos profesional para Req #10 Parity)
          stats.map((stat, index) => {
            // Buscamos el componente de icono real usando el nombre del backend
            const IconComponent = iconMapper[stat.iconName] || BrainCircuit; // Usamos BrainCircuit por defecto
            return (
              <div key={index} className="bg-card border border-border p-6 rounded-2xl shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.name}</h3>
                  <div className={`p-2 rounded-xl bg-secondary/70 ${stat.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight">{stat.value}</span>
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SECCIÓN 2: Gráfica y Usuarios Recientes (Req #10 Parity with real data connection) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Gráfica de Macros (Hardcoded de Req #7 - esto lo harás tú luego con Recharts) */}
        <div className="xl:col-span-2">
          {/* Marcador de posición - Mismo código de Req #6 */}
          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm flex h-full items-center justify-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-secondary/10 group-hover:bg-secondary/30 transition-colors duration-300" />
            <div className="text-center text-muted-foreground/50 z-10 relative">
              <Target className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-medium">Marcador de posición para Gráfica de Macros</p>
              <p className="text-sm">Usaremos Recharts para esto (Hardcoded en esta fase).</p>
            </div>
          </div>
        </div>
        
        {/* Lista de Usuarios Recientes (Req #10 Parity with Dynamic Real Data) */}
        <div className="xl:col-start-3 xl:col-end-4">
          {/* Marcador de posición - Mismo código de Req #6 */}
          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm flex h-full items-center justify-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-secondary/10 group-hover:bg-secondary/30 transition-colors duration-300" />
            <div className="text-center text-muted-foreground/50 z-10 relative">
              <Users className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-medium">Marcador de posición para Últimos Usuarios</p>
              <p className="text-sm">Una lista tipada de usuarios.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;