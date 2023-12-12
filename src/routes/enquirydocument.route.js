const express = require("express");
const router = express.Router();
const EnquiryDocumentcontroller = require("../controllers/enquirydocument.controller");
const upload = require("../middleware/fileUploadHandling.middleware");
const authAdmin = require('../middleware/adminAuth.middleware');
const { fileUploadSchema, fileUpdate } = require('../middleware/validators/enquirydocumentValidator');

router.post("/upload", authAdmin(), upload.single('file'), fileUploadSchema,EnquiryDocumentcontroller.uploadEnquiryDocument);
router.get("/getall/:enquiryid", authAdmin(), EnquiryDocumentcontroller.getAllEnquiryDocumentByEnquiryId);
router.put("/update/:id", authAdmin(), EnquiryDocumentcontroller.getEnquiryDocumentById, upload.single('file'), fileUpdate, EnquiryDocumentcontroller.updateEnquiryDocumentById);
router.post("/download/:filename", authAdmin(), EnquiryDocumentcontroller.downloadEnquiryDocumentByPath);
router.post("/viewfile/:filename", authAdmin(), EnquiryDocumentcontroller.viewEnquiryDocument);
router.delete("/delete/:id",authAdmin(),EnquiryDocumentcontroller.deletEnquiryDocument);
module.exports = router;