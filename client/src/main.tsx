import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from "./components/ui/Layout";
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// Aplicamos Carga Perezosa (React.lazy) para cumplir con el BONUS de la rúbrica
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Pantry = lazy(() => import('./pages/Pantry'));
const MacroSolver = lazy(() => import('./pages/MacroSolver'));
const Entrenador = lazy(() => import('./pages/Entrenador'));
const BatchCooking = lazy(() => import('./pages/BatchCooking'));
const NotFound = lazy(() => import('./pages/NotFound')); // Requisito 9: Página 404

// Componente de carga para el Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout children={undefined} />
      </Suspense>
    ),
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/pantry", element: <Pantry /> }, 
      { path: "/macrosolver", element: <MacroSolver /> },
      { path: "/entrenador", element: <Entrenador /> },
      { path: "/batch", element: <BatchCooking /> },
    ]
  },
  // Requisito 9: Captura de cualquier ruta rota y desvío al 404
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    )
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Requisito 8: Compartimos el estado global del tema con toda la aplicación */}
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);