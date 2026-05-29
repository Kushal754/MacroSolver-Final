// 1. Importamos las librerías necesarias
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db'); // Database connection




const app = express();
const PORT = process.env.PORT || 3000;


// We import our layered routes here
const dashboardRoutes = require('./routes/dashboardRoutes');


app.use(cors()); 

app.use(express.json());

// --- GROUP 5: Basic Health Check (Optional but professional) ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'server is running!', message: 'MacroSolver Backend API' });
});



app.use('/api/dashboard', dashboardRoutes);


async function startServer() {
  try {
    // 1. Verify Database Connection (Req #8)
    await sequelize.authenticate();
    console.log('✅ Base de datos SQLite conectada correctamente.');

    // 2. Synchronize Models (Req #5, #8)
    // Dynamic database generation.
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos.');

    // 3. Start Listening (Req #2, #4)
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend Express escuchando en http://localhost:${PORT}`);
      console.log(`📡 Dashboard API activated at http://localhost:${PORT}/api/dashboard`);
    });

  } catch (error) {
    console.error('❌ Error crítico al arrancar el servidor:', error);
    process.exit(1);
  }
}

// Group 8: Proper async handling (CommonJS style)
startServer().then(() => {
  // Main loop active
}).catch(err => {
  console.error('❌ Unhandled boot error:', err);
  process.exit(1);
});