
const Ingredient = require('../models/Ingredient');


const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll();
    res.json(ingredients);
  } catch (error) {
    console.error('Error en getAllIngredients:', error);
    res.status(500).json({ error: 'Error al obtener ingredientes' });
  }
};


const createIngredient = async (req, res) => {
  try {
    const { name, category, calories, protein, carbs, fat, quantityInStock, unit } = req.body;

    const newIngredient = await Ingredient.create({
      name,
      category,
      calories,
      protein,
      carbs,
      fat,
      quantityInStock,
      unit
    });

    res.status(201).json(newIngredient);
  } catch (error) {
    console.error('Error en createIngredient:', error);
    res.status(500).json({ error: 'Error interno al guardar el ingrediente' });
  }
};


module.exports = {
  getAllIngredients,
  createIngredient
};