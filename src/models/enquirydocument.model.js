const connection = require("../db/db-connection");
const {
  multipleColumnSet,
  multipleColumnSetQueryParams,
} = require("../utils/common.utils");
const logger = require("../middleware/logger");

const tableName = "enquiry_documents";

exports.getAllEnquiryDocumentByEnquireIdQuery = async (id) => {
  logger.info("Document Id: ", id);
  let sql = `SELECT Id, DocumentName,FileName,EnquiryId,CreatedOn,EditedOn  FROM ${tableName} WHERE EnquiryId = ?`;
  logger.info(`db query: get All Documnets with EnquiryId:${id}`);
  return await connection.query(sql, [id]);
};

exports.getEnquiryDocumentbyIdQuery = async (id) => {
  let sql = `SELECT Id,DocumentName,FileName,EnquiryId FROM ${tableName} WHERE Id=?`;
  logger.info(`Db query: get Document By Id: ${sql}`);
  return await connection.query(sql, [id]);
};

exports.createEnquiryDocumentQuery = async (data) => {
  const { DocumentName, FileName, EnquiryId, CreatedBy } = data;
  let sql = `INSERT INTO ${tableName} (DocumentName,FileName, EnquiryId,CreatedBy ) VALUES (?,?,?,?) `;
  logger.info(`db query: create document query:${sql}`);
  const result = await connection.query(sql, [
    DocumentName,
    FileName,
    EnquiryId,
    CreatedBy,
  ]);
  const affectedRows = result ? result.affectedRows : 0;
  return affectedRows;
};

exports.updateEnquiryDocumentQuery = async (file, EditedBy, EditedOn, id) => {
  const sql = `UPDATE ${tableName} SET FileName = ?,EditedBy=?,EditedOn=? where id = ?`;
  logger.info(`db query:update document query:${sql}`);

  const result = await connection.query(sql, [file, EditedBy, EditedOn, id]);
  // Return the result
  return result;
};

exports.deleteEnquiryDocumentQuery = async (id) => {
  const sql = `DELETE FROM ${tableName} WHERE id = ?`;
  logger.info(`db query:delete document query:${sql}`);
  const result = await connection.query(sql, [id]);
  return result;
};