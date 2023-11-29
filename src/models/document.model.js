const connection = require("../db/db-connection");
const { multipleColumnSet, multipleColumnSetQueryParams } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'documents'

exports.getAlldocumentByEnquireId = async (id) => {
    logger.info("Document Id: ",id)
    let sql = `SELECT Id, DocumentName,FileName,EnquiryId,CreatedOn,EditedOn  FROM ${tableName} WHERE EnquiryId = ?`;
    logger.info(`db query: get All Documnets with EnquiryId:${id}`);
    return await connection.query(sql, [id]);
}

exports.getDocumentbyId=async(id)=>{
   logger.info("Document Id: ",id);
   let sql=`SELECT Id,DocumentName,FileName,EnquiryId FROM ${tableName} WHERE Id=?`;
   logger.info(`Db query: get Document By Id: ${sql}`);
   return await connection.query(sql,[id])
}

exports.createDocument = async (data) => {
    const { DocumentName, FileName, EnquiryId,CreatedBy } = data
    let sql = `INSERT INTO ${tableName} (DocumentName,FileName, EnquiryId,CreatedBy ) VALUES (?,?,?,?) `;
    logger.info(`db query: create document query:${sql}`)
    const result = await connection.query(sql, [DocumentName, FileName, EnquiryId,CreatedBy]);
    logger.info(`db result: database result${result}`)
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows
}

exports.updateDocument = async (file,EditedBy,EditedOn, id) => {
    const sql = `UPDATE ${tableName} SET FileName = ?,EditedBy=?,EditedOn=? where id = ?`;
    logger.info(`db query:update document query:${sql}`);

    const result = await connection.query(sql, [file,EditedBy,EditedOn,id]);
    // Return the result
    return result;
}