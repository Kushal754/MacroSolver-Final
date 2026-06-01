# Estrategia de Despliegue (Deployment)

Para hacer que **MacroSolver** sea accesible en producción, se ha diseñado una estrategia de despliegue utilizando **Vercel**, plataforma líder para aplicaciones frontend modernas y funciones Serverless.

## 1. Configuración del Entorno de Producción
Antes del despliegue, se aislaron las configuraciones dependientes del entorno:
* Se utilizó la variable `import.meta.env.VITE_API_URL` en el cliente de la API del frontend.
* En el entorno local, esta variable apunta a `http://localhost:3000/api`. En producción, Vercel inyecta automáticamente la URL del backend desplegado, evitando *hardcodear* direcciones IP.

## 2. Proceso de Despliegue del Frontend (Vite + React)
El despliegue del frontend en Vercel es continuo y automatizado:
1. Se vincula el repositorio de GitHub con la plataforma Vercel.
2. Vercel detecta automáticamente el framework (Vite) y configura los comandos de compilación (`npm run build`) y el directorio de salida (`dist`).
3. Se configuran las reglas de reescritura de rutas (*Rewrites*) en Vercel para que todas las rutas caigan sobre `index.html`. Esto es vital en las SPA (Single Page Applications) para evitar el error 404 al recargar directamente en rutas como `/pantry`.

## 3. Despliegue del Backend (Express)
Dado que el backend de Node.js/Express reside en el mismo repositorio (Monorepo), se puede desplegar como Funciones Serverless en Vercel utilizando un archivo `vercel.json` en la raíz, que instruye a Vercel para que enrute las peticiones `/api/*` hacia `server/src/index.js`.
*(Alternativamente, plataformas como Render o Railway son ideales para levantar el servidor de Express de forma continua junto con su base de datos SQLite).*

## 4. Verificación Post-Despliegue
Tras el *build* exitoso, se comprueba:
* Que la carga inicial (First Contentful Paint) sea óptima gracias al *Lazy Loading*.
* Que las peticiones CORS entre el dominio del frontend y el del backend funcionen correctamente.