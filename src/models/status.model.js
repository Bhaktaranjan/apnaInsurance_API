const connection = require("../db/db-connection");
const { multipleStatusColumnSet, multipleColumnSet, multipleColumnSetQueryParams } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'status';

// ************************get all status*********************************
exports.getAllStatusQuery = async (params = {}) => {
    // Generate base SQL query
    let sql = `SELECT id, StatusName,ParentTypeStatus FROM ${tableName}`;

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

exports.getAllStatusByParentTypeIdQuery = async (id) => {
    // Generate base SQL query
    let sql = `SELECT Id, StatusName, ParentTypeStatus FROM ${tableName} WHERE ParentTypeStatus = ?`;

    // Log the generated SQL query
    logger.info(`DB Query: Get AllStatusTypes with ParentTypeStatus = ${id}`);

    // Execute the query with the specified id
    return await connection.query(sql, [id]);
}

exports.getAllStatusByIdQuery = async (id) => {
    // Generate base SQL query
    let sql = `SELECT Id, StatusName, ParentTypeStatus FROM ${tableName} WHERE Id = ?`;

    // Log the generated SQL query
    logger.info(`DB Query: Get AllStatusTypes with Id = ${id}`);

    // Execute the query with the specified id
    const result = await connection.query(sql, [id]);
    return result[0];
}

exports.getAllStatusByNameQuery = async (params = {}) => {
    // Generate columnSet and values for the query
    let sql = `SELECT * FROM ${tableName}`;
    logger.info(`DB Query: Get AllStatus Sql: ${sql}`);

    // Check if there are any additional filter parameters
    if (Object.keys(params).length <= 0) {
        // If not, execute the query and return the result
        return await connection.query(sql);
    } else {
        // Generate the column set and values for the filter parameters
        const { columnSetQueryParams, values } = multipleColumnSetQueryParams(params);
        // Append the filter condition to the SQL query
        sql += ` WHERE ${columnSetQueryParams}`;
        // Execute the query with the filter parameters and return the result
        const result = await connection.query(sql, [...values]);
        return result[0];
    }
}

exports.createStatusQuery = async ({ StatusName, ParentTypeStatus }) => {
    // Construct the SQL query
    const sql = `INSERT INTO ${tableName} (StatusName,ParentTypeStatus) VALUES (?,?)`;

    // Execute the query and get the result
    const result = await connection.query(sql, [StatusName, ParentTypeStatus]);

    return result;
}

exports.updateStatusQuery = async (params, id) => {
    // Generate column set and values
    const { columnSet, values } = multipleColumnSet(params);
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