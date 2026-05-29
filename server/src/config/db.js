// 1. Importamos Sequelize (nuestro ORM)
const { Sequelize } = require('sequelize');
// 2. Importamos dotenv para leer la URL de la base de datos
require('dotenv').config();

// 3. Creamos la instancia de conexión
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'sqlite',
  // Especificamos la ubicación del archivo SQLite
  storage: './database.sqlite', 
  logging: false, // Desactivamos los logs de SQL
});

// 4. Exportamos la instancia para usarla en el resto de la aplicación
module.exports = sequelize;