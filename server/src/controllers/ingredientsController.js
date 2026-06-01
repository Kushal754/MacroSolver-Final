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

const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByPk(id);

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }

    await ingredient.update(req.body);
    res.json(ingredient);
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ error: 'Fallo al actualizar el ingrediente' });
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByPk(id);

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }

    await ingredient.destroy();
    res.json({ message: 'Ingrediente eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({ error: 'Fallo al eliminar el ingrediente' });
  }
};

// Exportamos TODAS las funciones juntas
module.exports = {
  getAllIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient
};