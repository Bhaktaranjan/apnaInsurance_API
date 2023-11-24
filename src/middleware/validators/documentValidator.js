const {body}=require("express-validator")
exports.FileUploadSchema=[
    body('DocumentName')
    .exists()
    .withMessage("DocumentName required"),
    body('FileName')
    .exists()
    .withMessage('FileName required'),
    body('EnquiryId')
    .exists()
    .withMessage('EnquiryId required')
    
];
exports.FileUpdate=[
    body('FileName')
    .exists()
    .withMessage("File Name required")
]