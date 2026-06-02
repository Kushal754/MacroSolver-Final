# 📝 MacroSolver - Full-Stack AI Nutritional Assistant

**Logline:** Tu asistente nutricional inteligente para gestionar la despensa, planificar el *batch cooking* y calcular macros con el poder de la IA.

## 📖 Descripción

MacroSolver es una aplicación web Full-Stack diseñada para revolucionar la gestión de la alimentación personal. Utiliza inteligencia artificial para reconocer ingredientes, genera planes de comida basados en tu despensa virtual y lleva un seguimiento automatizado de tus macronutrientes.

Toda la planificación y organización del desarrollo de este proyecto se ha gestionado mediante metodologías ágiles a través de nuestro [Tablero de Trello](https://trello.com/invite/b/6a1da94759ba74206fade483/ATTI5ed66692ac5f6d8c03b87dde80ab1cc97F3CEE02/macrosolver-agile-development).

## 🚀 Despliegue

- **Frontend (Vercel):** [https://macro-solver-final.vercel.app/]
- **Backend (Render):** https://macrosolver-final-1.onrender.com

---

# ✨ Características

### 🥫 Gestión Inteligente de Despensa (Pantry)
Añade, elimina y escanea ingredientes en tiempo real usando IA para mantener tu inventario actualizado.

### 🍱 Planificación Batch Cooking
Generación de menús y recetas optimizadas aprovechando los ingredientes que ya tienes disponibles.

### 📊 Control Nutricional
Cálculo y seguimiento automático de macronutrientes para ayudarte a cumplir tus objetivos diarios.

---

# 🛠️ Tecnologías

## Frontend

- **React 18** → Construcción de interfaces de usuario interactivas.
- **Vite** → Empaquetador y entorno de desarrollo ultrarrápido.
- **React Router DOM** → Enrutamiento dinámico (SPA) y gestión de layouts.

## Backend

- **Node.js & Express** → Creación del servidor, API REST y gestión de rutas.
- **SQLite** → Base de datos relacional ligera y autocontenida.
- **Sequelize** → ORM para modelado de datos y consultas seguras.

## Herramientas Auxiliares

- **OpenAI API** → Motor de inteligencia artificial para el escaneo y sugerencias.
- **Trello** → Gestión ágil de tareas y seguimiento del proyecto.
- **Git & GitHub** → Control de versiones y colaboración.

---

# 📂 Estructura del Proyecto

```text
MacroSolver-Final/
├── client/                     # Frontend (React + Vite)
│   ├── index.html              # Estructura HTML base
│   ├── package.json            # Dependencias del frontend
│   ├── vite.config.ts          # Configuración de Vite
│   └── src/
│       ├── App.tsx             # Punto de entrada de la aplicación
│       ├── components/         # Componentes reutilizables
│       ├── context/            # Context API
│       └── api/                # Comunicación con el backend
│
├── server/                     # Backend (Node + Express)
│   ├── package.json            # Dependencias del backend
│   ├── database.sqlite         # Base de datos local
│   └── src/
│       ├── index.js            # Punto de entrada del servidor
│       ├── config/             # Configuración general
│       ├── routes/             # Definición de endpoints
│       ├── controllers/        # Lógica de negocio
│       └── services/           # Servicios externos (OpenAI)
│
├── docs/                       # Documentación del proyecto
│   ├── api-client.md
│   └── components.md
│
└── README.md                   # Este archivo
```

---

# ⚙️ Instalación y Ejecución

## 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/Kushal754/MacroSolver-Final.git
cd MacroSolver-Final
```

## 2️⃣ Configurar el Backend

```bash
cd server
npm install
```

Crear un archivo `.env`:

```env
OPENAI_API_KEY=clave_secreta_aqui
PORT=3000
```

Iniciar el servidor:

```bash
npm start
```

o

```bash
node src/index.js
```

## 3️⃣ Configurar el Frontend

```bash
cd client
npm install
```

Crear un archivo `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Iniciar la aplicación:

```bash
npm run dev
```

---

# ☁️ Despliegue

## Frontend (Vercel)

1. Importar el repositorio desde el panel de Vercel.
2. Configurar el **Root Directory** apuntando a la carpeta:

```text
client
```

3. Verificar que Vercel detecta correctamente **Vite**.
4. Añadir la variable de entorno:

```env
VITE_API_URL=https://tu-backend.onrender.com
```

5. Pulsar **Deploy**.

---

## Backend (Render)

1. Crear un nuevo **Web Service**.
2. Conectar el repositorio de GitHub.
3. Configurar el **Root Directory**:

```text
server
```

4. Configurar los comandos:

### Build Command

```bash
npm install && npm rebuild sqlite3 --build-from-source
```

### Start Command

```bash
node src/index.js
```

5. Añadir la variable:

```env
NODE_VERSION=20
```

6. Realizar el despliegue manual eliminando la caché si es necesario.

---

# 👥 Metodología de Trabajo

El desarrollo de MacroSolver ha seguido una metodología ágil basada en:

- Gestión de tareas mediante Trello.
- Organización por historias de usuario.
- Seguimiento continuo del progreso.
- Iteraciones incrementales durante el desarrollo.

Puedes consultar el tablero aquí:

🔗 **Trello:** [https://trello.com/b/x3LOPBib/macrosolver-agile-development]

---

# 📄 Licencia

Este proyecto ha sido desarrollado con fines académicos y educativos como proyecto final de desarrollo web.