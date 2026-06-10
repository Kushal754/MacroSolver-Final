import { useState, useEffect } from 'react';
import { Activity, PieChart as PieChartIcon, AlertCircle, Package, TrendingUp, Check } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// 1. Tipamos exactamente lo que viene de nuestra base de datos real (SQLite)
interface Ingredient {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantityInStock: number;
  unit: string;
}

function Dashboard() {
  // 2. Estados para almacenar los datos reales de la despensa
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentDate = new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date());

  // 3. Conexión Real: Llamamos a la API de ingredientes en lugar del dashboard simulado
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        console.log('📡 Frontend: Conectando con SQLite para obtener el inventario...');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const response = await fetch(`${API_URL}/ingredients`);
        
        if (!response.ok) throw new Error('Error en la conexión a la base de datos');
        
        const data = await response.json();
        setIngredients(data);
      } catch (err) {
        console.error("❌ Error al cargar datos para el Dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  // --- 4. MOTOR ANALÍTICO (Cálculos en tiempo real) ---
  const totalProtein = ingredients.reduce((acc, curr) => acc + Number(curr.protein), 0);
  const totalCarbs = ingredients.reduce((acc, curr) => acc + Number(curr.carbs), 0);
  const totalFat = ingredients.reduce((acc, curr) => acc + Number(curr.fat), 0);
  const totalCalories = ingredients.reduce((acc, curr) => acc + Number(curr.calories), 0);

  // Datos formateados para inyectarlos en Recharts
  const macroData = [
    { name: 'Proteínas', value: totalProtein, color: '#3b82f6' }, // blue-500
    { name: 'Carbohidratos', value: totalCarbs, color: '#22c55e' }, // green-500
    { name: 'Grasas', value: totalFat, color: '#a855f7' } // purple-500
  ];

  // Filtro inteligente para las alertas de stock (menos de 3 unidades)
  const lowStockItems = ingredients.filter(ing => ing.quantityInStock < 3);

  // --- RENDERIZADO VISUAL ---
  if (isLoading) {
    return (
      <div className="p-8 h-full flex flex-col gap-6">
         {/* Skeleton de carga minimalista */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-[#111]/50 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl h-32 animate-pulse" />
            ))}
         </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-8 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      
      {/* SECCIÓN 1: Cabecera */}
      <div className="flex justify-between items-start mb-8 pt-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">Dashboard Analítico</h2>
          <p className="text-gray-500 dark:text-gray-400 capitalize">{currentDate}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-md font-medium">
          <Activity className="w-4 h-4" /> Sistema Online
        </div>

      </div>

      {/* SECCIÓN 2: Tarjetas KPI con datos reales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-gray-100 dark:bg-[#111] rounded-xl text-gray-600 dark:text-gray-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Ingredientes</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{ingredients.length}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-orange-600 dark:text-orange-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Calorías en Despensa</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{totalCalories.toLocaleString()}<span className="text-sm font-normal text-gray-500 ml-1">kcal</span></h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-500">
            <PieChartIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Índice Proteico</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{totalProtein.toFixed(0)}<span className="text-sm font-normal text-gray-500 ml-1">g</span></h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-600 dark:text-red-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Alertas de Stock</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{lowStockItems.length}</h4>
          </div>
        </div>

      </div>

      {/* SECCIÓN 3: Gráfica de Recharts y Panel de Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfica Circular de Macros */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Distribución Global de Macros</h3>
          
          {ingredients.length > 0 && (totalProtein > 0 || totalCarbs > 0 || totalFat > 0) ? (
            <div className="h-72 w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
              Añade ingredientes con macros para ver tus estadísticas
            </div>
          )}
        </div>

        {/* Panel de Alertas Críticas */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Avisos de Stock Bajo</h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {lowStockItems.length > 0 ? (
              <div className="space-y-4">
                {lowStockItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-4 border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-500/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="font-medium text-gray-900 dark:text-gray-200">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Quedan:</span>
                      <span className="font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2.5 py-0.5 rounded-md">
                        {item.quantityInStock}{item.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
                <Check className="w-8 h-8 text-green-500 mb-2 opacity-50" />
                <p>Tu despensa está perfectamente abastecida.</p>
                <p className="text-sm mt-1">Ningún ingrediente por debajo de 3 unidades.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;