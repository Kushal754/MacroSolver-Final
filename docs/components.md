# Desarrollo de Componentes y UI

El frontend de **MacroSolver** se ha construido utilizando React 18 mediante un enfoque de componentes funcionales. Se ha priorizado la modularidad, la reutilización y el diseño responsivo (Mobile-First) utilizando Tailwind CSS.

## 1. Tipado Estricto con TypeScript
Para garantizar la robustez de los componentes y evitar errores en tiempo de ejecución, se han definido interfaces (contratos de datos) para todas las entidades que consumen los componentes.

* **`Ingredient`**: Define la estructura de los alimentos (id, nombre, macros, stock). Es consumido intensivamente por la tabla de la despensa y las tarjetas de selección.
* **`AIRecipe`**: Define la estructura compleja que devuelve GPT-4o, asegurando que el componente de renderizado de la receta (en `MacroSolver.tsx`) siempre reciba un título, descripción, pasos y un desglose exacto de macronutrientes.

## 2. Patrones de Composición (Componente Layout)
El componente principal de la aplicación es `Layout.tsx`. Se ha diseñado utilizando el patrón de composición y el componente `<Outlet />` de React Router. 
* En lugar de duplicar barras de navegación en cada pantalla, `Layout` actúa como un "envoltorio" maestro que mantiene el Sidebar (en escritorio), la barra inferior (en móviles) y la cabecera siempre visibles. 
* El contenido de cada vista individual (Dashboard, Pantry, etc.) se inyecta de forma dinámica dentro de la etiqueta `<main>` de este Layout, optimizando el repintado del DOM.

## 3. Componentes de Vistas (Pages)
Las funcionalidades principales se han encapsulado en componentes de nivel de página, que actúan como "contenedores inteligentes" (Smart Components) gestionando su propio estado local y llamadas a la API:

* **`Pantry` (Mi Despensa):** Un componente complejo que combina una barra de herramientas (búsqueda y filtros), una zona de subida de archivos para el escáner IA y una tabla de datos responsiva. En resoluciones altas (`md:`) se muestra como una tabla tradicional, mientras que en dispositivos móviles, gracias a Tailwind, las filas mutan a un diseño de "Tarjetas" individuales para evitar el scroll horizontal.
* **`MacroSolver` (Motor IA):** Se divide lógicamente en dos estados visuales dentro del mismo componente. La "Vista de Selección" muestra una cuadrícula de ingredientes seleccionables, y la "Vista de Receta" renderiza dinámicamente los totales nutricionales y los pasos de preparación devueltos por el servidor.

## 4. Estilos y Tailwind CSS
No se han utilizado hojas de estilo CSS tradicionales. Toda la aplicación está estilizada mediante clases de utilidad de Tailwind.
* Se ha empleado el modificador `dark:` en todos los elementos contenedores y de texto para soportar el cambio dinámico de tema.
* Se ha utilizado el modificador `md:` (media queries) para transformar radicalmente la disposición de los elementos en pantallas móviles vs escritorio (ej. `flex-col md:flex-row`).