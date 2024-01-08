const HttpException = require("../utils/HttpException.utils");
const logger = require("../middleware/logger");
const documentModel = require("../models/document.model");
const { validationResult } = require("express-validator");

// ************************ Get All Document *************************************
exports.getAllDocument = async (req, res, next) => {
  try {
    const DocumentList = await documentModel.getAllDocumnetQuery();
    logger.success("Document fetched Successfully");
    res.status(200).send({
      status: 200,
      message: "Document fetched successfully.",
      DocumentList,
    });
  } catch (error) {
    logger.error(error.message);
    req.status(500).send({
      message:
        err.message || "Some error occurred while fetching all document.",
    });
  }
};

// ************************** Get All document By StatusId ******************************
exports.getAllDocumnetByStatusId = async (req, res, next) => {
  logger.info("requesting StatusID:", req.params.statusid);
  try {
    if (
      !req.params.statusid ||
      req.params.statusid === "" ||
      req.params.statusid === ":statusid"
    ) {
      logger.error("Id can not be empty!");
      return res.status(400).send({ message: "Id can not empty!" });
    }

    const documentlist = await documentModel.getAllDocumentByStatusIdQuery(
      req.params.statusid
    );

    if (!documentlist) {
      logger.error("Unable to fetch document");
      res.status(500).send({ message: "Unable to fetch document!" });
    } else {
      logger.success("Document fetched successfully.");
      res.status(200).send({
        status: 200,
        message: "Document",
        documentlist,
      });
    }
  } catch (error) {
    logger.error("some error occured while fetching the data", error.message);
    res
      .status(500)
      .send({
        message: error.message || "some error occurred while fetching the data",
      });
  }
};

// ********************** Create Document ******************************
exports.createDocument = async (req, res, next) => {
  logger.info("Create document data:", req.body);
  try {
    documentCheckValidation(req);
    const result = documentModel.createDocumentQuery(req.body);
    if (!result) {
      logger.error("Unable to create new document");
      throw new HttpException(500, "Unable to create status!");
    }

    logger.success("Document created successfully!");

    // Send success response
    res.status(200).send({
      status: 200,
      message: "Document created successfully!",
    });
  } catch (error) {
    logger.error("Error in creqteing Document:", error.message);
    res
      .status(500)
      .send({
        message:
          error.message || "Some error occurred while creating the Documenet",
      });
  }
};

const documentCheckValidation = (req) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    logger.error("Validation Failed!", validationErrors.errors[0].msg);
    const firstErrorMessage = validationErrors.errors[0].msg;
    throw new HttpException(400, firstErrorMessage, firstErrorMessage);
  }
};
