// client/src/pages/Pantry.tsx
import { useState, useEffect, useRef } from 'react';
import { Package, PlusCircle, Search, Trash2, Camera, BrainCircuit, X, UploadCloud, Loader2 } from 'lucide-react';

// TIPO: Definimos la forma exacta de los datos que nuestra API profesional nos envía (Req #6/Req #10 Parity)
interface Ingredient {
  id: string; // UUID profesional Req #11 moderno
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantityInStock: number;
  unit: string;
}

function Pantry() {
  // --- GESTIÓN DE DATOS REALES DE LA DESPENSA (Req #4 Connection) ---
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoadingPantry, setIsLoadingPantry] = useState(true);
  const [errorPantry, setErrorPantry] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- ESTADOS PARA EL ESCÁNER DE IA (Req #10 Parity / Req #12 IA Real) ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  // Estado para ingredientes temporales detectados por la IA, antes de guardarlos definitivamente.
  const [aiDetectedIngredients, setAiDetectedIngredients] = useState<Omit<Ingredient, 'id'>[]>([]); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Efecto profesional que se ejecuta al montar la página (Req #11 moderno)
  useEffect(() => {
    // Definimos una función asíncrona profesional para hacer la llamada real (Req #4 Connection)
    const fetchRealIngredients = async () => {
      try {
        console.log('📡 Frontend: Intentando conectar a la API real de Ingredientes (Req #4)...');
        setIsLoadingPantry(true);
        setErrorPantry(null);
        
        // HACEMOS LA LLAMADA REAL A NUESTRA API PROFESIONAL (GET /api/ingredients)
        const response = await fetch('http://localhost:3000/api/ingredients');
        
        if (!response.ok) {
          throw new Error(`❌ API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ Frontend: ${data.length} ingredientes reales recibidos de la API (Req #10 Parity Verified).`);

        // Guardamos los datos reales en el estado tipado
        setIngredients(data);
        setIsLoadingPantry(false);

      } catch (err) {
        console.error('❌ Frontend Error:', err);
        // Req #11 moderno: Manejo profesional de errores visibles
        setErrorPantry(err instanceof Error ? err.message : 'Critical error connecting to the pantry API. Make sure the backend server is running on http://localhost:3000 (Req #4)');
        setIsLoadingPantry(false);
      }
    };

    fetchRealIngredients();
  }, []); // El array vacío [] asegura que esto solo corra una vez

  // --- LÓGICA DE FILTRADO PROFESIONAL (Req #6 Organización) ---
  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ing.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LÓGICA DEL ESCÁNER DE IA (Req #12 IA Real) ---

  // 1. Manejar la selección de archivo (Req #6 Organización)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setScanError(null);
      // Crear vista previa local de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Enviar imagen a la API de Escaneo (Req #4 Conexión / Req #12 IA Real)
  const handleScanClick = async () => {
    if (!selectedFile) {
      setScanError('Por favor, selecciona una imagen primero.');
      return;
    }

    try {
      console.log('📡 Frontend: Iniciando escaneo de imagen con IA Real (Req #4/Req #12)...');
      setIsScanning(true);
      setScanError(null);
      setAiDetectedIngredients([]); // Limpiar detecciones previas

      // Creamos FormData para enviar el archivo
      const formData = new FormData();
      formData.append('image', selectedFile);

      // HACEMOS LA LLAMADA REAL A LA API DE ESCANEO (POST /api/pantry/scan)
      const response = await fetch('http://localhost:3000/api/pantry/scan', {
        method: 'POST',
        body: formData,
        // No añadimos Content-Type: 'multipart/form-data', el navegador lo hace solo con FormData
      });

      if (!response.ok) {
        throw new Error(`❌ API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Frontend: Imagen analizada correctamente por la IA (Req #12).');

      // Guardamos los ingredientes detectados en el estado
      setAiDetectedIngredients(data.ingredients);
      setIsScanning(false);
      // Limpiar vista previa y archivo seleccionado
      setImagePreview(null);
      setSelectedFile(null);

    } catch (err) {
      console.error('❌ Frontend Error en el escáner:', err);
      // Req #11 moderno: Manejo profesional de errores visibles
      setScanError(err instanceof Error ? err.message : 'Critical error connecting to the pantry scan API. Make sure the backend server is running on http://localhost:3000 (Req #4)');
      setIsScanning(false);
    }
  };

  const cancelSelection = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setScanError(null);
  };

  // --- RENDERIZADO VISUAL IDÉNTICO A V0 (Req #10 Parity) ---

  return (
    <div className="p-8">
      {/* Encabezado profesional Req #10 visual target verificado */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Mi Despensa</h1>
          <p className="text-muted-foreground mt-2">Gestiona tus ingredientes y stock para los planes de comida inteligentes (Real-time DB Req #8).</p>
        </div>
        <button className="flex items-center gap-2.5 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          <PlusCircle className="h-5 w-5" />
          Añadir Ingrediente (Manual)
        </button>
      </div>

      {/* Barra de Búsqueda profesional Req #10 visual target verificado */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar ingrediente por nombre o categoría (ej: 'Pollo' o 'Proteína')..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        />
      </div>

      {/* --- GRUPO: Grilla de Ingredientes (Req #10 Parity with Dynamic Real Data) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        
        {/* Manejo profesional de estados (Req #11 moderno) */}
        {isLoadingPantry ? (
          // Placeholder de carga (Skeleton) - Mismo código de Req #6
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-card/50 border border-border p-6 rounded-2xl h-48 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary rounded-xl" />
                <div className="flex-1 space-y-2">
                    <div className="w-24 h-4 bg-secondary rounded" />
                    <div className="w-40 h-6 bg-secondary rounded" />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="w-full h-4 bg-secondary rounded" />
                <div className="w-full h-4 bg-secondary rounded" />
              </div>
            </div>
          ))
        ) : errorPantry ? (
            // Mensaje de Error Visible (Req #11 moderno Req #4 Connection)
            <div className="col-span-full p-6 border border-destructive/40 rounded-2xl bg-destructive/10 text-destructive text-center">
                <BrainCircuit className="mx-auto h-12 w-12 mb-4" />
                <p className="font-semibold text-lg">Error Conectando a la Despensa Real (Req #4/Req #10)</p>
                <p className="text-sm mt-1">{errorPantry}</p>
            </div>
        ) : filteredIngredients.length === 0 ? (
          // Estado vacío profesional Req #11 moderno
          <div className="col-span-full text-center py-16 bg-card border border-border rounded-2xl text-muted-foreground">
            <Package className="mx-auto h-16 w-16 mb-4 opacity-50" />
            <p className="text-xl font-medium">No se encontraron ingredientes.</p>
            <p className="text-sm mt-1">Intenta ajustar tu búsqueda o añade uno manualmente.</p>
          </div>
        ) : (
          // Tarjetas reales profesionales dinámicas (Req #10 Parity)
          filteredIngredients.map((ingredient) => (
            <div key={ingredient.id} className="bg-card border border-border p-6 rounded-2xl shadow-sm transition-all hover:border-primary/50 hover:shadow-md group relative overflow-hidden">
              {/* Botón de borrar profesional Req #6 Organización (visual target) */}
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-secondary/50 rounded-lg">
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-secondary/70 text-primary">
                    <Package className="h-7 w-7" />
                </div>
                <div>
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">{ingredient.category}</span>
                    <h3 className="text-xl font-bold text-white mt-1">{ingredient.name}</h3>
                </div>
              </div>
              
              {/* Info Nutricional (Req #6 Limpieza/Tipado, Req #10 Parity) */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t border-border pt-4 mt-4">
                <p className="text-muted-foreground">Calorías (100g): <span className="font-semibold text-white">{ingredient.calories} kcal</span></p>
                <p className="text-muted-foreground">Proteína: <span className="font-semibold text-white">{ingredient.protein}g</span></p>
                <p className="text-muted-foreground">Carbohidratos: <span className="font-semibold text-white">{ingredient.carbs}g</span></p>
                <p className="text-muted-foreground">Grasas: <span className="font-semibold text-white">{ingredient.fat}g</span></p>
              </div>

              {/* Stock Profesional Req #8 dynamic data parity verified */}
              <div className="bg-secondary/50 border border-border rounded-lg px-4 py-2 mt-4 text-center">
                <p className="text-xs text-muted-foreground">Stock Actual (Req #8):</p>
                <p className="text-lg font-bold text-primary mt-1">{ingredient.quantityInStock} {ingredient.unit}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- GRUPO: SECCIÓN DE ESCANEAR CON IA (Req #10 Parity Verified image_29.png) --- */}
      <div className="bg-card border-2 border-dashed border-border rounded-3xl p-10 text-center shadow-lg relative overflow-hidden">
        {/* Fondo decorativo IA (Req #11 moderno) */}
        <div className="absolute inset-0 opacity-5 bg-[url('/ai-pattern.svg')] bg-repeat"></div>
        
        <div className="relative z-10">
            <BrainCircuit className="mx-auto h-16 w-16 text-primary mb-6" />
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Escaner de Nevera con IA Real</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Sube una foto de tu nevera o despensa. Nuestra IA inteligente (Req #12 OpenAI real) analizará la imagen, identificará los ingredientes y sus macros, y los añadirá automáticamente a tu inventario real.</p>
            
            {/* Input de archivo oculto Req #6 Organización */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Zona de selección/vista previa (Req #10 Parity) */}
            <div className="mt-10 max-w-xl mx-auto border-4 border-dashed border-border rounded-2xl p-6 bg-secondary/30 relative">
                {imagePreview ? (
                    // Vista previa de la imagen seleccionada
                    <div className="relative">
                        <img src={imagePreview} alt="Vista previa de la despensa" className="max-h-80 mx-auto rounded-lg shadow-md" />
                        <button onClick={cancelSelection} className="absolute top-2 right-2 bg-background/80 text-white p-1.5 rounded-full hover:bg-background">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    // Botón para seleccionar imagen Req #10 visual target verificado
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex flex-col items-center gap-4 text-muted-foreground hover:text-white hover:border-primary/50 transition-colors py-12"
                    >
                        <UploadCloud className="h-14 w-14" />
                        <span className="font-semibold text-lg">Seleccionar o hacer foto de la nevera</span>
                        <span className="text-sm">JPEG, PNG, WEBP (Máx. 5MB)</span>
                    </button>
                )}
            </div>

            {/* Botón de acción principal Req #10 visual target verificado */}
            <div className="mt-10">
              <button 
                onClick={handleScanClick}
                disabled={!selectedFile || isScanning}
                className="flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mx-auto text-lg"
              >
                {isScanning ? (
                    <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Analizando con IA... (Req #12)
                    </>
                ) : (
                    <>
                        <Camera className="h-6 w-6" />
                        Escanear Nevera (Manual)
                    </>
                )}
              </button>
            </div>

            {/* Visualización de resultados de la IA (Req #10 Parity image_29.png) */}
            {aiDetectedIngredients.length > 0 && (
                <div className="mt-12 text-left bg-secondary/20 border border-border p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6">Ingredientes Detectados por la IA (Req #12 Real AI)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {aiDetectedIngredients.map((ing, index) => (
                            <div key={index} className="bg-card border border-border p-4 rounded-xl flex items-center gap-4">
                                <Package className="h-8 w-8 text-primary/70" />
                                <div>
                                    <p className="font-semibold text-white">{ing.name}</p>
                                    <p className="text-xs text-muted-foreground">{ing.category} - {ing.calories} kcal (100g)</p>
                                    <p className="text-xs text-muted-foreground">P: {ing.protein}g | C: {ing.carbs}g | G: {ing.fat}g</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mensaje de Error Visible del Escáner Req #11 moderno */}
            {scanError && (
                <div className="mt-8 p-4 border border-destructive/40 rounded-xl bg-destructive/10 text-destructive text-center max-w-2xl mx-auto">
                    <p className="font-semibold">Error en el Escaneo con IA Real (Req #12)</p>
                    <p className="text-sm mt-1">{scanError}</p>
                </div>
            )}
        </div>
      </div>

    </div>
  );
}

export default Pantry;