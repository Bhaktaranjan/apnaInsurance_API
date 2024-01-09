const express=require("express");
const router=express.Router();
const DocumentContriller=require("../controllers/document.controller");
const authAdmin=require("../middleware/adminAuth.middleware");
const {createDocumentSchema}=require("../middleware/validators/documentValidator");


router.post("/create",authAdmin(),createDocumentSchema,DocumentContriller.createDocument);
router.get("/getall",authAdmin(),DocumentContriller.getAllDocument);
router.get("/getdocumentbystatusid/:statusid",authAdmin(),DocumentContriller.getAllDocumnetByStatusId)
module.exports=router