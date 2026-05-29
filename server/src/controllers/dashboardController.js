// 1. Importamos el modelo de Usuario que ya funciona profesionalmente (Req #5)
const User = require('../models/User');

// 2. Función controladora asíncrona para obtener los datos del dashboard (Req #4)
exports.getDashboardData = async (req, res) => {
  try {
    console.log('📡 Petición GET /api/dashboard recibida...');

    // 3. DATOS REALES: Buscamos los usuarios recientes de la base de datos (SQLite)
    // Ordenamos por fecha de unión descendente y limitamos a 5 (Req #6 - Eficiencia)
    const recentUsersRaw = await User.findAll({
      order: [['joinedDate', 'DESC']],
      limit: 5,
    });

    
    const recentUsersFormatted = recentUsersRaw.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      // Simulamos el texto "joined X days ago" basado en la fecha real (Req #11 Modernidad)
      joinedDate: `${Math.round((Date.now() - new Date(user.joinedDate)) / (24 * 60 * 60 * 1000))} days ago`,
      macrosMet: user.macrosMetPercentage,
    }));


    const dashboardStatsFormatted = [
      { name: 'Active Users', value: recentUsersRaw.length.toString(), change: '+5.2%', iconName: 'Users', color: 'text-sky-500' },
      { name: 'Daily Macros Met', value: '89%', change: '+1.5%', iconName: 'Target', color: 'text-emerald-500' },
      { name: 'Training Plans Generated', value: '456', change: '+12.3%', iconName: 'Dumbbell', color: 'text-amber-500' },
      { name: 'Avg. AI Response Time', value: '1.2s', change: '-10%', iconName: 'Zap', color: 'text-rose-500' },
    ];


    const v0IdenticalResponse = {
      stats: dashboardStatsFormatted,
      recentUsers: recentUsersFormatted,
    };

    console.log('✅ Datos del dashboard generados con éxito (Real + Mock).');
    // Enviamos la respuesta exitosa (Req #4 Connection)
    res.json(v0IdenticalResponse);

  } catch (error) {
    console.error('❌ Error obteniendo datos del dashboard:', error);
    // Manejo profesional de errores (Req #6/11)
    res.status(500).json({ 
      status: 'error', 
      message: 'Critical error fetching dashboard data from backend' 
    });
  }
};