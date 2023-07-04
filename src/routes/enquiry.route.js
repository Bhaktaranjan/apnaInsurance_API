const express = require('express');
const router = express.Router();
const EnquiryController = require('../controllers/enquiry.controller');
const authAdmin = require('../middleware/adminAuth.middleware');

// const {
//     createUserSchema, validateLogin,
// } = require('../middleware/validators/userValidator.middleware');
router.get('/enquiry', authAdmin(), EnquiryController.getAllEnquires);
router.post('/enquiry', EnquiryController.createEnquiry);

module.exports = router;
