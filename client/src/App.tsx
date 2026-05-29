import './index.css';
import Layout from './components/ui/Layout'; 
// 1. Importamos la nueva página que acabamos de crear
import Dashboard from './pages/Dashboard'; 

function App() {
  return (
    // 2. Mantenemos el título "Dashboard"
    <Layout currentPageTitle="Dashboard">
      
      {/* 3. ¡Sustituimos TODO el placeholder viejo por el componente Dashboard!
             
             */}
      
      <Dashboard />
      
    </Layout>
  );
}

export default App;