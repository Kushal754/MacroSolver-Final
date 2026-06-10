import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from "./components/ui/Layout";
import { ThemeProvider } from './context/ThemeContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Pantry = lazy(() => import('./pages/Pantry'));
const MacroSolver = lazy(() => import('./pages/MacroSolver'));
const Entrenador = lazy(() => import('./pages/Entrenador'));
const BatchCooking = lazy(() => import('./pages/BatchCooking'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
        <Layout />
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
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    )
  }
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;