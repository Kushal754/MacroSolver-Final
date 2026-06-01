# Gestión y Organización del Proyecto

## 1. Metodología Elegida
Para el desarrollo de **MacroSolver**, se ha optado por implementar un marco de trabajo basado en **Kanban**, adaptado para el desarrollo individual (Solo-Developer). 

Se ha elegido Kanban por encima de Scrum debido a la naturaleza del proyecto: un desarrollo continuo con requisitos técnicos que evolucionan a medida que se integran tecnologías complejas (como la API de OpenAI), donde fijar Sprints de tiempo cerrado limitaría la flexibilidad necesaria para resolver bloqueos de arquitectura. El enfoque principal ha sido limitar el Trabajo en Progreso (WIP) para asegurar que cada funcionalidad (ej. Módulo de Batch Cooking) estuviera completamente terminada, probada y sin *bugs* antes de iniciar la siguiente.

## 2. Herramientas de Gestión
* **Gestión de Tareas:** Trello.
* **Control de Versiones:** Git y GitHub.
* **Ramas (Branching):** Se ha utilizado una estrategia de integración continua directa sobre la rama `main` (trunk-based development simplificado), apoyada en *commits* atómicos y descriptivos.

## 3. Estructura del Tablero Kanban
El tablero de Trello se ha estructurado en 5 columnas para visualizar claramente el ciclo de vida del desarrollo:

1.  **Backlog:** El "cajón de sastre" con todas las ideas, mejoras opcionales y funcionalidades futuras (ej. Autenticación JWT, Progressive Web App).
2.  **To Do (Por Hacer):** Tareas priorizadas listas para ser desarrolladas en el corto plazo. Cada tarjeta incluye subtareas técnicas (ej. "Crear Frontend de Despensa" -> *Crear UI*, *Conectar con fetch*, *Manejar estados de carga*).
3.  **In Progress (En Progreso):** Tareas en las que se está escribiendo código activamente. El objetivo ha sido mantener un máximo de 1-2 tareas aquí para evitar cuellos de botella.
4.  **Review (Revisión):** Fase de pruebas manuales y refactorización. Aquí se ha verificado el diseño responsive, la gestión de errores (ej. control de respuestas 500 del servidor) y la optimización de *hooks* (`useMemo`, `useCallback`).
5.  **Done (Hecho):** Funcionalidades completadas, fusionadas con el repositorio principal y listas para producción.

## 4. Fases del Desarrollo
El desarrollo se dividió en las siguientes fases lógicas, representadas por *Epics* (bloques grandes de trabajo) en la gestión del proyecto:

* **Fase 1: Setup y Estructura Base:** Inicialización del proyecto con Vite (React + TypeScript) y configuración de Tailwind CSS. Creación del enrutador (React Router) y la estructura de carpetas (`components`, `pages`, `hooks`, `context`, `api`).
* **Fase 2: Arquitectura del Servidor (Backend):** Implementación de Node.js + Express con arquitectura por capas (Controladores y Rutas). Configuración de la base de datos (SQLite) y endpoints REST para los ingredientes.
* **Fase 3: Desarrollo UI y Componentes Centrales:** Maquetación del Dashboard, formulario de Despensa y componente principal de MacroSolver. Aplicación de estados controlados en React.
* **Fase 4: Integración IA (El "Core"):** Conexión segura con GPT-4o desde el backend. Forzado de respuestas en formato JSON para su renderizado estructurado en el frontend.
* **Fase 5: Optimizaciones y Refactorización (Nivel Avanzado):** Sustitución de llamadas `fetch` por un Cliente API tipado (`apiClient.ts`). Implementación de Context API para el modo oscuro, y *Custom Hooks* (`useDebounce`) para optimizar llamadas de red. Aplicación de *Lazy Loading* para mejora del rendimiento.
* **Fase 6: Documentación y Despliegue:** Redacción de manuales técnicos, diagramas de arquitectura y despliegue final.