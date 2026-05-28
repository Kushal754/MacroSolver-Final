import './index.css';
import { useState, useEffect } from 'react'; 

function App() {
  
  const [theme, setTheme] = useState('dark');

  
  useEffect(() => {
    const root = window.document.documentElement; // Accedemos a la etiqueta <html>
    if (theme === 'dark') {
      root.classList.add('dark'); 
    } else {
      root.classList.remove('dark'); 
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground transition-colors duration-300">
      <h1 className="text-4xl font-bold p-10 border rounded-lg bg-card text-center relative">
        Hello, MacroSolver!
        {/* Botón para alternar el tema */}
        <button
          onClick={toggleTheme}
          className="absolute -top-12 right-0 p-2 border rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xl"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </h1>
    </div>
  );
}

export default App;