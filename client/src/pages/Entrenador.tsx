import { useState } from 'react';
import { AlertTriangle, Dumbbell, Target, MapPin, Timer, Clock, ChevronRight, Activity } from 'lucide-react';

// Tipamos la respuesta que esperamos de la IA
interface Exercise {
  name: string;
  reps: string;
  rest: string;
}

interface Routine {
  title: string;
  tag: string;
  description: string;
  exercises: Exercise[];
}

function Entrenador() {
  const [view, setView] = useState<'config' | 'routine'>('config');
  const [isGenerating, setIsGenerating] = useState(false);
  const [routine, setRoutine] = useState<Routine | null>(null);

  // Estados de configuración para la IA
  const [objective, setObjective] = useState('Perder Grasa');
  const [location, setLocation] = useState('Casa (Sin material)');
  const [duration, setDuration] = useState('30 min');

  const currentDate = new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  }).format(new Date());

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/trainer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective, location, duration }),
      });

      if (!response.ok) throw new Error('Error al generar la rutina');
      
      const data = await response.json();
      setRoutine(data);
      setView('routine');
    } catch (error) {
      console.error("Error contactando al Entrenador IA:", error);
      alert("Hubo un problema al generar la rutina con IA. Revisa la consola del servidor.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- VISTA 1: CONFIGURACIÓN ---
  if (view === 'config') {
    return (
      <div className="w-full p-8 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
        
        <div className="flex justify-between items-start mb-8 pt-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">Entrenador IA</h2>
            <p className="text-gray-500 dark:text-gray-400 capitalize">{currentDate}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md font-medium hover:bg-red-500/20 transition-colors">
            <AlertTriangle className="w-4 h-4" />
            Pánico
          </button>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Entrenador IA</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">La IA evalúa tu objetivo y disponibilidad para generar la rutina más inteligente para hoy.</p>
        </div>

        {/* Panel Superior Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <h4 className="text-gray-400 font-medium mb-6 w-full text-left">Nivel de Disposición</h4>
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#1f2937" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="50.24" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-white">
                <span className="text-3xl font-bold">100%</span>
                <span className="text-xs text-gray-500">Listo</span>
              </div>
            </div>
            <div className="w-full bg-[#111] p-3 rounded-xl border border-gray-800 mt-2">
              <p className="text-green-500 font-medium text-sm">Óptimo para entrenar</p>
              <p className="text-xs text-gray-500">Sistema recuperado al máximo</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <h4 className="text-gray-200 font-medium">Consistencia Semanal</h4>
              </div>
              <span className="text-gray-500 text-sm">Objetivo: 4 días/semana</span>
            </div>
            <div className="flex-1 flex items-end justify-between px-2 gap-2 mt-4 relative">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <polyline points="0,80 100,60 200,90 300,40 400,70 500,30 600,50" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                <div key={day} className="flex flex-col items-center gap-2 z-10">
                  <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-[#0a0a0a]"></div>
                  <span className="text-xs text-gray-600">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel de Configuración de la Rutina */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 mb-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500 border border-green-500/20">
            <Dumbbell className="w-8 h-8" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Configura tu Sesión de Hoy</h3>
          <p className="text-gray-400 max-w-lg mb-8">Ajusta los parámetros para que la IA diseñe el entrenamiento perfecto adaptado a tu situación actual.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <Target className="w-4 h-4 text-blue-500" /> Objetivo
              </label>
              <select 
                value={objective} onChange={(e) => setObjective(e.target.value)}
                className="w-full bg-[#111] border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option>Perder Grasa</option>
                <option>Ganar Masa Muscular</option>
                <option>Mantenimiento (Salud)</option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <MapPin className="w-4 h-4 text-purple-500" /> Lugar
              </label>
              <select 
                value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#111] border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option>Casa (Sin material)</option>
                <option>Gimnasio</option>
                <option>Parque / Calistenia</option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <Timer className="w-4 h-4 text-orange-500" /> Tiempo Disponible
              </label>
              <select 
                value={duration} onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#111] border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option>15 min (Express)</option>
                <option>30 min</option>
                <option>45 min</option>
                <option>60 min</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-8 py-4 bg-[#10b981] hover:bg-emerald-500 text-white rounded-xl font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            {isGenerating ? <Activity className="w-6 h-6 animate-spin" /> : <Dumbbell className="w-6 h-6" />}
            {isGenerating ? 'Generando rutina inteligente...' : 'Generar mi rutina de hoy'}
          </button>
        </div>
      </div>
    );
  }

  // --- VISTA 2: RUTINA GENERADA ---
  if (!routine) return null;

  return (
    <div className="w-full p-8 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      
      <div className="flex justify-between items-start mb-8 pt-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">Entrenador IA</h2>
          <p className="text-gray-500 dark:text-gray-400 capitalize">{currentDate}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md font-medium hover:bg-red-500/20 transition-colors">
          <AlertTriangle className="w-4 h-4" /> Pánico
        </button>
      </div>

      <div className="flex justify-between items-end mb-6">
        <button 
          onClick={() => setView('config')}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-300"
        >
          Volver a configurar
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-orange-500/30 rounded-2xl p-6 shadow-sm mb-6 flex items-start gap-5">
        <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 border border-orange-500/20">
          <Dumbbell className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-white">{routine.title}</h1>
            <span className="px-2.5 py-0.5 bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-full text-xs font-semibold">{routine.tag}</span>
          </div>
          <p className="text-gray-400">{routine.description}</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-white">Ejercicios</h3>
          </div>
          <span className="text-gray-500 text-sm">{routine.exercises.length} ejercicios</span>
        </div>

        <div className="flex flex-col">
          {routine.exercises.map((exercise, index) => (
            <div key={index} className="flex items-center justify-between p-6 border-b border-gray-800/50 hover:bg-[#111] transition-colors group">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 bg-[#1a1a1a] text-gray-300 font-bold text-lg rounded-xl flex items-center justify-center ${index === 0 ? 'text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : ''}`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-white font-medium text-lg">{exercise.name}</h4>
                  <p className="text-gray-400 text-sm mt-0.5">{exercise.reps}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" /> {exercise.rest}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-300 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Entrenador;