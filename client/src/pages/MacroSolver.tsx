import { useState, useEffect } from 'react';
import { AlertTriangle, Sparkles, RefreshCw, Check, Calculator, Clock } from 'lucide-react';

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

interface AIRecipe {
  title: string;
  description: string;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    cost: number;
  };
  usedIngredients: {
    name: string;
    amount: number;
    unit: string;
    estimatedCost: number;
  }[];
  steps: string[];
}

const TEXTURES = [
  { id: 'Crujiente', label: 'Crujiente', desc: 'Textura Fast-Food' },
  { id: 'Cremoso', label: 'Cremoso', desc: 'Suave y sedoso' },
  { id: 'Salteado', label: 'Salteado', desc: 'Estilo asiático' },
  { id: 'Al horno', label: 'Al horno', desc: 'Dorado y jugoso' },
  { id: 'Crudo/Frío', label: 'Raw/Frío', desc: 'Sin cocción' },
];

function MacroSolver() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [view, setView] = useState<'selection' | 'recipe'>('selection');
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [recipe, setRecipe] = useState<AIRecipe | null>(null);
  const [selectedTexture, setSelectedTexture] = useState<string | null>(null);

  const currentDate = new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  }).format(new Date());

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/ingredients');
        if (response.ok) {
          const data = await response.json();
          setIngredients(data);
        }
      } catch (err) {
        console.error("Error al cargar ingredientes:", err);
      }
    };
    fetchIngredients();
  }, []);

  const toggleIngredient = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleCalculate = async () => {
    if (selectedIds.size === 0) return;
    setIsCalculating(true);

    try {
      const selectedIngredients = ingredients.filter(ing => selectedIds.has(ing.id));

      const response = await fetch('http://localhost:3000/api/macros/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: selectedIngredients,
          texture: selectedTexture
        }),
      });

      if (!response.ok) throw new Error('Error al generar la receta');
      
      const data = await response.json();
      setRecipe(data);
      setView('recipe');
    } catch (error) {
      console.error("Error contactando al Chef IA:", error);
      alert("Hubo un problema al generar la receta con IA. Revisa la consola del servidor.");
    } finally {
      setIsCalculating(false);
    }
  };

  // --- VISTA 1: SELECCIÓN ---
  if (view === 'selection') {
    return (
      <div className="w-full p-4 md:p-8 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
        
        {/* Cabecera Responsiva */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8 pt-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">MacroSolver</h2>
            <p className="text-gray-500 dark:text-gray-400 capitalize text-sm md:text-base">{currentDate}</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md font-medium hover:bg-red-500/20 transition-colors w-full sm:w-auto">
            <AlertTriangle className="w-4 h-4" /> Pánico
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">Motor de programación lineal + Chef IA</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">Selecciona ingredientes y calcula tu comida óptima.</p>
        </div>

        {/* Texturas (Ajuste de paddings para móvil) */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 md:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Salvavidas de Antojos</h3>
            </div>
            <span className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm sm:ml-2">— Opcional: Dale pistas al Chef IA</span>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {TEXTURES.map((tex) => (
              <button 
                key={tex.id}
                onClick={() => setSelectedTexture(selectedTexture === tex.id ? null : tex.id)}
                className={`px-3 py-2 md:px-5 md:py-3 border rounded-xl text-left transition-colors flex-1 min-w-[140px] md:flex-none ${
                  selectedTexture === tex.id 
                    ? 'bg-orange-500/10 border-orange-500/50 dark:bg-orange-500/10 dark:border-orange-500/50' 
                    : 'bg-white dark:bg-[#111] border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <p className={`font-medium text-sm ${selectedTexture === tex.id ? 'text-orange-600 dark:text-orange-500' : 'text-gray-900 dark:text-white'}`}>{tex.label}</p>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-500 mt-0.5">{tex.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Selector de ingredientes */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 md:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
            <div className="flex items-center gap-2 text-base md:text-lg font-medium dark:text-white">
              <Calculator className="w-5 h-5 text-blue-500" /> Selecciona ingredientes
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              {selectedIds.size} seleccionados
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {ingredients.map((ing) => {
              const isSelected = selectedIds.has(ing.id);
              return (
                <div 
                  key={ing.id} onClick={() => toggleIngredient(ing.id)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[110px] md:min-h-[120px] ${
                    isSelected ? 'bg-blue-500/10 border-blue-500/50 dark:bg-blue-500/10 dark:border-blue-500/50' : 'bg-gray-50 border-gray-200 hover:border-gray-300 dark:bg-[#111] dark:border-gray-800 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm md:text-base text-gray-900 dark:text-white leading-tight">{ing.name}</h4>
                      <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-500 mt-1">{ing.category}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 dark:border-gray-700'}`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-2 md:mt-4">
                    <div className="flex gap-2 md:gap-3 text-xs md:text-sm font-medium">
                      <span className="text-blue-600 dark:text-blue-500">{ing.protein}g <span className="text-[10px] font-normal opacity-70">P</span></span>
                      <span className="text-green-600 dark:text-green-500">{ing.carbs}g <span className="text-[10px] font-normal opacity-70">C</span></span>
                      <span className="text-purple-600 dark:text-purple-500">{ing.fat}g <span className="text-[10px] font-normal opacity-70">G</span></span>
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-500">{ing.quantityInStock}{ing.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={handleCalculate} disabled={selectedIds.size === 0 || isCalculating}
            className="w-full flex items-center justify-center gap-2 py-3.5 md:py-4 bg-[#0070f3] hover:bg-blue-600 text-white rounded-xl font-medium text-base md:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,112,243,0.2)]"
          >
            {isCalculating ? <RefreshCw className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Sparkles className="w-5 h-5 md:w-6 md:h-6" />}
            {isCalculating ? 'El Chef IA está cocinando...' : 'Calcular Comida Óptima con IA'}
          </button>
        </div>
      </div>
    );
  }

  // --- VISTA 2: RECETA GENERADA ---
  if (!recipe) return null;

  return (
    <div className="w-full p-4 md:p-8 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8 pt-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">MacroSolver</h2>
          <p className="text-gray-500 dark:text-gray-400 capitalize text-sm md:text-base">{currentDate}</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md font-medium hover:bg-red-500/20 transition-colors w-full sm:w-auto">
          <AlertTriangle className="w-4 h-4" /> Pánico
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 md:mb-8">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1 md:mb-2">Chef IA Completado</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">Receta diseñada exclusivamente para ti basada en tu selección actual.</p>
        </div>
        <button 
          onClick={() => setView('selection')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full sm:w-auto"
        >
          <RefreshCw className="w-4 h-4" /> Volver a crear
        </button>
      </div>

      {/* Tarjeta de Receta */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm mb-6">
        <div className="p-5 md:p-8 border-b border-gray-200 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-[10px] md:text-xs font-medium">
            <Sparkles className="w-3 h-3" /> <span className="hidden sm:inline">Generado con GPT-4o</span><span className="sm:hidden">IA</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 mt-6 md:mt-4 pr-16 md:pr-0">{recipe.title}</h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-3xl">{recipe.description}</p>
        </div>

        {/* Totales (Cambia de 2x2 en móvil a 4 en línea en escritorio) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-gray-200 dark:border-gray-800">
          <div className="p-4 md:p-6 text-center border-r border-b lg:border-b-0 border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-bold text-orange-500 mb-0.5 md:mb-1">{recipe.totals.calories}<span className="text-lg md:text-xl">kcal</span></span>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Calorías</span>
          </div>
          <div className="p-4 md:p-6 text-center border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-bold text-blue-500 mb-0.5 md:mb-1">{recipe.totals.protein}<span className="text-lg md:text-xl">g</span></span>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Proteína</span>
          </div>
          <div className="p-4 md:p-6 text-center border-r border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-bold text-green-500 mb-0.5 md:mb-1">{recipe.totals.carbs}<span className="text-lg md:text-xl">g</span></span>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Carbos</span>
          </div>
          <div className="p-4 md:p-6 text-center flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-bold text-purple-500 mb-0.5 md:mb-1">{recipe.totals.fat}<span className="text-lg md:text-xl">g</span></span>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Grasa</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ingredientes Usados */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col h-full">
          <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white mb-4 md:mb-6">Ingredientes exactos</h3>
          <div className="flex-1 space-y-4 md:space-y-5">
            {recipe.usedIngredients.map((ing, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800/50 pb-3 md:pb-4">
                <span className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-200">{ing.name}</span>
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="font-bold text-sm md:text-base text-gray-900 dark:text-white">{ing.amount}{ing.unit}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm w-10 md:w-12 text-right">€{ing.estimatedCost.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-5 md:pt-6 mt-4 border-t border-gray-200 dark:border-gray-800">
            <span className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">Coste total del plato</span>
            <span className="font-bold text-green-500 text-lg md:text-xl">€{recipe.totals.cost.toFixed(2)}</span>
          </div>
        </div>

        {/* Pasos de Preparación */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Clock className="w-5 h-5 text-blue-500" />
            <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">Pasos de preparación</h3>
          </div>
          <div className="space-y-4 md:space-y-6">
            {recipe.steps.map((step, idx) => {
              const cleanStep = step.replace(/^Paso\s\d+:\s*/i, '');
              return (
                <div key={idx} className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs md:text-sm mt-0.5">{idx + 1}</div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed md:pt-1">{cleanStep}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

export default MacroSolver;