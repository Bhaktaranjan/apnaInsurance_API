const express = require('express');
const router = express.Router();
const FuelTypeController = require('../controllers/fuelType.controller');
const authAdmin = require('../middleware/adminAuth.middleware');
const { createFuelTypeSchema, updateFuelTypeSchema } = require('../middleware/validators/fuelTypeValidator.middleware');

router.get('/fuel-type', FuelTypeController.getAllFuelTypes);
router.post('/fuel-type', authAdmin(), createFuelTypeSchema, FuelTypeController.createFuelType);
router.put('/fuel-type/:id', authAdmin(), updateFuelTypeSchema, FuelTypeController.updateFuelType);
router.delete('/fuel-type/:id', authAdmin(), FuelTypeController.deleteFuelType);

module.exports = router;