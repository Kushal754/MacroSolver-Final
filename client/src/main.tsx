// client/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' // Importamos RouterProvider y createBrowserRouter
import App from './App.tsx'
import './index.css'
import Dashboard from './pages/Dashboard.tsx'
import Pantry from './pages/Pantry.tsx' // <--- Importamos el componente de Despensa
import MacroSolver from './pages/MacroSolver.tsx'
import Entrenador from './pages/Entrenador';

// Configuración profesional de rutas (Req #5 Organización)
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App actúa como el Layout principal
    children: [
      {
        path: "/",
        element: <Dashboard />, // Ruta por defecto: /
      },
      {
        path: "pantry", // <--- Definimos la ruta /pantry Req #10 Parity Verified
        element: <Pantry />, // <--- Que cargue el componente Pantry
      },

      {
      path: "macrosolver",
      element: <MacroSolver />,
      },

      {
      path: "entrenador",
      element: <Entrenador />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} /> {/* <--- Usamos RouterProvider con nuestra configuración */}
  </React.StrictMode>,
)