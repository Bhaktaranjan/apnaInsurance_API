const { body } = require("express-validator");
exports.fileUploadSchema = [
  body("EnquiryId")
    .exists()
    .withMessage("EnquiryId required")
    .notEmpty()
    .withMessage("EnquiryId cannot be empty"),
  body("DocumentName")
    .exists()
    .withMessage("DocumentName required")
    .notEmpty()
    .withMessage("DocumentName cannot be empty"),
  body("CreatedBy")
    .exists()
    .withMessage("CreatedBy required")
    .notEmpty()
    .withMessage("CreatedBy cannot be empty"),
];
exports.fileUpdate = [
  body("FileName").exists().withMessage("File Name required"),
];
