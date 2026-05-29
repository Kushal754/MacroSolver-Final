import { useState, useEffect } from 'react';
import { Target, Users, Dumbbell, Zap } from 'lucide-react';
// 1. Importamos los nuevos componentes reutilizables (Req #6)
import MacrosChart from '../components/MacrosChart';
import RecentUsers from '../components/RecentUsers';

// Definimos el tipo para las estadísticas (Req #6 - Tipeado)
interface DashboardStat {
  name: string;
  value: string;
  change: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; 
  color: string;
}

function Dashboard() {
  // --- GESTIÓN DE DATOS SIMULADA (Mock API - Manteniendo Req #4) ---
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      // Simulamos retraso de red
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData: DashboardStat[] = [
        { name: 'Active Users', value: '1,234', change: '+5.2%', icon: Users, color: 'text-sky-500' },
        { name: 'Daily Macros Met', value: '89%', change: '+1.5%', icon: Target, color: 'text-emerald-500' },
        { name: 'Training Plans Generated', value: '456', change: '+12.3%', icon: Dumbbell, color: 'text-amber-500' },
        { name: 'Avg. AI Response Time', value: '1.2s', change: '-10%', icon: Zap, color: 'text-rose-500' },
      ];
      setStats(mockData);
      setIsLoading(false);
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="p-8">
      
      {/* SECCIÓN 1: Tarjetas de Estadísticas (Manteniendo Req #6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {isLoading ? (
          // Placeholder de carga (Skeleton)
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-card/50 border border-border p-6 rounded-2xl h-36 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-24 h-4 bg-secondary rounded" />
                <div className="w-12 h-12 bg-secondary rounded-xl" />
              </div>
              <div className="w-32 h-10 bg-secondary rounded" />
            </div>
          ))
        ) : (
          // Tarjetas reales
          stats.map((stat, index) => (
            <div key={index} className="bg-card border border-border p-6 rounded-2xl shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.name}</h3>
                <div className={`p-2 rounded-xl bg-secondary/70 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight">{stat.value}</span>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SECCIÓN 2: Integración de v0 (Fulfilling Req #10 - Identical to v0) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* 2. Sustituimos el marcador de posición por la gráfica real */}
        <div className="xl:col-span-2">
          <MacrosChart />
        </div>
        
        {/* 3. Sustituimos el marcador de posición por la lista real */}
        <div className="xl:col-start-3 xl:col-end-4">
          <RecentUsers />
        </div>
      </div>

    </div>
  );
}

export default Dashboard;