const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicle.controller');
const authAdmin = require('../middleware/adminAuth.middleware');
const { createVehicleSchema, updateVehicleSchema } = require('../middleware/validators/vehicleValidator.middleware');

router.get('/vehiclemodel', VehicleController.getAllVehicleModels);
router.get('/vehiclemodel/:manufacturerId', VehicleController.getAllVehicleModelsByManufacturerId);
router.post('/vehiclemodel', authAdmin(), createVehicleSchema, VehicleController.createVehicleModel);
router.put('/vehiclemodel/:id', authAdmin(), updateVehicleSchema, VehicleController.updateVehicleModel);
router.delete('/vehiclemodel/:id', authAdmin(), VehicleController.deleteVehicleModel);

module.exports = router;