const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicle.controller');
const authAdmin = require('../middleware/adminAuth.middleware');
const { createVehicleSchema, updateVehicleSchema } = require('../middleware/validators/vehicleValidator.middleware');

router.get('/vehicle', VehicleController.getAllVehicles);
router.get('/vehicle/:manufacturerId', VehicleController.getAllVehiclesByManufacturerId);
router.post('/vehicle', authAdmin(), createVehicleSchema, VehicleController.createVehicle);
router.put('/vehicle/:id', authAdmin(), updateVehicleSchema, VehicleController.updateVehicle);
router.delete('/vehicle/:id', authAdmin(), VehicleController.deleteVehicle);

module.exports = router;