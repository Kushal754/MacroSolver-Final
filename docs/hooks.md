# Estado y Hooks de React (Optimización)

Para gestionar la reactividad y el ciclo de vida de los componentes en **MacroSolver**, se han implementado diversos Hooks nativos de React y Hooks personalizados, aplicando técnicas de optimización avanzadas para garantizar un rendimiento fluido.

## 1. Gestión del Estado UI (`useState`)
El hook `useState` se ha utilizado exclusivamente para gestionar el estado efímero de la interfaz de usuario.
* **Control de Formularios:** Inputs bidireccionales en el modal de añadir ingredientes (`newIngredient`).
* **Estados de Carga:** Variables booleanas (`isLoading`, `isScanning`, `isCalculating`) para mostrar *spinners* condicionales y deshabilitar botones, previniendo el envío múltiple de peticiones al servidor.
* **Navegación Interna:** Alternancia entre la vista de selección y la vista de resultados dentro de `MacroSolver.tsx` (`view`).

## 2. Efectos Secundarios (`useEffect`)
Se ha limitado el uso de `useEffect` a interacciones estrictamente necesarias con sistemas externos al árbol de React:
* **Data Fetching Inicial:** Se utiliza con un array de dependencias vacío `[]` al montar los componentes (`Pantry`, `MacroSolver`) para realizar la petición inicial HTTP (GET) y poblar el estado con los datos de la base de datos.
* **Manipulación del DOM Root:** Dentro del proveedor del tema, un `useEffect` escucha los cambios en la variable `theme` para inyectar o remover la clase `dark` directamente en la etiqueta `<html>` del documento.

## 3. Optimización de Cálculos (`useMemo`)
En pantallas con alta carga de datos como la Despensa, recalcular el filtrado de ingredientes en cada renderizado (por ejemplo, al abrir un modal) consumiría recursos de CPU innecesarios.
* Se ha envuelto el motor de filtrado (`filteredIngredients`) en un `useMemo`. 
* Este hook garantiza que la lógica de búsqueda por texto y categoría solo se ejecute cuando el inventario original o los términos de búsqueda cambian realmente, devolviendo la versión memorizada en caso contrario.

## 4. Estabilidad referencial (`useCallback`)
Dado que las funciones en JavaScript se recrean en cada renderizado, pasar funciones como propiedades a componentes hijos o usarlas en mapeos largos puede causar renderizados innecesarios.
* Funciones críticas como `handleDelete` o `handleEditClick` se han encapsulado en `useCallback`. 
* Esto "congela" la referencia de la función en memoria, asegurando que las filas de la tabla de ingredientes no se vuelvan a repintar a menos que sea estrictamente necesario.

## 5. Hooks Personalizados (Custom Hooks)

### `useDebounce` (Control de concurrencia)
Para evitar saturar el renderizado (o posibles llamadas a API) mientras el usuario teclea rápidamente en la barra de búsqueda, se ha creado el hook reutilizable `useDebounce.ts`.
* **Funcionamiento:** Recibe un valor y un retraso en milisegundos (ej. 300ms). En lugar de devolver cada pulsación de tecla inmediatamente, el hook reinicia un temporizador (`setTimeout`) con cada pulsación. Solo cuando el usuario deja de escribir durante 300ms, el hook actualiza el valor devuelto.
* **Impacto:** Reduce drásticamente la ejecución del filtro `useMemo` asociado a la barra de búsqueda, logrando una experiencia de usuario (UX) mucho más profesional y fluida.