const express = require('express');
const router = express.Router();
const MakeController = require('../controllers/model.controller');
const authAdmin = require('../middleware/adminAuth.middleware');
const { createModelSchema, updateModelSchema } = require('../middleware/validators/modelValidator.middleware');

router.get('/model', MakeController.getAllModels);
router.get('/model/:vehicleId', MakeController.getAllModelsByVehicleModelId);
router.post('/model', authAdmin(), createModelSchema, MakeController.createModel);
router.put('/model/:id', authAdmin(), updateModelSchema, MakeController.updateModel);
router.delete('/model/:id', authAdmin(), MakeController.deleteModel);

module.exports = router;