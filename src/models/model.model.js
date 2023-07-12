const connection = require('../db/db-connection');
const { multipleColumnSet, multipleColumnSetQueryParams } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'model';

/**
 * Retrieves all model s from the database.
 * 
 * @param {Object} params - Optional filter parameters.
 * @returns {Promise<Array>} - A promise that resolves to an array of model s.
 */
exports.getAllModelsQuery = async (params = {}) => {
    // Construct the base SQL query
    let sql = `SELECT Id,Name FROM ${tableName}`;
    logger.info(`DB Query: Get AllModels Sql: ${sql}`);

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
        return await connection.query(sql, [...values]);
    }
}

exports.getAllModelsByVehicleModelIdQuery = async (VehicleId) => {
    // Construct the base SQL query
    let sql = `SELECT Id,Name FROM ${tableName} WHERE  VehicleId = ?`;
    logger.info(`DB Query: Get AllModelsByVehicleId Sql: ${sql}`);

    // Execute the query and return the result

    return await connection.query(sql, [VehicleId]);
}

/**
 * Creates a model  query in the database.
 * 
 * @param {Object} options - The options for creating the model  query.
 * @param {number} options.VehicleId - The ID of the vehicle model.
 * @param {number} options.ManufaturerId - The ID of the manufacturer.
 * @param {string} options.Name - The name of the model .
 * @returns {Promise<Object>} - The result of the SQL query execution.
 */
exports.createModelQuery = async ({ VehicleId, ManufaturerId, Name }) => {
    // Create the SQL query
    const sql = `INSERT INTO ${tableName} (VehicleId, ManufaturerId, Name ) VALUES (?,?,?)`;

    // Log the SQL query
    logger.info(` DB Query : Create Model Sql : ${sql}`);

    // Execute the SQL query and get the result
    const result = await connection.query(sql, [VehicleId, ManufaturerId, Name]);
    return result;
}

/**
 * Update a model  query.
 * 
 * @param {Object} params - The parameters used to generate the update query.
 * @param {number} id - The ID of the model  to update.
 * @returns {Object} - The result of the update query.
 */
exports.updateModelQuery = async (params, id) => {
    // Generate column set and values for the update query
    const { columnSet, values } = multipleColumnSet(params);

    // Generate the SQL query
    const sql = `UPDATE ${tableName} SET ${columnSet} WHERE id = ?`;

    // Log the update query
    logger.info(`DB Query: Update Model SQL: ${sql}`);

    // Execute the update query with the values and ID
    const result = await connection.query(sql, [...values, id]);

    // Return the result of the update query
    return result;
}

/**
 * Deletes a model  from the database based on its ID.
 * @param {number} id - The ID of the model  to delete.
 * @returns {Promise} A promise that resolves to the result of the deletion operation.
 */
exports.deleteModelQuery = async (id) => {
    // Construct the SQL query to delete the model 
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;

    // Log the generated SQL query
    logger.info(`DB Query : Delete Model Sql : ${sql}`);

    // Execute the SQL query with the provided ID parameter
    const result = await connection.query(sql, [id]);

    // Return the result of the deletion operation
    return result;
}
