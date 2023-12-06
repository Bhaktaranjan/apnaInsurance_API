const express = require("express");
const router = express.Router();
const Documentcontroller = require("../controllers/document.controller");
const upload = require("../middleware/fileUploadHandling.middleware");
const authAdmin = require('../middleware/adminAuth.middleware');
const { fileUploadSchema, fileUpdate } = require('../middleware/validators/documentValidator');

router.post("/upload", authAdmin(), upload.single('file'), fileUploadSchema, Documentcontroller.createDocument);
router.get("/getall/:enquiryid", authAdmin(), Documentcontroller.getAllDocumentByEnquiryId);
router.put("/update/:id", authAdmin(), Documentcontroller.getDocumentById, upload.single('file'), fileUpdate, Documentcontroller.updateDocumentById);
router.post("/download/:filename", authAdmin(), Documentcontroller.downloadDocumentByPath);
router.post("/viewfile/:filename", authAdmin(), Documentcontroller.viewDocument);
router.delete("/delete/:id",authAdmin(),Documentcontroller.deletDocument);
module.exports = router;