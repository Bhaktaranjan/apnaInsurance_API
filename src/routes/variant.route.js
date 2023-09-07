const express = require('express');
const router = express.Router();
const VariantController = require('../controllers/variant.controller');
const authAdmin = require('../middleware/adminAuth.middleware');
const { createModelSchema, updateModelSchema } = require('../middleware/validators/modelValidator.middleware');

router.get('/variant', VariantController.getAllVariants);
router.get('/variant/:vehicleId', VariantController.getAllVariantsByVehicleModelId);
router.post('/variant', authAdmin(), createModelSchema, VariantController.createVariant);
router.put('/variant/:id', authAdmin(), updateModelSchema, VariantController.updateVariant);
router.delete('/variant/:id', authAdmin(), VariantController.deleteVariant);

module.exports = router;