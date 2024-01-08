const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicleModel.controller');
const authAdmin = require('../middleware/adminAuth.middleware');
const { createVehicleModelSchema, updateVehicleModelSchema } = require('../middleware/validators/vehicleModelValidator.middleware');

router.get('/vehiclemodel', VehicleController.getAllVehicleModels);
router.get('/vehiclemodel/:manufacturerId', VehicleController.getAllVehicleModelsByManufacturerId);
router.post('/vehiclemodel', authAdmin(), createVehicleModelSchema, VehicleController.createVehicleModel);
router.put('/vehiclemodel/:id', authAdmin(), updateVehicleModelSchema, VehicleController.updateVehicleModel);
router.delete('/vehiclemodel/:id', authAdmin(), VehicleController.deleteVehicleModel);

module.exports = router;