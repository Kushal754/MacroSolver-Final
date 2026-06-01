# Arquitectura Backend y Capa de Red (API Client)

La comunicación entre el Frontend y el Backend está fuertemente tipada y centralizada, siguiendo una arquitectura por capas para aislar responsabilidades.

## Arquitectura del Servidor (Backend Express)
El backend en Node.js/Express actúa como proveedor de la base de datos y puente hacia la API de OpenAI. Se estructura en capas:
1.  **Rutas (`routes/`):** Define los endpoints RESTful (`/api/ingredients`, `/api/macros/generate`) y asocia las peticiones HTTP a sus controladores correspondientes.
2.  **Controladores (`controllers/`):** Contienen la lógica de negocio. Extraen el `req.body`, validan los datos, interactúan con la base de datos (SQLite) y construyen las respuestas mediante códigos de estado HTTP correctos (200 OK, 201 Created para POST, 400 Bad Request, 500 Internal Server Error).

## Capa de Red en el Frontend (`apiClient.ts`)
En lugar de diseminar llamadas `fetch` por todos los componentes, se ha implementado un servicio cliente `apiClient` encapsulado en la carpeta `api/`.
* **Tipado Genérico:** Las funciones del cliente (`get<T>`, `post<T>`, etc.) utilizan genéricos de TypeScript. Esto obliga a los componentes a declarar qué estructura de datos esperan recibir (ej. `apiClient.get<Ingredient[]>`), habilitando el autocompletado y previniendo errores de propiedades indefinidas.
* **Detección Automática de Entorno:** El cliente utiliza variables de entorno de Vite (`import.meta.env.VITE_API_URL`) para alternar automáticamente entre el endpoint local (`localhost:3000`) y la URL de producción sin modificar código manual.
* **Manejo Centralizado de Errores:** El cliente evalúa la propiedad `response.ok`. Si el servidor devuelve un código de error HTTP (ej. 404 o 500), el cliente arroja una excepción automáticamente, permitiendo que el componente la capture en su bloque `catch` para alertar al usuario de manera controlada.