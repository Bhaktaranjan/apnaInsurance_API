const express = require("express");
const router = express.Router();
const Documentcontroller = require("../controllers/document.controller");
const upload = require("../middleware/fileUploadHandling.middleware");
const authAdmin = require('../middleware/adminAuth.middleware');
const { fileUploadSchema, fileUpdate } = require('../middleware/validators/documentValidator');

router.post("/upload", authAdmin(), upload.single('file'), fileUploadSchema, Documentcontroller.CreateDocument);
router.get("/getall/:enquiryid", authAdmin(), Documentcontroller.getAllDocumentByEnquiryId);
router.put("/update/:id", authAdmin(), Documentcontroller.getDocumentById, upload.single('file'), fileUpdate, Documentcontroller.updateDocumentById);
router.get("/download/:filename", authAdmin(), Documentcontroller.downloadDocumentByPath);
router.get("/viewfile/:filename", authAdmin(), Documentcontroller.viewDocument);
module.exports = router;