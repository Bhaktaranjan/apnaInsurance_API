const connection = require('../db/db-connection');
const { multipleColumnSet, multipleColumnSetQueryParams } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'vehicle';

/**
 * Retrieves all vehicles from the database.
 * @param {Object} params - Additional parameters for filtering the results (optional).
 * @returns {Promise<Array>} - A promise that resolves to an array of vehicles.
 */
exports.getAllVehiclesWithManufacturerNameQuery = async (params = {}) => {
    // Construct the base SQL query
    let sql = `SELECT vehicle.Id,vehicle.VehicleName,manufacturer.ManufacturerName FROM vehicle LEFT JOIN manufacturer ON vehicle.ManufacturerId = manufacturer.Id
    `;

    // Log the query to the console
    logger.info(`DB Query: Get AllVehicles Sql: ${sql}`);

    // Check if there are any additional filter parameters
    if (!Object.keys(params).length) {
        // If not, execute the query and return the result
        return await connection.query(sql);
    }

    // Generate the column set and values for the filter parameters
    const { columnSetQueryParams, values } = multipleColumnSetQueryParams(params);
    // Append the filter condition to the SQL query
    sql += ` LIMIT ${values[1]}, ${values[0]}`;
    logger.info(` DB Query : Get AllVehicles Sql : ${sql}`);

    // Execute the query with the filter parameters and return the result
    return await connection.query(sql, [...values]);
}

exports.getAllVehiclesQuery = async (params = {}) => {
    // Construct the base SQL query
    let sql = `SELECT * FROM ${tableName}`;

    // Log the query to the console
    logger.info(`DB Query: Get AllVehicles Sql: ${sql}`);

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

exports.getAllVehiclesByManufacturerIdQuery = async (ManufacturerId) => {
    // Construct the base SQL query
    let sql = `SELECT Id,VehicleName, ManufacturerId FROM ${tableName} WHERE ManufacturerId = ?`;

    // Log the query to the console
    logger.info(`DB Query: Get AllVehiclesByManufacturerId Sql: ${sql}`);

    // Execute the query and return the result
    return await connection.query(sql, [ManufacturerId]);
}

/**
 * Create a vehicle query and insert it into the database.
 * 
 * @param {Object} data - The data object containing the Name and ManufacturerId.
 * @param {string} data.Name - The name of the vehicle.
 * @param {number} data.ManufacturerId - The ID of the manufacturer.
 * @returns {Promise<number>} - The number of affected rows in the database.
 */
exports.createVehicleQuery = async ({ VehicleName, ManufacturerId }) => {

    // Create the SQL query
    const sql = `INSERT INTO ${tableName} (VehicleName, ManufacturerId) VALUES (?,?)`;

    // Log the SQL query
    logger.info(` DB Query : Create Vehicle Sql : ${sql}`);

    // Execute the SQL query and get the result
    const result = await connection.query(sql, [VehicleName, ManufacturerId]);

    // Get the number of affected rows
    const affectedRows = result ? result.affectedRows : 0;

    // Return the number of affected rows
    return affectedRows;
}

/**
 * Update vehicle query.
 * @param {Object} params - The parameters for the update.
 * @param {string} id - The id of the vehicle to update.
 * @returns {Promise<Object>} - The result of the update operation.
 */
exports.updateVehicleQuery = async (params, id) => {
    // Generate column set and values for update statement
    const { columnSet, values } = multipleColumnSet(params);

    // Construct the SQL update statement
    const sql = `UPDATE ${tableName} SET ${columnSet} WHERE id = ?`;

    // Log the generated SQL query
    logger.info(`DB Query : Update Vehicle Sql : ${sql}`);

    // Execute the update query
    const result = await connection.query(sql, [...values, id]);

    return result;
}

/**
 * Deletes a vehicle from the database based on its ID.
 * @param {number} id - The ID of the vehicle to delete.
 * @returns {Promise<object>} - A promise that resolves to the result of the deletion operation.
 */
exports.deleteVehicleQuery = async (id) => {
    // Construct the SQL query to delete the vehicle based on its ID
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;

    // Log the delete vehicle query
    logger.info(`DB Query : Delete Vehicle Sql : ${sql}`);

    // Execute the delete query with the provided ID
    const result = await connection.query(sql, [id]);

    // Return the result of the deletion operation
    return result;
}
