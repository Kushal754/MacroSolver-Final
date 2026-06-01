const express = require('express');
const router = express.Router();
const macroController = require('../controllers/macroController');

// Ruta para generar la receta con IA
router.post('/generate', macroController.generateRecipe);

module.exports = router;