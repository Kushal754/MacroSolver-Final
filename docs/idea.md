# Definición del Proyecto: MacroSolver

## 1. Idea del Proyecto
**MacroSolver** es una aplicación web Full-Stack diseñada para revolucionar la forma en que los usuarios gestionan su nutrición, combinando el seguimiento de macronutrientes con el poder de la Inteligencia Artificial. A diferencia de las calculadoras de calorías tradicionales que te dicen qué te falta por comer, MacroSolver analiza lo que *ya tienes* en tu despensa y, mediante algoritmos de programación lineal e IA generativa (GPT-4o), crea recetas óptimas que encajan perfectamente en tus objetivos nutricionales diarios.

## 2. El Problema que Resuelve
Llevar un control estricto de los macronutrientes (proteínas, carbohidratos, grasas) es un proceso manual, tedioso y muchas veces frustrante. Los problemas más comunes en el mercado actual son:
*   **El "Tetris" nutricional:** Al final del día, a los usuarios les suelen faltar macros específicos (ej. "me faltan 40g de proteína y solo tengo 10g de grasa límite") y no saben qué cocinar con lo que tienen a mano para cuadrar los números sin pasarse.
*   **Desperdicio de alimentos:** Falta de optimización al usar los ingredientes disponibles en la nevera.
*   **Monotonía dietética:** Comer siempre lo mismo por falta de ideas que cumplan con requisitos matemáticos estrictos.

## 3. Usuario Objetivo
La aplicación está diseñada para satisfacer a diferentes perfiles:
*   **Atletas y entusiastas del Fitness:** Personas que necesitan un control milimétrico de su ingesta para ciclos de hipertrofia o definición.
*   **Usuarios de Batch Cooking:** Personas que buscan planificar sus comidas semanales de forma eficiente, controlando tanto las calorías totales como el coste económico de la semana.
*   **Estudiantes y principiantes en la cocina:** Jóvenes independizados que se están iniciando en la cocina y necesitan que una IA les genere instrucciones paso a paso detalladas, utilizando únicamente los ingredientes básicos que tienen a su disposición.

## 4. Funcionalidades Principales (MVP)
*   **Dashboard Interactivo:** Panel de control con el resumen nutricional y accesos rápidos.
*   **Gestor de Despensa (CRUD):** Control de inventario de ingredientes con macros, cantidades, stock y unidades de medida (gestionado a través de una API RESTful y base de datos).
*   **Motor MacroSolver:** Algoritmo de filtrado + Chef IA que genera recetas estructuradas y precisas utilizando exclusivamente los ingredientes seleccionados por el usuario de su inventario.
*   **Módulo de Batch Cooking:** Planificador semanal de comidas con cálculo dinámico de macros acumulados y estimación de costes semanales.
*   **Diseño Full-Responsive & Dark Mode:** Experiencia de usuario adaptable a dispositivos móviles mediante Tailwind CSS y gestión de temas con Context API.

## 5. Funcionalidades Opcionales (Implementadas como Bonus)
*   **Fridge Vision (Escáner IA):** Capacidad de subir una fotografía de la nevera para que la IA detecte y extraiga automáticamente los ingredientes y sus macros para añadirlos al inventario.
*   **Entrenador IA:** Interfaz de chat integrada especializada en rutinas de entrenamiento y recomendaciones físicas.
*   **Capa de red optimizada:** Cliente API centralizado (`apiClient`) con interceptores y tipado estricto (TypeScript), respaldado por *Custom Hooks* (`useDebounce`) y memorización (`useMemo`, `useCallback`) para un rendimiento fluido.

## 6. Mejoras Futuras
*   **Integración con APIs de supermercados locales:** Para actualizar precios en tiempo real y comprar los ingredientes faltantes directamente desde la aplicación.
*   **Autenticación de usuarios:** Sistema de login seguro (JWT) para permitir múltiples perfiles y guardar el historial de recetas de la comunidad.
*   **Exportación de Listas:** Generación automática de un documento PDF con la lista de la compra basada en el plan semanal de Batch Cooking.
*   **Progressive Web App (PWA):** Convertir la aplicación en instalable nativamente para dispositivos móviles, mejorando la velocidad de carga.