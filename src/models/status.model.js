const connection = require("../db/db-connection");
const { multipleStatusColumnSet } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName='status';

// ************************get all status*********************************
exports.getAllStatusQuery = async (params = {}) => {
    // Generate base SQL query
    let sql = `SELECT id, Status,ParentTypeStatus FROM ${tableName} WHERE ParentTypeStatus = 0`;

    // Log the generated SQL query
    logger.info(` DB Query : Get AllStatusTypes Sql : ${sql}`);

    // Check if params object is empty
    if (!Object.keys(params).length) {
        // If params object is empty, return all status
        return await connection.query(sql);
    }

    // Generate column set and values for WHERE clause
    const { columnSet, values } = multipleColumnSet(params);

    // Append WHERE clause to SQL query
    sql += ` LIMIT ${values[1]}, ${values[0]}`;
    logger.info(` DB Query : Get Status Sql : ${sql}`);

    // Execute the query with the specified values
    return await connection.query(sql, [...values]);
}

// ******************* get status by id ****************************

exports.getAllStatusByIdQuery = async (id) => {
    // Generate base SQL query
    let sql = `SELECT id, Status, ParentTypeStatus FROM ${tableName} WHERE ParentTypeStatus = ?`;
  
    // Log the generated SQL query
    logger.info(`DB Query: Get AllStatusTypes with ParentTypeStatus = ${id}`);

    // Execute the query with the specified id
    return await connection.query(sql, [id]);
}




exports.getAllStatusByNameQuery = async (params = {}) => {
    // Generate columnSet and values for the query
    const { columnSet, values } =multipleStatusColumnSet(params);
    console.log(values,columnSet)
    // Construct the SQL query
    const sql = `SELECT Id,Status,ParentTypeStatus FROM ${tableName}
     WHERE ${columnSet}`;


    // Log the SQL query
    logger.info(` DB Query : Get StatusById Sql : ${sql}`);

    // Execute the query and retrieve the result
    const result = await connection.query(sql, [...values]);
    // Return the FuelType record
    return result[0];
}

exports.createStatusQuery = async ({ Status,ParentTypeStatus }) => {
    // Construct the SQL query
    const sql = `INSERT INTO ${tableName} (Status,ParentTypeStatus) VALUES (?,?)`;

    // Execute the query and get the result
    const result = await connection.query(sql, [Status,ParentTypeStatus]);

    return result;
}



exports.updateStatusQuery = async (params, id) => {
    // Generate column set and values
    const { columnSet, values } = multipleStatusColumnSet(params);

    // Generate the SQL query
    const sql = `UPDATE ${tableName} SET ${columnSet} WHERE id = ?`;

    // Log the query
    logger.info(`DB Query: Update status Sql: ${sql}`);

    // Execute the update query
    const result = await connection.query(sql, [...values, id]);

    // Return the result
    return result;
}


exports.deleteStatusQuery = async (id) => {
    // Construct the SQL query
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;

    // Log the query
    logger.info(`DB Query : Delete Status Sql : ${sql}`);

    // Execute the query and return the result
    const result = await connection.query(sql, [id]);
    return result;
}



