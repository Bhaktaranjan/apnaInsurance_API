const express = require('express');
const router = express.Router();
const MakeController = require('../controllers/model.controller');
const authAdmin = require('../middleware/adminAuth.middleware');
const { createModelSchema, updateModelSchema } = require('../middleware/validators/modelValidator.middleware');

router.get('/variant', MakeController.getAllVariants);
router.get('/variant/:vehicleId', MakeController.getAllVariantsByVehicleModelId);
router.post('/variant', authAdmin(), createModelSchema, MakeController.createVariant);
router.put('/variant/:id', authAdmin(), updateModelSchema, MakeController.updateVariant);
router.delete('/variant/:id', authAdmin(), MakeController.deleteVariant);

module.exports = router;