const {body}=require("express-validator");
exports.createDocumentSchema=[
    body("DocumentName")
    .exists()
    .notEmpty()
    .withMessage("DocumentName Can not be empty."),
    body("StatusId")
    .exists()
    .notEmpty()
    .withMessage("StatusId can not be empty."),
   
]