import './index.css';
import Layout from './components/ui/Layout';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    // Cambiamos el título a algo genérico para que no diga "Dashboard" cuando estés en la despensa
    <Layout currentPageTitle="MacroSolver">
      
      {/* Sustituimos <Dashboard /> por <Outlet />. 
          Esto le dice a React que inyecte aquí la Despensa o el Dashboard dependiendo de la URL */}
      <Outlet />
      
    </Layout>
  );
}

export default App;