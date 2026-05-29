// 1. Importamos la conexión profesional a la DB
const sequelize = require('./config/db');
// 2. Importamos el modelo de Usuario que ya funciona
const User = require('./models/User');

// 3. Función principal de siembra asíncrona
const seedDatabase = async () => {
  try {
    console.log('🌱 Empezando la siembra de datos (seeding)...');

    // 4. Sincronizamos (alter: true para no borrar todo si ya existe, pero asegurar estructura)
    await sequelize.sync({ alter: true });

    // 5. Borramos usuarios existentes para empezar de cero (limpieza profesional - Req #6)
    // PRECAUCIÓN: Esto borra TODO lo que haya en la tabla Users.
    await User.destroy({ where: {} });
    console.log('🔄 Tabla Users limpiada.');

    // 6. Definimos los datos idénticos a v0 (Dashboard/Recent Users)
    // Calculamos fechas para Req #11 (Modernidad) basadas en días pasados
    const v0UsersData = [
      { 
        name: 'Alba García', 
        email: 'alba.garcia@macrosolver.com', 
        joinedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Hace 2 días
        macrosMetPercentage: 85 
      },
      { 
        name: 'Javier Pérez', 
        email: 'javier.perez@macrosolver.com', 
        joinedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // Hace 4 días
        macrosMetPercentage: 92 
      },
      { 
        name: 'Marta Sanz', 
        email: 'marta.sanz@macrosolver.com', 
        joinedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Hace 1 semana
        macrosMetPercentage: 78 
      },
      { 
        name: 'David López', 
        email: 'david.lopez@macrosolver.com', 
        joinedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Hace 10 días
        macrosMetPercentage: 88 
      },
      { 
        name: 'Laura Ruíz', 
        email: 'laura.ruiz@macrosolver.com', 
        joinedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // Hace 2 semanas
        macrosMetPercentage: 95 
      },
    ];

    // 7. Inserción masiva profesional de Sequelize (Req #3/5 - ORM)
    await User.bulkCreate(v0UsersData);

    console.log('✅ Base de datos sembrada con éxito. Datos idénticos a v0 insertados.');
    // 8. Cerramos el proceso limpiamente (CommonJS style)
    process.exit(0); 

  } catch (error) {
    console.error('❌ Error sembrando la base de datos:', error);
    // 9. Cerramos con error
    process.exit(1); 
  }
};

// 10. Ejecutamos la función
seedDatabase();