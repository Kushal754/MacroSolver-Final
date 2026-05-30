// server/src/routes/pantryRoutes.js
const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');
const upload = require('../config/multer'); // Importamos la configuración de Multer (Req #6)

// Definimos la ruta: POST /api/pantry/scan
// 1. 'upload.single('image')': Middleware de Multer que gestiona la subida de UN archivo en el campo 'image'.
// 2. 'pantryController.scanPantryImage': Controlador que procesa la imagen subida.
router.post('/scan', upload.single('image'), pantryController.scanPantryImage);

module.exports = router;