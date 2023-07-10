const express = require('express');
const router = express.Router();
const ManufacturerController = require('../controllers/manufacturer.controller');
const authAdmin = require('../middleware/adminAuth.middleware');
const { createManufacturerSchema, updateManufacturerSchema } = require('../middleware/validators/manufacturerValidator.middleware');

router.get('/manufacturer', ManufacturerController.getAllManufacturers);
router.get('/manufacturer/:id', ManufacturerController.getManufacturerById);
router.post('/manufacturer', authAdmin(), createManufacturerSchema, ManufacturerController.createManufacturer);
router.put('/manufacturer/:id', authAdmin(), updateManufacturerSchema, ManufacturerController.updateManufacturer);
router.delete('/manufacturer/:id', authAdmin(), ManufacturerController.deleteManufacturer);

module.exports = router;
