import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Tipamos nuestro contexto
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// Creamos el contexto
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Creamos el Provider
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') { 
      root.classList.add('dark'); 
    } else { 
      root.classList.remove('dark'); 
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Creamos nuestro PRIMER CUSTOM HOOK para consumir el contexto fácilmente
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
}