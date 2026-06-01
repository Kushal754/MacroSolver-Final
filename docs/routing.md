# Sistema de Rutas y Navegación

El enrutamiento de la SPA (Single Page Application) se gestiona a través de **React Router (v6)**, implementando una arquitectura de rutas centralizadas y anidadas.

## Estructura de Enrutamiento
Se ha utilizado la función `createBrowserRouter` para definir un árbol de rutas declarativo:
* **Ruta Padre (`/`):** Asignada al componente `<Layout />`. Este componente maestro contiene los elementos de navegación persistentes (Sidebar en escritorio y Tab Bar inferior en móviles).
* **Rutas Hijas:** Los componentes de página (`Dashboard`, `Pantry`, `MacroSolver`, `Entrenador`, `BatchCooking`) se inyectan dinámicamente en el `<Layout />` mediante el componente `<Outlet />`. Esto permite que la navegación entre secciones sea instantánea sin recargar la página.

## Carga Perezosa (Lazy Loading) - Bonus
Para optimizar el tamaño del paquete inicial (*bundle size*) de la aplicación, todas las vistas principales se importan utilizando `React.lazy()`.
* Las páginas solo se descargan del servidor cuando el usuario navega hacia ellas.
* Durante la descarga, React Router renderiza un componente *fallback* a través de `<Suspense>`, mostrando un *spinner* de carga para mantener una buena experiencia de usuario.

## Manejo de Errores: Página 404
Se ha definido una ruta "comodín" (`path: "*"`) en el nivel superior de la configuración. Si el usuario intenta acceder a una URL inexistente, el enrutador captura la petición y renderiza el componente `<NotFound />`, guiando al usuario de vuelta al Dashboard principal mediante llamadas a la acción (CTAs) claras.