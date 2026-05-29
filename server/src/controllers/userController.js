// 1. Importamos el modelo de Usuario (Req #5 - Tipeado)
const User = require('../models/User');

// 2. Controlador para obtener todos los usuarios (Req #10 Modernidad/Parity)
const getUsers = async (req, res) => {
  try {
    // 3. Simulamos datos reales idénticos a v0 pero "a mi manera" estructurada
    const mockUsers = [
      { id: '1', name: 'Alba García', email: 'alba.garcia@macrosolver.com', joinedDate: '2 days ago', macrosMetPercentage: 85 },
      { id: '2', name: 'Javier Pérez', email: 'javier.perez@macrosolver.com', joinedDate: '4 days ago', macrosMetPercentage: 92 },
      { id: '3', name: 'Marta Sanz', email: 'marta.sanz@macrosolver.com', joinedDate: '1 week ago', macrosMetPercentage: 78 },
      { id: '4', name: 'David López', email: 'david.lopez@macrosolver.com', joinedDate: '10 days ago', macrosMetPercentage: 88 },
      { id: '5', name: 'Laura Ruíz', email: 'laura.ruiz@macrosolver.com', joinedDate: '2 weeks ago', macrosMetPercentage: 95 },
    ];
    
    // 4. Respondemos con JSON estructurado idéntico a la visión de v0
    res.status(200).json(mockUsers);
    
  } catch (error) {
    // 5. Gestión de errores profesional para Req #11 Modernidad
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ status: 'error', message: 'No se pudieron recuperar los usuarios.' });
  }
};

// 6. Exportamos las funciones del controlador profesional CommonJS
module.exports = {
  getUsers,
};