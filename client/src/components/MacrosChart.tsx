// 1. Importamos las librerías de Recharts (Req #7 - Data Visualization)
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BrainCircuit } from 'lucide-react';

// 2. Datos de ejemplo para la gráfica (esto lo moveremos a la API luego)
const data = [
  { name: 'Lun', Protein: 160, Carbs: 210, Fats: 65 },
  { name: 'Mar', Protein: 165, Carbs: 220, Fats: 62 },
  { name: 'Mié', Protein: 158, Carbs: 200, Fats: 70 },
  { name: 'Jue', Protein: 162, Carbs: 215, Fats: 68 },
  { name: 'Vie', Protein: 170, Carbs: 225, Fats: 60 },
  { name: 'Sáb', Protein: 150, Carbs: 180, Fats: 75 },
  { name: 'Dom', Protein: 155, Carbs: 190, Fats: 72 },
];

function MacrosChart() {
  return (
    // CONTENEDOR DE LA TARJETA DE LA GRÁFICA: bg-card, border-border, shadow-sm
    <div className="bg-card border border-border p-8 rounded-2xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold">Macro Trends (7 Days)</h3>
        <div className="p-2.5 rounded-xl bg-secondary text-primary">
          <BrainCircuit className="h-6 w-6" />
        </div>
      </div>
      
      {/* 3. Componente de Recharts que se adapta al tamaño del contenedor */}
      <div className="flex-1 w-full min-h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {/* 4. Usamos variables CSS para los colores de la gráfica, ¡Req #11 Modernidad! */}
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" className="opacity-40" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ background: 'var(--color-popover)', border: '1px solid var(--color-border)', borderRadius: '12px' }}
              labelStyle={{ color: 'var(--color-muted-foreground)', marginBottom: '4px', fontWeight: 600 }}
              cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1 }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            
            {/* 5. Líneas de la gráfica con los colores de v0 */}
            <Line type="monotone" dataKey="Protein" stroke="#a78bfa" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Carbs" stroke="#60a5fa" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Fats" stroke="#fbbf24" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MacrosChart;