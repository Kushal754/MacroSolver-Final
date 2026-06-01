# Formularios e Interacción del Usuario

La captura de datos del usuario, particularmente en la sección de Despensa (`Pantry.tsx`), se ha diseñado siguiendo el patrón de **Componentes Controlados** (Controlled Components) de React.

## Gestión del Estado de los Inputs
El formulario para añadir o editar ingredientes no lee sus valores directamente del DOM. En su lugar, el estado se centraliza en React mediante un objeto `newIngredient`.
* **Manejador Universal (`handleInputChange`):** A través del atributo `name` de los campos HTML (`input`, `select`), una única función se encarga de actualizar dinámicamente la propiedad correspondiente en el objeto de estado, manteniendo el código limpio y escalable.

## Validación y Prevención
* **Validación HTML5:** Se utilizan atributos nativos como `required` y `min="0"` para asegurar que los campos numéricos de macronutrientes (proteínas, carbohidratos, grasas) no admitan valores negativos antes de que se lance el evento JavaScript.
* **Prevención de Comportamiento por Defecto:** Al enviar el formulario (`onSubmit`), se ejecuta `e.preventDefault()` para evitar la recarga de la página, característica inherente de los navegadores clásicos, garantizando el flujo SPA.
* **Control de Doble Envío:** Se utiliza un estado de bloqueo (`isSubmitting`). Cuando el usuario hace clic en guardar, este estado desactiva el botón y muestra un icono de carga. Esto previene peticiones POST/PUT duplicadas si la red es lenta.