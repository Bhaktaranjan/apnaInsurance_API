const express=require("express");
const router=express.Router();
const  Documentcontroller=require("../controllers/document.controller");
const upload=require("../middleware/validators/filevalidator.middleware");
const authAdmin = require('../middleware/adminAuth.middleware');
const {FileUploadSchema}=require('../middleware/validators/documentValidator')
 

router.post("/upload",authAdmin(), upload.single('file'),FileUploadSchema,Documentcontroller.CreateDocument);
router.get("/upload/:enquiryid",authAdmin(),Documentcontroller.getAllDocumentByEnquiryId);
router.put("/upload/:id",authAdmin(),Documentcontroller.getDocumentById,upload.single('file'),Documentcontroller.updateDocumentById);
router.get("/download",authAdmin(),Documentcontroller.downloadDocumentByPath)
module.exports=router;