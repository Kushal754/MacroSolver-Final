import { useState, useEffect, useRef } from 'react';
import { Search, Camera, Upload, Plus, ScanLine, Loader2, MoreVertical } from 'lucide-react';

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

const CATEGORIES = ['Todos', 'Proteína', 'Carbohidrato', 'Verdura', 'Grasa', 'Lácteo', 'Fruta', 'Otro'];

function Pantry() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [aiDetectedIngredients, setAiDetectedIngredients] = useState<Omit<Ingredient, 'id'>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentDate = new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  }).format(new Date());

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/ingredients');
        if (!response.ok) throw new Error('Error al cargar ingredientes');
        const data = await response.json();
        setIngredients(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleScan(file);
    }
  };

  const handleScan = async (file: File) => {
    try {
      setIsScanning(true);
      setAiDetectedIngredients([]);
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:3000/api/pantry/scan', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error en el escáner');
      const data = await response.json();
      setAiDetectedIngredients(data.ingredients);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
      setSelectedFile(null);
    }
  };

  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFilter === 'Todos' || ing.category === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryStyle = (category: string) => {
    switch (category.toLowerCase()) {
      case 'proteína': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500';
      case 'carbohidrato': return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500';
      case 'grasa': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-500';
      case 'verdura': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  return (
    <div className="w-full p-8 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      
      {/* Header Principal Integrado */}
      <div className="flex justify-between items-end mb-8 pt-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Mi Despensa</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 capitalize">{currentDate} • {ingredients.length} ingredientes registrados</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0070f3] text-white rounded-md font-medium hover:bg-blue-600 transition shadow-[0_0_15px_rgba(0,112,243,0.3)]">
          <Plus className="w-5 h-5" />
          Añadir ingrediente
        </button>
      </div>

      {/* Fridge Vision */}
      <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-10 flex flex-col items-center justify-center text-center mb-8 bg-gray-50 dark:bg-[#111] relative overflow-hidden transition-colors duration-200">
        {isScanning && (
          <div className="absolute inset-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-colors duration-200">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-blue-600 dark:text-blue-400 font-medium animate-pulse">Analizando imagen con IA...</p>
          </div>
        )}
        
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200">
          <ScanLine className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Fridge Vision — Escáner de Nevera</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-md">Arrastra una foto o haz clic para subir. La IA detectará los ingredientes automáticamente.</p>
        
        <div className="flex gap-4">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200">
            <Upload className="w-4 h-4" /> Subir foto
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200">
            <Camera className="w-4 h-4" /> Usar cámara
          </button>
        </div>
      </div>

      {/* Resultados de la IA */}
      {aiDetectedIngredients.length > 0 && (
        <div className="mb-8 p-6 bg-blue-50 dark:bg-[#111] border border-blue-200 dark:border-blue-500/30 rounded-xl transition-colors duration-200">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Detectados por la IA (Pendientes de guardar)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {aiDetectedIngredients.map((ing, i) => (
                <div key={i} className="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg border border-gray-200 dark:border-gray-800 transition-colors duration-200">
                   <p className="font-medium text-gray-900 dark:text-white">{ing.name}</p>
                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{ing.calories} kcal</p>
                   <div className="flex gap-3 text-xs">
                     <span className="text-blue-600 dark:text-blue-500">P: {ing.protein}g</span>
                     <span className="text-green-600 dark:text-green-500">C: {ing.carbs}g</span>
                     <span className="text-purple-600 dark:text-purple-500">G: {ing.fat}g</span>
                   </div>
                </div>
             ))}
          </div>
          <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-md transition font-medium">
            Guardar en mi despensa
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar ingrediente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-800 rounded-md py-2 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-gray-600 transition-colors duration-200"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors duration-200 border ${
                selectedFilter === cat 
                  ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-500 dark:border-blue-500/30' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 dark:bg-[#111] dark:text-gray-400 dark:border-gray-800 dark:hover:bg-[#1a1a1a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Ingredientes */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-colors duration-200 shadow-sm">
        
        {/* Cabecera de la tabla */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
          <div className="w-1/4">Ingrediente</div>
          <div className="w-1/6">Categoría</div>
          <div className="w-1/6">Calorías (100g)</div>
          <div className="w-1/12">Proteínas</div>
          <div className="w-1/12">Carbos</div>
          <div className="w-1/12">Grasas</div>
          <div className="w-1/12">Stock</div>
          <div className="w-1/12 text-right pr-2">Acciones</div>
        </div>

        {/* Cuerpo de la tabla */}
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Cargando despensa...</div>
        ) : filteredIngredients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay ingredientes que coincidan con tu búsqueda.</div>
        ) : (
          <div className="flex flex-col">
            {filteredIngredients.map((ing) => (
              <div key={ing.id} className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                <div className="w-1/4 font-medium text-gray-800 dark:text-gray-200">{ing.name}</div>
                <div className="w-1/6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryStyle(ing.category)}`}>
                    {ing.category}
                  </span>
                </div>
                <div className="w-1/6 text-gray-500 dark:text-gray-400 text-sm">{ing.calories} kcal</div>
                <div className="w-1/12 text-blue-600 dark:text-[#0070f3] font-medium">{ing.protein}g</div>
                <div className="w-1/12 text-green-600 dark:text-[#00c853] font-medium">{ing.carbs}g</div>
                <div className="w-1/12 text-purple-600 dark:text-[#9c27b0] font-medium">{ing.fat}g</div>
                <div className="w-1/12 text-gray-500 dark:text-gray-400 text-sm">{ing.quantityInStock}{ing.unit}</div>
                
                {/* Botón de acciones (3 puntos) */}
                <div className="w-1/12 flex justify-end pr-2">
                  <button className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Pantry;