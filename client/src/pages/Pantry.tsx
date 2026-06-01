import { useState, useEffect, useRef } from 'react';
import { Search, Camera, Upload, Plus, ScanLine, Loader2, X, Trash2, Pencil } from 'lucide-react';

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
const FORM_CATEGORIES = CATEGORIES.filter(c => c !== 'Todos'); 

function Pantry() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const [isScanning, setIsScanning] = useState(false);
  const [aiDetectedIngredients, setAiDetectedIngredients] = useState<Omit<Ingredient, 'id'>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingAi, setIsSavingAi] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const defaultIngredientState = {
    name: '', category: 'Proteína', calories: '', protein: '', carbs: '', fat: '', quantityInStock: '', unit: 'g'
  };
  const [newIngredient, setNewIngredient] = useState(defaultIngredientState);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewIngredient(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (ing: Ingredient) => {
    setEditingId(ing.id);
    setNewIngredient({
      name: ing.name,
      category: ing.category,
      calories: String(ing.calories),
      protein: String(ing.protein),
      carbs: String(ing.carbs),
      fat: String(ing.fat),
      quantityInStock: String(ing.quantityInStock),
      unit: ing.unit
    });
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingId(null);
    setNewIngredient(defaultIngredientState);
  };

  const handleSubmitIngredient = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsSubmitting(true);
    
    const payload = {
      ...newIngredient,
      calories: Number(newIngredient.calories),
      protein: Number(newIngredient.protein),
      carbs: Number(newIngredient.carbs),
      fat: Number(newIngredient.fat),
      quantityInStock: Number(newIngredient.quantityInStock),
    };

    try {
      if (editingId) {
        const response = await fetch(`http://localhost:3000/api/ingredients/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Error al actualizar');
        const updatedIngredient = await response.json();
        setIngredients(prev => prev.map(ing => ing.id === editingId ? updatedIngredient : ing));
      } else {
        const response = await fetch('http://localhost:3000/api/ingredients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Error al guardar');
        const savedIngredient = await response.json();
        setIngredients(prev => [...prev, savedIngredient]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error("Error saving ingredient:", error);
      alert("Hubo un error al guardar el ingrediente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este ingrediente de tu despensa?")) return;
    try {
      const response = await fetch(`http://localhost:3000/api/ingredients/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar');
      setIngredients(prev => prev.filter(ing => ing.id !== id));
    } catch (error) {
      console.error("Error eliminando:", error);
      alert("No se pudo eliminar el ingrediente.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleScan(file);
  };

  const handleScan = async (file: File) => {
    try {
      setIsScanning(true);
      setAiDetectedIngredients([]);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:3000/api/pantry/scan', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Error en el escáner');
      
      const data = await response.json();
      setAiDetectedIngredients(data.ingredients);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveAiIngredients = async () => {
    if (aiDetectedIngredients.length === 0) return;
    setIsSavingAi(true);
    try {
      const promises = aiDetectedIngredients.map(ing => 
        fetch('http://localhost:3000/api/ingredients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...ing,
            quantityInStock: ing.quantityInStock || 1,
            unit: ing.unit || 'ud'
          }),
        }).then(res => {
          if (!res.ok) throw new Error('Error al guardar');
          return res.json();
        })
      );
      const savedIngredients = await Promise.all(promises);
      setIngredients(prev => [...prev, ...savedIngredients]);
      setAiDetectedIngredients([]);
    } catch (error) {
      console.error("Error masivo:", error);
      alert("Error al intentar guardar los ingredientes.");
    } finally {
      setIsSavingAi(false);
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
      
      <div className="flex justify-between items-end mb-8 pt-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Mi Despensa</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 capitalize">{currentDate} • {ingredients.length} ingredientes registrados</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setNewIngredient(defaultIngredientState); setIsAddModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0070f3] text-white rounded-md font-medium hover:bg-blue-600 transition shadow-[0_0_15px_rgba(0,112,243,0.3)]"
        >
          <Plus className="w-5 h-5" />
          Añadir ingrediente
        </button>
      </div>

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
          
          {/* BOTÓN DE CÁMARA RESTAURADO PARA ELIMINAR EL AVISO */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200">
            <Camera className="w-4 h-4" /> Usar cámara
          </button>
        </div>
      </div>

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
            <button 
            onClick={handleSaveAiIngredients} disabled={isSavingAi}
            className="mt-4 w-full flex items-center justify-center py-2 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-md transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingAi ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Guardar en mi despensa
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input 
            type="text" placeholder="Buscar ingrediente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-800 rounded-md py-2 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-gray-600 transition-colors duration-200"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors duration-200 border ${
                selectedFilter === cat ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-500 dark:border-blue-500/30' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 dark:bg-[#111] dark:text-gray-400 dark:border-gray-800 dark:hover:bg-[#1a1a1a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-colors duration-200 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
          <div className="w-1/4">Ingrediente</div>
          <div className="w-1/6">Categoría</div>
          <div className="w-1/6">Calorías</div>
          <div className="w-1/12">Proteínas</div>
          <div className="w-1/12">Carbos</div>
          <div className="w-1/12">Grasas</div>
          <div className="w-1/12">Stock</div>
          <div className="w-1/12 text-right pr-2">Acciones</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Cargando despensa...</div>
        ) : filteredIngredients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay ingredientes.</div>
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
                
                <div className="w-1/12 flex justify-end pr-2 gap-1">
                  <button 
                    onClick={() => handleEditClick(ing)}
                    title="Editar ingrediente"
                    className="p-1.5 text-blue-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(ing.id)}
                    title="Eliminar ingrediente"
                    className="p-1.5 text-red-400 hover:text-red-600 dark:hover:text-red-400 dark:text-red-500/70 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transition-colors duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Editar Ingrediente' : 'Añadir Ingrediente Manual'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitIngredient} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del ingrediente</label>
                  <input required type="text" name="name" value={newIngredient.name} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                  <select name="category" value={newIngredient.category} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {FORM_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calorías (por 100g/ml)</label>
                  <input required type="number" min="0" name="calories" value={newIngredient.calories} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Proteínas (g)</label>
                  <input required type="number" min="0" step="0.1" name="protein" value={newIngredient.protein} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Carbos (g)</label>
                  <input required type="number" min="0" step="0.1" name="carbs" value={newIngredient.carbs} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Grasas (g)</label>
                  <input required type="number" min="0" step="0.1" name="fat" value={newIngredient.fat} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock actual</label>
                  <input required type="number" min="0" name="quantityInStock" value={newIngredient.quantityInStock} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unidad de medida</label>
                  <select name="unit" value={newIngredient.unit} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="g">Gramos (g)</option>
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="l">Litros (l)</option>
                    <option value="ud">Unidades (ud)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingId ? 'Actualizar Ingrediente' : 'Guardar Ingrediente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pantry;