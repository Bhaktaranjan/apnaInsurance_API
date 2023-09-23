const express = require('express');
const router = express.Router();
const VariantController = require('../controllers/variant.controller');
const authAdmin = require('../middleware/adminAuth.middleware');
const { createVariantSchema, updateVariantSchema } = require('../middleware/validators/variantValidator.middleware');

router.get('/variant', VariantController.getAllVariants);
router.get('/variant/:vehicleId', VariantController.getAllVariantsByVehicleModelId);
router.post('/variant', authAdmin(), createVariantSchema, VariantController.createVariant);
router.put('/variant/:id', authAdmin(), updateVariantSchema, VariantController.updateVariant);
router.delete('/variant/:id', authAdmin(), VariantController.deleteVariant);

module.exports = router;