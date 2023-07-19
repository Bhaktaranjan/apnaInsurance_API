const connection = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'fueltype';

/**
 * Retrieves all fuel types from the database.
 * @param {object} params - Additional filter parameters (optional).
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of fuel types.
 */
exports.getAllFuelTypesQuery = async (params = {}) => {
    // Construct the base SQL query
    let sql = `SELECT Id,FuelType FROM ${tableName} WHERE EntityState = 1`;

    // Log the SQL query
    logger.info(`DB Query: Get AllFuelTypes Sql: ${sql}`);

    // Check if there are any additional filter parameters
    if (Object.keys(params).length <= 0) {
        // If not, execute the query and return the result
        return await connection.query(sql);
    } else {
        // Generate the column set and values for the filter parameters
        const { columnSet, values } = multipleColumnSet(params);

        // Append the filter condition to the SQL query
        sql += ` WHERE ${columnSet}`;

        // Execute the query with the filter parameters and return the result
        return await connection.query(sql, [...values]);
    }
}

/**
 * Creates a fuel type query and inserts it into the database.
 * 
 * @param {Object} params - The fuel type information.
 * @param {string} params.FuelType - The fuel type to be inserted.
 * @returns {Promise<Object>} - The result of the query execution.
 */
exports.createFuelTypeQuery = async ({ FuelType }) => {
    // Construct the SQL query
    const sql = `INSERT INTO ${tableName} (FuelType) VALUES (?)`;

    // Execute the query and get the result
    const result = await connection.query(sql, [FuelType]);

    return result;
}

/**
 * Updates the fuel type query in the database for a given id.
 *
 * @param {object} params - The fuel type parameters to be updated.
 * @param {number} id - The id of the fuel type to be updated.
 * @returns {Promise<object>} - The result of the update query.
 */
exports.updateFuelTypeQuery = async (params, id) => {
    // Generate column set and values
    const { columnSet, values } = multipleColumnSet(params);

    // Generate the SQL query
    const sql = `UPDATE ${tableName} SET ${columnSet} WHERE id = ?`;

    // Log the query
    logger.info(`DB Query: Update FuelType Sql: ${sql}`);

    // Execute the update query
    const result = await connection.query(sql, [...values, id]);

    // Return the result
    return result;
}

/**
 * Deletes a fuel type record from the database based on the provided ID.
 * @param {number} id - The ID of the fuel type to delete.
 * @returns {Promise<object>} - A promise that resolves to the result of the deletion operation.
 */
exports.deleteFuelTypeQuery = async (id) => {
    // Construct the SQL query
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;

    // Log the query
    logger.info(`DB Query : Delete FuelType Sql : ${sql}`);

    // Execute the query and return the result
    const result = await connection.query(sql, [id]);
    return result;
}
