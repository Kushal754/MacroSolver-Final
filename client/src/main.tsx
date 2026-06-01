// client/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' 
import App from './App.tsx'
import './index.css'
import Dashboard from './pages/Dashboard.tsx'
import Pantry from './pages/Pantry.tsx' 
import MacroSolver from './pages/MacroSolver.tsx'
import Entrenador from './pages/Entrenador';
import BatchCooking from './pages/BatchCooking';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      {
        path: "/",
        element: <Dashboard />, 
      },
      {
        path: "pantry", 
        element: <Pantry />, 
      },

      {
      path: "macrosolver",
      element: <MacroSolver />,
      },

      {
      path: "entrenador",
      element: <Entrenador />,
      },

      {
      path: "batch",
      element: <BatchCooking />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} /> {/* <--- Usamos RouterProvider con nuestra configuración */}
  </React.StrictMode>,
)