// 1. Importamos Express Router profesionalmente (Req #5)
const express = require('express');
const router = express.Router();
// 2. Importamos el controlador correspondiente
const dashboardController = require('../controllers/dashboardController');

// 3. Definimos la ruta profesional (Req #4 Connection)
// URL FINAL: GET /api/dashboard
router.get('/', dashboardController.getDashboardData);

// 4. Exportamos el router
module.exports = router;