const express = require('express');
const router = express.Router();
const ModelVariantController = require('../controllers/modelVariant.controller');
const authAdmin = require('../middleware/adminAuth.middleware');

router.get('/model-variant', ModelVariantController.getAllModelVariants);
// router.get('/model-variant/:id', ModelVariantController.getModelVariantById);
router.post('/model-variant', authAdmin(), ModelVariantController.createModelVariant);
router.put('/model-variant/:id', authAdmin(), ModelVariantController.updateModelVariant);
router.delete('/model-variant/:id', authAdmin(), ModelVariantController.deleteModelVariant);

module.exports = router;