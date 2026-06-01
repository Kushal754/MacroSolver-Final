const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

// Ruta POST para generar la rutina
router.post('/generate', trainerController.generateRoutine);

module.exports = router;