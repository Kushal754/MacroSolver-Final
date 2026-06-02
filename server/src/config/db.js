const path = require('path');
const { Sequelize } = require('sequelize');


const dbPath = path.join(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath, 
  logging: false, 
});


sequelize.authenticate()
  .then(() => console.log(`✅ Base de datos conectada con éxito en: ${dbPath}`))
  .catch((err) => console.error('❌ Error fatal conectando a SQLite:', err));

module.exports = sequelize;