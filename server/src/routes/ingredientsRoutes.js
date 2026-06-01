const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientsController');

// Rutas GET (Leer) y POST (Crear)
router.get('/', ingredientController.getAllIngredients);
router.post('/', ingredientController.createIngredient);

// NUEVAS RUTAS: PUT (Actualizar) y DELETE (Borrar)
router.put('/:id', ingredientController.updateIngredient);
router.delete('/:id', ingredientController.deleteIngredient);

module.exports = router;