const connection = require("../db/db-connection");
const logger = require("../middleware/logger");
const dotenv = require("dotenv");
dotenv.config();
const tablename = process.env.DOCUMENT_TABLE;

exports.createDocumentQuery = async (data) => {
  const { DocumentName, StatusId, CreatedBy } = data;
  const sql = `INSERT INTO ${tablename} (DocumentName,StatusId) VALUES (?,?)`;
  logger.info(`db query: Create document sql:${sql}`);
  return await connection.query(sql, [DocumentName, StatusId]);
};

exports.getAllDocumnetQuery = async () => {
  let sql = `SELECT * FROM ${tablename}`;
  logger.info(`db query: Get all documnet sql:${sql}`);
  return await connection.query(sql);
};

exports.getAllDocumentByStatusIdQuery = async (statusid) => {
  const sql = `SELECT Id,DocumentName FROM ${tablename} WHERE StatusId = ?`;
  logger.info(`db query: Get all document by statusid sql:${sql}`);
  return await connection.query(sql, [statusid]);
};
