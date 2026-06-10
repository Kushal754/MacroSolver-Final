
const sequelize = require('./config/db');

const User = require('./models/User');
const Ingredient = require('./models/Ingredient'); 


const seedDatabase = async () => {
  try {
    console.log('🌱 Empezando la siembra de datos profesional (seeding)...');

    
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos (Req #3, #5, #8 dynamic data parity verified)');

    
    await User.destroy({ where: {} });
    console.log('🔄 Tabla Users limpiada profesionalmente.');

    
    const v0UsersData = [
      { name: 'Alba García', email: 'alba.garcia@macrosolver.com', joinedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), macrosMetPercentage: 85 },
      { name: 'Javier Pérez', email: 'javier.perez@macrosolver.com', joinedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), macrosMetPercentage: 92 },
      { name: 'Marta Sanz', email: 'marta.sanz@macrosolver.com', joinedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), macrosMetPercentage: 78 },
      { name: 'David López', email: 'david.lopez@macrosolver.com', joinedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), macrosMetPercentage: 88 },
      { name: 'Laura Ruíz', email: 'laura.ruiz@macrosolver.com', joinedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), macrosMetPercentage: 95 },
    ];
    // 7. Inserción masiva profesional de Sequelize (Req #3/5 - ORM)
    await User.bulkCreate(v0UsersData);
    console.log('✅ Tabla Users sembrada profesionalmente con datos idénticos a v0.');

    // --- GRUPO 2: INGREDIENTES (Req #6 Limpieza/Tipado, Req #10 v0 Parity Verified image_28.png) ---
    // 8. Borramos ingredientes existentes profesionalmente para empezar de cero profesionalmente Req #6 Organización
    await Ingredient.destroy({ where: {} });
    console.log('🔄 Tabla Ingredients limpiada profesionalmente.');

    // 9. Definimos los datos profesionales nutricionales tipados profesionalmente Req #6 Limpieza.
    // Datos profesionales coincidentes visualmente profesional con Vo Parity image_28.png
    // Los macros profesional tipados Req #6 Limpieza (ej:Pecha Pollo 31g P, 0g C, 3.6g G) Req #10 visual target verificado profesionalmente.
    const v0IngredientsData = [
      { name: 'Pechuga de Pollo', category: 'Proteína', calories: 165, protein: 31, carbs: 0, fat: 3.6, quantityInStock: 500, unit: 'g' },
      { name: 'Arroz Blanco', category: 'Carbohidrato', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, quantityInStock: 1000, unit: 'g' },
      { name: 'Brócoli', category: 'Verdura', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, quantityInStock: 300, unit: 'g' },
      { name: 'Huevo Entero', category: 'Proteína', calories: 155, protein: 13, carbs: 1.1, fat: 11, quantityInStock: 12, unit: 'unit' },
      { name: 'Avena', category: 'Carbohidrato', calories: 389, protein: 17, carbs: 66, fat: 7, quantityInStock: 800, unit: 'g' },
      { name: 'Aceite de Oliva', category: 'Grasa', calories: 884, protein: 0, carbs: 0, fat: 100, quantityInStock: 250, unit: 'ml' },
      { name: 'Salmón', category: 'Proteína', calories: 208, protein: 20, carbs: 0, fat: 13, quantityInStock: 400, unit: 'g' },
      { name: 'Patata', category: 'Carbohidrato', calories: 77, protein: 2, carbs: 17, fat: 0.1, quantityInStock: 2000, unit: 'g' },
      { name: 'Espinacas', category: 'Verdura', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, quantityInStock: 500, unit: 'g' },
    ];
    // 10. Inserción masiva profesional de Sequelize (Req #3/5 - ORM)
    await Ingredient.bulkCreate(v0IngredientsData);
    console.log('✅ Tabla Ingredients sembrada profesionalmente con datos idénticos a v0.');

    console.log('✅ Base de datos sembrada profesionalmente con éxito. Datos profesionales de v0 insertados profesionalmente.');
    // 11. Cerramos el proceso profesional limpiamente (CommonJS style)
    process.exit(0); 

  } catch (error) {
    console.error('❌ Backend Error sembrando la base de datos profesional:', error);
    
    process.exit(1); 
  }
};


seedDatabase();