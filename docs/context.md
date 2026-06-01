# Context API y Estado Global

En el desarrollo de **MacroSolver**, se ha utilizado **Context API** de React para manejar datos que deben ser accesibles por toda la aplicación de manera global, evitando el antipatrón conocido como *prop-drilling* (pasar propiedades manualmente a través de múltiples niveles de componentes hijos).

## Implementación: ThemeContext
La aplicación cuenta con una funcionalidad de Modo Claro / Modo Oscuro que afecta estructuralmente a todo el árbol de componentes y al DOM base (`<html>`). 

En lugar de gestionar este estado en el enrutador superior y pasarlo componente por componente, se ha implementado un `ThemeContext`:
1.  **Creación del Contexto:** Se define la interfaz `ThemeContextType` en TypeScript para garantizar que cualquier componente que consuma el contexto reciba un string de tema y una función de alternancia (`toggleTheme`).
2.  **El Provider (`ThemeProvider`):** Actúa como un contenedor lógico de alto nivel. Inicializa el estado leyendo la preferencia del usuario guardada en el `LocalStorage` y utiliza un `useEffect` para inyectar o eliminar la clase de Tailwind `dark` en el DOM.
3.  **Consumo a través de Custom Hook:** Se exporta un hook personalizado llamado `useTheme`. Este hook incluye una validación de seguridad: si un componente intenta consumir el tema fuera de los límites del `ThemeProvider`, arroja un error controlado, garantizando la integridad de la aplicación.