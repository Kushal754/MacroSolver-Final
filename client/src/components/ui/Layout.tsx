import { useState, useEffect } from 'react';
import type { ReactNode } from 'react'; 
import { Link, useLocation } from 'react-router-dom'; 

import { 
  LayoutDashboard, 
  ShoppingBasket, 
  Calculator, 
  Dumbbell, 
  CalendarDays, 
  UserCircle, 
  Sun, 
  Moon,
  Zap
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPageTitle?: string; // Lo dejamos opcional por si el router lo envía
}

function Layout({ children }: LayoutProps) {
  
  const [theme, setTheme] = useState('dark');
  const location = useLocation(); 

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') { root.classList.add('dark'); } 
    else { root.classList.remove('dark'); }
  }, [theme]);
  
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // --- ESTRUCTURA DE NAVEGACIÓN ---
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Mi Despensa', icon: ShoppingBasket, href: '/pantry' },
    { name: 'MacroSolver', icon: Calculator, href: '/macrosolver' },
    { name: 'Entrenador IA', icon: Dumbbell, href: '/entrenador' },
    { name: 'Batch Cooking', icon: CalendarDays, href: '/batch' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#000000] text-gray-900 dark:text-gray-100 flex flex-col md:flex-row transition-colors duration-300 font-sans">
      
      {/* 1. SIDEBAR (Solo Escritorio: Oculto en móvil, visible desde "md") */}
      <aside className="hidden md:flex w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] p-4 flex-col h-screen sticky top-0">
        
        {/* Logo v0 */}
        <div className="flex items-center gap-3 mb-8 p-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#0070f3] text-white shadow-[0_0_15px_rgba(0,112,243,0.4)]">
            <Zap className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none mb-1">MacroSolver</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">AI Assistant</p>
          </div>
        </div>
        
        {/* Título de sección */}
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3 px-3 uppercase tracking-wider">
          Navegación
        </div>

        {/* Enlaces de Navegación (Escritorio) */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;

            return (
              <Link 
                key={index} 
                to={item.href} 
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#111] dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-500'}`} />
                  {item.name}
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        
        {/* 2. HEADER (Adaptativo) */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-md flex items-center justify-between md:justify-end px-4 md:px-8 sticky top-0 z-40">
          
          {/* Logo en móvil (Oculto en escritorio para no duplicar el del sidebar) */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0070f3] text-white">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">MacroSolver</h1>
          </div>

          {/* Botones de Tema y Usuario */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 border border-blue-500/30 hover:bg-blue-600/30 transition-colors">
              <UserCircle className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* 3. ÁREA DE CONTENIDO (Padding inferior extra en móvil para que la barra no tape el contenido) */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-black pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* 4. BARRA DE NAVEGACIÓN INFERIOR (Solo Móvil: Oculta en "md") */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={index}
                to={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-500' 
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <div className={`p-1 rounded-full ${isActive ? 'bg-blue-50 dark:bg-blue-500/10' : ''}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-semibold leading-none text-center">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}

export default Layout;