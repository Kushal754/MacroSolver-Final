// 1. Importamos los tipos de Sequelize (Req #3/5 - ORM)
const { DataTypes } = require('sequelize');
// 2. Importamos nuestra conexión a la base de datos profesional
const sequelize = require('../config/db');

// 3. Definimos el Modelo de Usuario (Req #5 - Typed Structure)

const User = sequelize.define('User', {
  
  id: {
    type: DataTypes.UUID, // Req #11 (Modernidad)
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Req #6 (Limpieza: Campo obligatorio)
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Req #6 (Limpieza: Email único)
    validate: {
      isEmail: true, // Req #6 (Limpieza: Validación de formato)
    },
  },
  // 5. Estos campos coinciden con las tarjetas del Dashboard de v0:
  joinedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  macrosMetPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100, // Req #6 (Limpieza: Validación de rango)
    },
  },
}, {
  // 6. Opciones adicionales de Sequelize profesionales
  timestamps: true, // Req #11 (Modernidad: Añade createdAt y updatedAt)
  tableName: 'Users',
});

// 7. Exportamos el modelo para usarlo en la API
module.exports = User;