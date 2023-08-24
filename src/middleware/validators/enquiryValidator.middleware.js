const { body } = require('express-validator');

exports. createEnquirySchema = [
    body("FirstName")
        .exists()
        .withMessage("FirstName is required")
        .isLength({
            min: 1,
        })
        .withMessage("FirstName must be minimum 1 chars long")
        .isLength({
            max: 25,
        })
        .withMessage("FirstName must be maximum 25 chars long"),

    body("LastName")
        .exists()
        .withMessage("LastName is required")
        .isLength({
            min: 1,

        })
        .withMessage("LastName must be minimum 1 chars long")
        .isLength({
            max: 25,
            
        })
        .withMessage("LastName must be maximum 25 chars long"),

    body("DOB")
        .exists()
        .withMessage("DOB is required")
        .isDate()
        .withMessage("DOB must be a valid date"),

    body("PermanentAddress1")
        .exists()
        .withMessage("PermanentAddress1 is required")
        .isLength({
            max: 50,
        })
        .withMessage("PermanentAddress1 must be maximum 50 chars long"),

    body("PermanentAddress2")
        .exists()
        .withMessage("PermanentAddress2 is required")
        .isLength({
            max: 50,
        })
        .withMessage("PermanentAddress2 must be maximum 50 chars long"),

    body("PermanentAddress3")
        .exists()
        .withMessage("PermanentAddress3 is required")
        .isLength({
            max: 50,
        })
        .withMessage("PermanentAddress3 must be maximum 50 chars long"),

    body("ContactNumber")
        .exists()
        .withMessage("ContactNumber is required")
        .isMobilePhone("any")
        .withMessage("Must be a valid mobile number")
        .isLength({
            min: 10,
            max: 10,
        })
        .withMessage("ContactNumber must be at least 10 digits long"),

    body("EmailId")
        .exists()
        .withMessage("EmailId is required")
        .isEmail()
        .withMessage("Must be a valid email")
        .normalizeEmail(),

    body("Manufacturer")
        .exists()
        .withMessage("Manufacturer is required"),

    body("Vehicle")
        .exists()
        .withMessage("Vehicle is required"),

    body("ModelName")
        .exists()
        .withMessage("ModelName is required"),

    body("DateOfRegistration")
        .exists()
        .withMessage("DateOfRegistration is required"),

    body("YearOfManufacture")
        .exists()
        .withMessage("YearOfManufacture is required"),

    body("RtoRegistered")
        .exists()
        .withMessage("RtoRegistered is required"),

    body("RegistrationNumber")
        .exists()
        .withMessage("RegistrationNumber is required"),

    body("EngineNumber")
        .exists()
        .withMessage("EngineNumber is required")
        .isLength({
            max: 20,
        })
        .withMessage("EngineNumber must be maximum 20 chars long"),

    body("ChasisNumber")
        .exists()
        .withMessage("ChasisNumber is required")
        .isLength({
            max: 20,
        })
        .withMessage("ChasisNumber must be maximum 20 chars long"),

    body("CubicCapacity")
        .exists()
        .withMessage("CubicCapacity is required")
        .isLength({
            max: 6,
        })
        .withMessage("CubicCapacity must be maximum 6 chars long"),

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
            max: 20,
        })
        .withMessage("PolicyNumber must be maximum 20 chars long"),

    body("InsuranceCompany")
        .exists()
        .withMessage("InsuranceCompany is required"),

    body("CurrentInsuredFirstName")
        .exists()
        .withMessage("CurrentInsuredFirstName is required")
        .isLength({
            min: 1,
            
        })
        .withMessage("CurrentInsuredFirstName must be minimum 1 chars long")
        .isLength({
            max: 25,
        })
        .withMessage("CurrentInsuredFirstName must be maximum 25 chars long"),
       
        body("CurrentInsuredLastName")
        .exists()
        .withMessage("CurrentInsuredLastName is required")
        .isLength({
            min: 1,
        })
        .withMessage("CurrentInsuredLastName must be minimum 1 chars long")
        .isLength({
            max: 25,
        })
        .withMessage("CurrentInsuredLastName must be maximum 25 chars long"),
        
    body("NomineeName")
        .exists()
        .withMessage("NomineeName is required")
        .isLength({
            min: 1,
            max: 20,
        })
        .withMessage("NomineeName must be maximum 20 chars long"),

    body("NomineeAge")
        .exists()
        .withMessage("NomineeAge is required")
        .isNumeric()
        .withMessage("NomineeAge must be a number")
        .isLength({
            max: 3,
        })
        .withMessage("NomineeAge must be maximum 3 digits long"),

    body("NomineeRelationship")
        .exists()
        .withMessage("NomineeRelationship is required"),
];