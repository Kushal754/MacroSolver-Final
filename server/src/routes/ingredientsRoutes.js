const express = require('express');
const router = express.Router();

const ingredientsController = require('../controllers/ingredientsController');

// GET para listar
router.get('/', ingredientsController.getAllIngredients);

// POST para crear (delegamos la lógica al controlador)
router.post('/', ingredientsController.createIngredient);

module.exports = router;