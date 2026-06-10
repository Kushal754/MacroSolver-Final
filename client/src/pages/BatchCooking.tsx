import { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, ChefHat, Wheat, Beef, Package, Loader2 } from 'lucide-react';

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

interface DailyMeal {
  day: string;
  dishName: string;
  calories: number;
  protein: number;
  carbs: number;
}

interface BatchPlan {
  days: DailyMeal[];
  summary: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    estimatedCost: number;
  };
}

// Función para pintar la tarjeta de cada día con su color específico según tu diseño
const getDayColors = (day: string) => {
  switch (day.toUpperCase()) {
    case 'LUNES': return { border: 'border-blue-500/30', title: 'text-blue-500', bg: 'bg-blue-500/5' };
    case 'MARTES': return { border: 'border-emerald-500/30', title: 'text-emerald-500', bg: 'bg-emerald-500/5' };
    case 'MIÉRCOLES': return { border: 'border-orange-500/30', title: 'text-orange-500', bg: 'bg-orange-500/5' };
    case 'JUEVES': return { border: 'border-purple-500/30', title: 'text-purple-500', bg: 'bg-purple-500/5' };
    case 'VIERNES': return { border: 'border-rose-500/30', title: 'text-rose-500', bg: 'bg-rose-500/5' };
    default: return { border: 'border-gray-500/30', title: 'text-gray-500', bg: 'bg-gray-500/5' };
  }
};

// Función para asignar un icono dinámico según la categoría del ingrediente
const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat === 'carbohidrato') return <Wheat className="w-6 h-6" />;
  if (cat === 'proteína') return <Beef className="w-6 h-6" />;
  return <Package className="w-6 h-6" />;
};

function BatchCooking() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<BatchPlan | null>(null);

  const currentDate = new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  }).format(new Date());

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const response = await fetch(`${API_URL}/ingredients`);
        if (response.ok) {
          const data = await response.json();
          setIngredients(data);
          if (data.length > 0) setSelectedBaseId(data[0].id); // Autoseleccionar el primero
        }
      } catch (err) {
        console.error("Error al cargar ingredientes:", err);
      }
    };
    fetchIngredients();
  }, []);

  const handleGeneratePlan = async () => {
    if (!selectedBaseId) return;
    setIsGenerating(true);

    const baseIngredient = ingredients.find(ing => ing.id === selectedBaseId);

    try {
      const response = await fetch('http://localhost:3000/api/batch/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseIngredient,
          allIngredients: ingredients
        }),
      });

      if (!response.ok) throw new Error('Error al generar el plan');
      
      const data = await response.json();
      setPlan(data);
    } catch (error) {
      console.error("Error contactando al Chef IA:", error);
      alert("Hubo un problema al generar el plan. Revisa la consola.");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedIngredient = ingredients.find(ing => ing.id === selectedBaseId);

  return (
    <div className="w-full p-4 md:p-8 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Cabecera */}
      <div className="flex justify-between items-start mb-8 pt-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">Batch Cooking</h2>
          <p className="text-gray-500 dark:text-gray-400 capitalize">{currentDate}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md font-medium hover:bg-red-500/20 transition-colors">
          <AlertTriangle className="w-4 h-4" /> Pánico
        </button>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Batch Cooking Semanal</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Cocina un ingrediente base el domingo y la IA diseña 5 platos diferentes para toda la semana.</p>
      </div>

      {/* Sección 1: Selección de Ingrediente Base */}
      <div className="mb-10">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Elige tu ingrediente base del domingo</h4>
        
        <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
          {ingredients.map((ing) => {
            const isSelected = selectedBaseId === ing.id;
            return (
              <div 
                key={ing.id}
                onClick={() => setSelectedBaseId(ing.id)}
                className={`min-w-[280px] p-6 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-white dark:bg-[#0a0a0a] border-[#0070f3] shadow-[0_0_15px_rgba(0,112,243,0.15)]' 
                    : 'bg-white/50 dark:bg-[#111] border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-500'}`}>
                    {getCategoryIcon(ing.category)}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-white leading-tight">
                      {ing.quantityInStock}{ing.unit} {ing.name}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Total en despensa</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-500 dark:text-gray-500">€ Valor est.</span>
                  <span className={isSelected ? 'text-[#00c853]' : 'text-gray-900 dark:text-white'}>
                    € {((ing.quantityInStock || 1) * 1.5).toFixed(2)} {/* Coste simulado */}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={handleGeneratePlan}
          disabled={!selectedBaseId || isGenerating}
          className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-[#0070f3] hover:bg-blue-600 text-white rounded-xl font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calendar className="w-5 h-5" />}
          {isGenerating ? 'Generando plan semanal...' : `Generar plan con ${selectedIngredient?.name || 'IA'}`}
        </button>
      </div>

      {/* Sección 2: Plan Generado (Diseño v0 exacto) */}
      {plan && (
        <div className="animate-in fade-in duration-500">
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <ChefHat className="w-5 h-5 text-orange-500" />
              Plan Semanal — {selectedIngredient?.quantityInStock}{selectedIngredient?.unit} {selectedIngredient?.name}
            </div>
            <span className="px-3 py-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md text-xs font-medium text-gray-500">
              Semana actual
            </span>
          </div>

          {/* Tarjetas de los Días */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {plan.days.map((dayPlan, idx) => {
              const colors = getDayColors(dayPlan.day);
              return (
                <div key={idx} className={`bg-white dark:bg-[#0a0a0a] border ${colors.border} rounded-2xl p-6 shadow-sm flex flex-col h-full`}>
                  <div className="flex-1 mb-6">
                    <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-500 mb-3">{dayPlan.day}</p>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-4">{dayPlan.dishName}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Base: <span className="font-bold text-gray-900 dark:text-white">{selectedIngredient?.name}</span>
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm font-medium">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Calorías</span>
                      <span className="text-gray-900 dark:text-white">{dayPlan.calories}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={colors.title}>Proteína</span>
                      <span className="text-gray-900 dark:text-white">{dayPlan.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={colors.title === 'text-blue-500' ? 'text-green-500' : 'text-blue-500'}>Carbos</span>
                      <span className="text-gray-900 dark:text-white">{dayPlan.carbs}g</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumen Semanal */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resumen de la semana</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Calorías totales</p>
                <p className="text-2xl font-bold text-orange-500">{plan.summary.totalCalories} <span className="text-sm text-gray-500 font-normal">kcal</span></p>
              </div>
              <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Proteína total</p>
                <p className="text-2xl font-bold text-blue-500">{plan.summary.totalProtein} <span className="text-sm text-gray-500 font-normal">g</span></p>
              </div>
              <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Carbos totales</p>
                <p className="text-2xl font-bold text-green-500">{plan.summary.totalCarbs} <span className="text-sm text-gray-500 font-normal">g</span></p>
              </div>
              <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Coste estimado</p>
                <p className="text-2xl font-bold text-green-500">€{plan.summary.estimatedCost.toFixed(2)} <span className="text-sm text-gray-500 font-normal">/semana</span></p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default BatchCooking;