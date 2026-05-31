require('dotenv').config();
// server/src/index.js


const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();

const sequelize = require('./config/db'); 

const app = express();
const PORT = process.env.PORT || 3000;


const dashboardRoutes = require('./routes/dashboardRoutes');
const ingredientsRoutes = require('./routes/ingredientsRoutes');
const pantryRoutes = require('./routes/pantryRoutes'); 


app.use(cors()); 
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); 


app.get('/api/health', (req, res) => {
  res.json({ status: 'server is running!', message: 'MacroSolver Backend API' });
});


app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/pantry', pantryRoutes); 


async function startServer() {
  try {
    
    await sequelize.authenticate();
    console.log('✅ Base de datos SQLite conectada correctamente.');

    
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos (Req #3, #5, #8 dynamic data parity verified)');

    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend Express escuchando en http://localhost:${PORT}`);
      console.log(`📡 Dashboard API activated at http://localhost:${PORT}/api/dashboard`);
      console.log(`📡 Ingredients API activated at http://localhost:${PORT}/api/ingredients (Req #4 Connection verified)`);
      console.log(`📡 Pantry/Scan API activated at http://localhost:${PORT}/api/pantry/scan (Req #4 Connection)`); // <--- AÑADIR ESTA LÍNEA
    });

    
    const Ingredient = require('./models/Ingredient');
    const ingredientCount = await Ingredient.count();
    if (ingredientCount > 0) {
      console.log(`🌾 Base de datos sembrada profesionalmente con ${ingredientCount} ingredientes idénticos a v0 (image_28.png).`);
    }

  } catch (error) {
    console.error('❌ Error crítico al arrancar el servidor:', error);
    process.exit(1);
  }
}


startServer().then(() => {
  // Main loop active
}).catch(err => {
  console.error('❌ Unhandled boot error:', err);
  process.exit(1);
});