// server/src/routes/pantryRoutes.js
const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');
const upload = require('../config/multer'); // Importamos la configuración de Multer (Req #6)


router.post('/scan', upload.single('image'), pantryController.scanPantryImage);

module.exports = router;