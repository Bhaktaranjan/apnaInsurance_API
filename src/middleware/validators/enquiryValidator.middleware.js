const { body } = require('express-validator');

exports.createEnquirySchema = [
    body("FirstName")
        .exists()
        .withMessage("FirstName is required")
        .isLength({
            min: 3,
        })
        .withMessage("FirstName must be at least 3 chars long"),
    body("LastName")
        .exists()
        .withMessage("LastName is required")
        .isLength({
            min: 3,
        })
        .withMessage("LastName must be at least 3 chars long"),
    body("DOB")
        .exists()
        .withMessage("DOB is required")
        .isDate()
        .withMessage("DOB must be a valid date"),
    body("PermanentAddress")
        .exists()
        .withMessage("PermanentAddress is required")
        .isLength({
            min: 10,
        })
        .withMessage("PermanentAddress must be at least 10 chars long"),

    body("ContactNumber")
        .exists()
        .withMessage("ContactNumber is required")
        .isMobilePhone("any")
        .withMessage("Must be a valid mobile number")
        .isLength({
            min: 10,
        })
        .withMessage("ContactNumber must be at least 10 digits long"),
    body("EmailId")
        .exists()
        .withMessage("EmailId is required")
        .isEmail()
        .withMessage("Must be a valid email")
        .normalizeEmail(),
    body("Vehicle")
        .exists()
        .withMessage("Vehicle is required"),
    body("MakeName")
        .exists()
        .withMessage("MakeName is required"),
    body("ModelName")
        .exists()
        .withMessage("ModelName is required"),
    body("DateOfRegistration")
        .exists()
        .withMessage("DateOfRegistration is required")
        .isDate()
        .withMessage("DateOfRegistration must be a valid date"),
    body("YearOfManufacture")
        .exists()
        .withMessage("YearOfManufacture is required")
        .isNumeric()
        .withMessage("YearOfManufacture must be a number"),
    body("RtoRegistered")
        .exists()
        .withMessage("RtoRegistered is required"),
    body("RegistrationNumber")
        .exists()
        .withMessage("RegistrationNumber is required")
        .isLength({
            min: 3,
        })
        .withMessage("RegistrationNumber must be at least 3 chars long"),
    body("EngineNumber")
        .exists()
        .withMessage("EngineNumber is required")
        .isLength({
            min: 3,
        })
        .withMessage("EngineNumber must be at least 3 chars long"),
    body("ChasisNumber")
        .exists()
        .withMessage("ChasisNumber is required")
        .isLength({
            min: 3,
        })
        .withMessage("ChasisNumber must be at least 3 chars long"),
    body("CubicCapacity")
        .exists()
        .withMessage("CubicCapacity is required")
        .isNumeric()
        .withMessage("CubicCapacity must be a number"),
    body("SeatingCapacity")
        .exists()
        .withMessage("SeatingCapacity is required")
        .isNumeric()
        .withMessage("SeatingCapacity must be a number"),
    body("FuelType")
        .exists()
        .withMessage("FuelType is required"),
    body("PolicyNumber")
        .exists()
        .withMessage("PolicyNumber is required")
        .isLength({
            min: 3,
        })
        .withMessage("PolicyNumber must be at least 3 chars long"),
    body("NomineeName")
        .exists()
        .withMessage("NomineeName is required")
        .isLength({
            min: 3,
        })
        .withMessage("NomineeName must be at least 3 chars long"),
    body("NomineeAge")
        .exists()
        .withMessage("NomineeAge is required")
        .isNumeric()
        .withMessage("NomineeAge must be a number"),
    body("NomineeRelationship")
        .exists()
        .withMessage("NomineeRelationship is required")
        .isLength({
            min: 3,
        })
        .withMessage("NomineeRelationship must be at least 3 chars long"),
];