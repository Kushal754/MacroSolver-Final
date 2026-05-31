import { useState, useEffect } from 'react';
import type { ReactNode } from 'react'; 
// 1. Importamos Link y useLocation para la navegación profesional
import { Link, useLocation } from 'react-router-dom'; 

import { BrainCircuit, LayoutDashboard, Utensils, Users, ChevronDown, UserCircle, LogOut, Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPageTitle: string;
}

function Layout({ children, currentPageTitle }: LayoutProps) {
  
  const [theme, setTheme] = useState('dark');
  // 2. Usamos la ubicación actual para iluminar el botón correcto del menú
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
    { name: 'Dispensador', icon: Utensils, href: '/pantry' }, // <--- Cambiado el nombre y la ruta
    { name: 'Users', icon: Users, href: '/users' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      
      {/* 1. SIDEBAR (Navegación Lateral) */}
      <aside className="w-64 border-r border-border bg-card p-6 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2.5 rounded-xl bg-primary text-primary-foreground">
            <BrainCircuit className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">MacroSolver</h1>
        </div>
        
        {/* Enlaces de Navegación */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item, index) => {
            // Comprobamos si la ruta actual coincide con la ruta del botón
            const isActive = location.pathname === item.href;

            return (
              // 3. Sustituimos la etiqueta <a> por <Link> de React Router
              <Link 
                key={index} 
                to={item.href} 
                className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-lg font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'}`}
              >
                <item.icon className="h-6 w-6" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL (Derecha) */}
      <div className="flex-1 flex flex-col">
        
        {/* 2. HEADER (Cabecera Superior) */}
        <header className="h-20 border-b border-border bg-card flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold">{currentPageTitle}</h2>
          
          <div className="flex items-center gap-4">
            {/* Interruptor de Tema */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 text-lg"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Menú de Usuario */}
            <button className="flex items-center gap-3.5 px-4 py-2 border border-border rounded-full bg-background/50 hover:bg-secondary transition-colors">
              <UserCircle className="h-7 w-7 text-muted-foreground" />
              <span className="font-medium text-lg">admin@macrosolver.com</span>
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="p-2.5 rounded-full hover:bg-destructive/10 text-destructive" title="Log out">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* 3. ÁREA DE CONTENIDO (Donde irán los hijos) */}
        <main className="flex-1 p-8 bg-secondary/10">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;