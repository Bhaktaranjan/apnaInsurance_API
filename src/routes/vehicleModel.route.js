const express = require('express');
const router = express.Router();
const VehicleModelController = require('../controllers/vehicleModel.controller');
const authAdmin = require('../middleware/adminAuth.middleware');

router.get('/vehicle-model', VehicleModelController.getAllVehicleModels);
// router.get('/vehicle-model/:id', VehicleModelController.getVehicleModelById);
router.post('/vehicle-model', authAdmin(), VehicleModelController.createVehicleModel);
router.put('/vehicle-model/:id', authAdmin(), VehicleModelController.updateVehicleModel);
router.delete('/vehicle-model/:id', authAdmin(), VehicleModelController.deleteVehicleModel);

module.exports = router;