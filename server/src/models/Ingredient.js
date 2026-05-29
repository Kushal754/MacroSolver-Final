
const { DataTypes } = require('sequelize');

const sequelize = require('../config/db');


// Esto creará la tabla 'Ingredients' en SQLite para Req #8 dynamic parity verified.
const Ingredient = sequelize.define('Ingredient', {
  // id profesional UUID (Req #11 moderno)
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Obligatorio para Req #6 Limpieza
  },
  category: {
    type: DataTypes.ENUM('Proteína', 'Carbohidrato', 'Verdura', 'Grasa', 'Lácteo', 'Fruta', 'Otro'),
    allowNull: false,
    defaultValue: 'Otro',
  },

  calories: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },
  protein: {
    type: DataTypes.FLOAT, // Usamos FLOAT para mayor precisión profesional (Req #6)
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },
  carbs: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },
  fat: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },

  quantityInStock: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  unit: {
    type: DataTypes.ENUM('g', 'ml', 'unit'),
    allowNull: false,
    defaultValue: 'g',
  },
}, {

  timestamps: true,
  tableName: 'Ingredients',
});


module.exports = Ingredient;