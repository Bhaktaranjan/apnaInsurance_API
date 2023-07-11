const express = require('express');
const router = express.Router();
const ModelVariantController = require('../controllers/modelVariant.controller');
const authAdmin = require('../middleware/adminAuth.middleware');
const { createModelVariantSchema, updateModelVariantSchema } = require('../middleware/validators/modelVariantValidator.middleware');

router.get('/model-variant', ModelVariantController.getAllModelVariants);
router.get('/model-variant/:vehiclemodelid', ModelVariantController.getAllModelVariantsByVehicleModelId);
router.post('/model-variant', authAdmin(), createModelVariantSchema, ModelVariantController.createModelVariant);
router.put('/model-variant/:id', authAdmin(), updateModelVariantSchema, ModelVariantController.updateModelVariant);
router.delete('/model-variant/:id', authAdmin(), ModelVariantController.deleteModelVariant);

module.exports = router;