const connection = require('../db/db-connection');
const { multipleColumnSet, multipleColumnSetQueryParams } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'vehicle_model';

/**
 * Retrieves all vehicle models from the database.
 * @param {Object} params - Additional parameters for filtering the results (optional).
 * @returns {Promise<Array>} - A promise that resolves to an array of vehicle models.
 */
exports.getAllVehicleModelsQuery = async (params = {}) => {
    // Construct the base SQL query
    let sql = `SELECT * FROM ${tableName}`;

    // Log the query to the console
    logger.info(`DB Query: Get AllVehicleModels Sql: ${sql}`);

    // Check if there are any additional filter parameters
    if (!Object.keys(params).length) {
        // If not, execute the query and return the result
        return await connection.query(sql);
    }

    // Generate the column set and values for the filter parameters
    const { columnSetQueryParams, values } = multipleColumnSetQueryParams(params);
    // Append the filter condition to the SQL query
    sql += ` WHERE ${columnSetQueryParams}`;

    // Execute the query with the filter parameters and return the result
    return await connection.query(sql, [...values]);
}

exports.getAllVehicleModelsByManufacturerIdQuery = async (ManufaturerId) => {
    // Construct the base SQL query
    let sql = `SELECT * FROM ${tableName} WHERE ManufaturerId = ?`;

    // Log the query to the console
    logger.info(`DB Query: Get AllVehicleModelsByManufacturerId Sql: ${sql}`);

    // Execute the query and return the result
    return await connection.query(sql, [ManufaturerId]);
}

/**
 * Create a vehicle model query and insert it into the database.
 * 
 * @param {Object} data - The data object containing the Name and ManufacturerId.
 * @param {string} data.Name - The name of the vehicle model.
 * @param {number} data.ManufacturerId - The ID of the manufacturer.
 * @returns {Promise<number>} - The number of affected rows in the database.
 */
exports.createVehicleModelQuery = async ({ Name, ManufaturerId }) => {

    // Create the SQL query
    const sql = `INSERT INTO ${tableName} (Name, ManufaturerId) VALUES (?,?)`;

    // Log the SQL query
    logger.info(` DB Query : Create VehicleModel Sql : ${sql}`);

    // Execute the SQL query and get the result
    const result = await connection.query(sql, [Name, ManufaturerId]);

    // Get the number of affected rows
    const affectedRows = result ? result.affectedRows : 0;

    // Return the number of affected rows
    return affectedRows;
}

/**
 * Update vehicle model query.
 * @param {Object} params - The parameters for the update.
 * @param {string} id - The id of the vehicle model to update.
 * @returns {Promise<Object>} - The result of the update operation.
 */
exports.updateVehicleModelQuery = async (params, id) => {
    // Generate column set and values for update statement
    const { columnSet, values } = multipleColumnSet(params);

    // Construct the SQL update statement
    const sql = `UPDATE ${tableName} SET ${columnSet} WHERE id = ?`;

    // Log the generated SQL query
    logger.info(`DB Query : Update VehicleModel Sql : ${sql}`);

    // Execute the update query
    const result = await connection.query(sql, [...values, id]);

    return result;
}

/**
 * Deletes a vehicle model from the database based on its ID.
 * @param {number} id - The ID of the vehicle model to delete.
 * @returns {Promise<object>} - A promise that resolves to the result of the deletion operation.
 */
exports.deleteVehicleModelQuery = async (id) => {
    // Construct the SQL query to delete the vehicle model based on its ID
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;

    // Log the delete vehicle model query
    logger.info(`DB Query : Delete VehicleModel Sql : ${sql}`);

    // Execute the delete query with the provided ID
    const result = await connection.query(sql, [id]);

    // Return the result of the deletion operation
    return result;
}
