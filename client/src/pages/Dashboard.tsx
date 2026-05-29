
import { Target, Users, Dumbbell, Zap } from 'lucide-react';

function Dashboard() {
  // 2. Datos de ejemplo para las tarjetas (esto lo moveremos a la API luego)
  const stats = [
    { name: 'Active Users', value: '1,234', change: '+5.2%', icon: Users, color: 'text-sky-500' },
    { name: 'Daily Macros Met', value: '89%', change: '+1.5%', icon: Target, color: 'text-emerald-500' },
    { name: 'Training Plans Generated', value: '456', change: '+12.3%', icon: Dumbbell, color: 'text-amber-500' },
    { name: 'Avg. AI Response Time', value: '1.2s', change: '-10%', icon: Zap, color: 'text-rose-500' },
  ];

  return (
    // CONTENEDOR PRINCIPAL DE LA PÁGINA: p-8
    <div className="p-8">
      
      {/* SECCIÓN 1: Tarjetas de Estadísticas (Fulfilling Req #6 - Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-border p-6 rounded-2xl shadow-sm">
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
        ))}
      </div>

      {/* SECCIÓN 2: Marcador de posición para las gráficas (esto lo haremos con Recharts) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card border border-border p-8 rounded-2xl shadow-sm flex h-80 items-center justify-center">
          <div className="text-center text-muted-foreground/50">
            <Target className="mx-auto h-16 w-16 mb-4" />
            <p className="text-lg font-medium">Marcador de posición para Gráfica de Macros</p>
            <p className="text-sm">Usaremos Recharts para esto en el siguiente paso.</p>
          </div>
        </div>
        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm flex h-80 items-center justify-center">
          <div className="text-center text-muted-foreground/50">
            <Users className="mx-auto h-16 w-16 mb-4" />
            <p className="text-lg font-medium">Marcador de posición para Últimos Usuarios</p>
            <p className="text-sm">Una lista tipada de usuarios.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;