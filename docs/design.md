# Arquitectura y Diseño de la Aplicación

Este documento detalla las decisiones arquitectónicas fundamentales tomadas durante el desarrollo de **MacroSolver**, abarcando tanto la capa de presentación (Frontend) como la lógica de negocio y persistencia (Backend).

## 1. Arquitectura General del Sistema
La aplicación sigue una arquitectura **Cliente-Servidor (Full-Stack)** basada en el stack tecnológico moderno:
* **Frontend (SPA - Single Page Application):** Desarrollado con React 18, TypeScript y Vite. La interfaz está construida mediante un enfoque *Mobile-First* utilizando Tailwind CSS.
* **Backend (API REST):** Implementado con Node.js y Express. Sigue una arquitectura modular por capas (Rutas -> Controladores) para separar la gestión de red de la lógica de negocio.
* **Base de Datos:** SQLite, ofreciendo una persistencia de datos relacional ligera y embebida, ideal para el prototipado y el MVP.
* **Servicios Externos:** Integración nativa con la API de OpenAI (modelo `gpt-4o`) para el procesamiento de lenguaje natural y generación estructurada de recetas (JSON).

## 2. Estructura de Componentes (Frontend)
El frontend sigue una jerarquía basada en "Páginas" (Vistas principales) y "Componentes" (Elementos de UI reutilizables).

### Componentes Principales y Enrutamiento
La aplicación utiliza `react-router-dom` con una estructura de *Nested Routes* (Rutas Anidadas):
* `<Layout />`: Componente envolvente principal. Contiene la navegación (Sidebar en Desktop / Bottom Tab en Móvil) y la cabecera. Utiliza `<Outlet />` para inyectar dinámicamente el contenido de las páginas.
* `<Pantry />`, `<MacroSolver />`, `<BatchCooking />`, `<Dashboard />`: Componentes de nivel superior que actúan como páginas (Views).

### Componentes Reutilizables
Para mantener el principio DRY (Don't Repeat Yourself), se ha extraído lógica y diseño en elementos compartidos:
* **Iconografía:** Uso intensivo de `lucide-react` para estandarizar la iconografía sin sobrecargar el DOM.
* **Contenedores de Tarjetas (Cards):** Estilos compartidos en Tailwind para mantener la coherencia visual (`bg-white dark:bg-[#0a0a0a] border rounded-2xl`).
* **Botones y Formularios:** Clases consistentes para los estados *hover*, *disabled* y *focus*.

## 3. Gestión del Estado
La estrategia de estado se divide según el alcance de los datos:

* **Estado Local (UI State):** Gestionado con `useState` para controlar inputs de formularios, apertura de modales (`isAddModalOpen`) y *spinners* de carga (`isLoading`).
* **Estado Derivado (Performance):** Gestionado con `useMemo` para listas filtradas (búsqueda de ingredientes en la despensa). Esto previene que se recalculen los filtros en cada renderizado de React.
* **Estado Global (Application State):** Gestionado mediante **Context API** (`ThemeContext`). Se utiliza para inyectar globalmente la preferencia del Modo Claro/Oscuro sin caer en el *prop-drilling* (pasar *props* a través de múltiples niveles de componentes).

## 4. Diseño del Backend y Contratos de la API (REST)
El backend expone recursos RESTful bajo el prefijo `/api`. Las peticiones se centralizan en el frontend mediante el cliente unificado `apiClient.ts`.

### Endpoints Principales
1.  **Recurso: Ingredientes (`/api/ingredients`)**
    * `GET /`: Devuelve el array de ingredientes disponibles en stock.
    * `POST /`: Crea un nuevo ingrediente (Body: *name, category, calories, protein, carbs, fat, quantity, unit*).
    * `PUT /:id`: Actualiza un ingrediente existente.
    * `DELETE /:id`: Elimina un ingrediente de la base de datos.
2.  **Recurso: Inteligencia Artificial**
    * `POST /api/macros/generate`: Recibe un array de ingredientes seleccionados y devuelve una receta generada por GPT-4o.
    * `POST /api/batch/generate`: Recibe ingredientes clave y devuelve una planificación de 5 días.
    * `POST /api/pantry/scan`: Recibe una imagen (`multipart/form-data`) y utiliza *Vision AI* para devolver los ingredientes detectados.

## 5. Estrategia de Persistencia de Datos
* **Servidor (Única fuente de verdad):** Todos los datos críticos (Ingredientes, Macros, Stock) viven en la base de datos SQLite del backend. El frontend simplemente consume, muestra y muta estos datos a través de la API.
* **Cliente (Navegador):** Solo se persiste en el `LocalStorage` la preferencia de la interfaz de usuario (Tema Oscuro/Claro), asegurando que los datos sensibles no queden expuestos ni desincronizados en el navegador.

## 6. Diagrama de Flujo de Datos

```text
[ INTERFAZ DE USUARIO (React) ]
       │          ▲
       │          │ (3. Datos tipados y UI de éxito/error)
       ▼          │
[ CLIENTE API (apiClient.ts) ] ---> Convierte peticiones a fetch con promesas tipadas.
       │          ▲
       │          │ (2. Respuestas JSON estructuradas)
       ▼          │
[ EXPRESS SERVER (Controladores) ] ---> Capa de seguridad y validación de negocio.
       │          ▲
       ├──────────┴─────────────────────────┐
       │ (1a. Consultas CRUD)               │ (1b. Prompts + Datos)
       ▼                                    ▼
[ BASE DE DATOS (SQLite) ]           [ API EXTERNA (OpenAI GPT-4o) ]