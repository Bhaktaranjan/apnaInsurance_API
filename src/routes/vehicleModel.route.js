const express = require('express');
const router = express.Router();
const VehicleModelController = require('../controllers/vehicleModel.controller');
const authAdmin = require('../middleware/adminAuth.middleware');
const { createVehicleModelSchema, updateVehicleModelSchema } = require('../middleware/validators/vehicleModelValidator.middleware');

router.get('/vehicle-model', VehicleModelController.getAllVehicleModels);
router.get('/vehicle-model/:manufacurterId', VehicleModelController.getAllVehicleModelsByManufacturerId);
router.post('/vehicle-model', authAdmin(), createVehicleModelSchema, VehicleModelController.createVehicleModel);
router.put('/vehicle-model/:id', authAdmin(), updateVehicleModelSchema, VehicleModelController.updateVehicleModel);
router.delete('/vehicle-model/:id', authAdmin(), VehicleModelController.deleteVehicleModel);

module.exports = router;