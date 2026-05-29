import './index.css';
// 1. Importamos el componente Layout que acabamos de crear y arreglar
import Layout from './components/ui/Layout'; 

function App() {
  // 2. ¡Ya no necesitamos theme state, ni efectos, ni iconos aquí!
  //    El componente Layout se encarga de todo eso.
  
  return (
    // 3. Usamos el componente Layout. Le pasamos el título de la página actual.
    <Layout currentPageTitle="Dashboard">
      
      {/* 4. Todo lo que pongamos AQUÍ DENTRO se pasará como 'children' al Layout
             y aparecerá en el área de contenido principal (derecha). */}
      
      <div className="flex h-full items-center justify-center border-2 border-dashed border-border rounded-2xl bg-secondary/30">
        <div className="text-center">
          <h1 className="text-4xl font-bold p-10 border rounded-lg bg-card shadow-lg">
            Hello, MacroSolver!
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            La refactorización orgánica ha funcionado. ¡Ahora el código está súper limpio y profesional!
          </p>
        </div>
      </div>
      
    </Layout>
  );
}

export default App;