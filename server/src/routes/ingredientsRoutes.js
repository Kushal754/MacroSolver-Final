// 1. Importamos Express Router profesionalmente (Req #5)
const express = require('express');
const router = express.Router();
// 2. Importamos el controlador correspondiente profesionales
const ingredientsController = require('../controllers/ingredientsController');

// 3. Definimos la ruta profesional (Req #4 Connection)
// URL FINAL: GET /api/ingredients
router.get('/', ingredientsController.getAllIngredients);

// 4. Exportamos el router profesional
module.exports = router;