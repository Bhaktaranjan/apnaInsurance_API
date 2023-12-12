const express = require('express');
const router = express.Router();
const EnquiryController = require('../controllers/enquiry.controller');
const authAdmin = require('../middleware/adminAuth.middleware');
const { createEnquirySchema, updateEnquireSchema } = require('../middleware/validators/enquiryValidator.middleware');

router.get('/enquiry', authAdmin(), EnquiryController.getAllEnquires);
router.post('/enquiry', createEnquirySchema, EnquiryController.createEnquiry);
router.put('/enquiry/:id', updateEnquireSchema, authAdmin(), EnquiryController.updateEnquiryStatus)
module.exports = router;

