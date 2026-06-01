const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');

router.post('/generate', batchController.generateBatchPlan);

module.exports = router;