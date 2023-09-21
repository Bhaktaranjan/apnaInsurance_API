const express = require('express');
const router = express.Router();
const StatusController = require('../controllers/status.controller');
const authAdmin = require('../middleware/adminAuth.middleware');
const { createStatusSchema, updateStatusSchema } = require('../middleware/validators/statusValidator.middleware');

router.get('/status', StatusController.getAllStatus);
router.get('/status/:id', StatusController.getAllstatusByParentTypeId);
router.post('/status', authAdmin(), createStatusSchema, StatusController.createStatus);
router.put('/status/:id', authAdmin(), updateStatusSchema, StatusController.updateStatus);
router.delete('/status/:id',authAdmin(), StatusController.deleteStatus);

module.exports = router;