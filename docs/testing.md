# Testing, Pruebas y Corrección de Errores

Durante el ciclo de vida de **MacroSolver**, se ha llevado a cabo un proceso exhaustivo de pruebas manuales y depuración (debugging) para garantizar la estabilidad del sistema en diferentes entornos y resoluciones.

## 1. Pruebas Funcionales (Manual Testing)
Se validaron los flujos críticos de la aplicación:
* **CRUD de Despensa:** Se comprobó la correcta creación, lectura, actualización y eliminación de ingredientes. Se forzaron errores (ej. enviar formularios vacíos) para verificar la validación de HTML5 y el manejo de promesas rechazadas en el cliente API.
* **Motor MacroSolver:** Se verificó que la integración con la API de OpenAI respondiera consistentemente con la interfaz `AIRecipe`. Se probaron escenarios límite, como enviar peticiones sin ingredientes seleccionados, validando que el botón se deshabilita correctamente.

## 2. Pruebas de Diseño Responsivo
Se utilizó el inspector de dispositivos de las herramientas de desarrollador del navegador para asegurar la adaptabilidad del diseño:
* **Móvil (Viewport < 768px):** Comprobación de la transformación del Sidebar en una barra de navegación inferior (Bottom Tab Bar) y la mutación de las tablas de datos en tarjetas (Cards) apilables para evitar el scroll horizontal.
* **Escritorio (Viewport > 1024px):** Verificación de la expansión de la cuadrícula de macros y el aprovechamiento del espacio mediante Grid y Flexbox.

## 3. Resolución de Bugs Críticos
Durante el desarrollo se identificaron y solucionaron varios problemas técnicos significativos:
1.  **Fallo de Enrutamiento en Layout (Pantalla Negra):** Al implementar las rutas anidadas en React Router v6, las páginas dejaron de renderizarse. Se diagnosticó mediante la consola de React Developer Tools y se solucionó sustituyendo el paso de la propiedad `{children}` por el componente oficial `<Outlet />`.
2.  **Rutas Relativas Erróneas:** El compilador de Vite arrojó errores al mover `Layout.tsx` a la carpeta `components/ui/`. Se corrigieron las rutas de importación del Contexto (`../../context/ThemeContext`) para restablecer el árbol de dependencias.
3.  **Fuga de Variables de Entorno en Git:** GitHub bloqueó un *push* mediante su protección contra secretos porque el archivo `.env` se rastreó por error antes de añadirlo al `.gitignore`. Se resolvió forzando el borrado de la caché del índice de Git (`git rm --cached -f`) y reescribiendo el historial de confirmaciones.