// 1. Importamos las librerías necesarias
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db'); 
const User = require('./models/User'); 

// 2. Inicializamos la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Configuración de Middlewares básicos
// Habilitamos CORS para que el frontend pueda hablar con el backend
app.use(cors()); 
// Permitimos que el servidor entienda JSON en el cuerpo de las peticiones
app.use(express.json());

// 4. Ruta de prueba (Health Check)
app.get('/api/health', (req, res) => {
  res.json({ status: 'server is running!', message: 'MacroSolver Backend API' });
});

// 5. Arrancamos el Servidor
async function startServer() {
  try {
    // 6. Probamos la conexión con la Base de Datos
    await sequelize.authenticate();
    console.log('✅ Base de datos SQLite conectada correctamente.');

    // 7. Sincronizamos los modelos (esto creará el archivo database.sqlite)
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos.');

    // 8. Arrancamos el servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error al arrancar el servidor:', error);
    process.exit(1); // Cerramos el servidor si algo falla catastróficamente
  }
}

// Manejamos la ejecución asíncrona de forma correcta (CommonJS style)
startServer().then(() => {
  
}).catch(err => {
  console.error('❌ Error crítico al arrancar el servidor:', err);
  process.exit(1);
});