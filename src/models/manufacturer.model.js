const connection = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'manufacturer';

/**
 * Find all manufacturers with optional filter parameters.
 *
 * @param {Object} params - The filter parameters.
 * @returns {Promise<Array>} - A promise that resolves to an array of manufacturers.
 */
exports.findAllManufacturersQuery = async (params = {}) => {
    // Generate base SQL query
    let sql = `SELECT Id, ManufacturerName FROM ${tableName} WHERE EntityState = 1`;

    // Log the generated SQL query
    logger.info(` DB Query : Get AllManufacturers Sql : ${sql}`);

    // Check if params object is empty
    if (!Object.keys(params).length) {
        // If params object is empty, return all manufacturers
        return await connection.query(sql);
    }

    // Generate column set and values for WHERE clause
    const { columnSet, values } = multipleColumnSet(params);

    // Append WHERE clause to SQL query
    sql += ` LIMIT ${values[1]}, ${values[0]}`;
    logger.info(` DB Query : Get AllEnquiries Sql : ${sql}`);

    // Execute the query with the specified values
    return await connection.query(sql, [...values]);
}

/**
 * Retrieves a manufacturer by ID from the database
 * @param {Object} params - The parameters for the query
 * @returns {Promise<Object>} - The manufacturer record
 */
exports.findManufacturerByNameQuery = async (params) => {
    // Generate columnSet and values for the query
    const { columnSet, values } = multipleColumnSet(params);
    // Construct the SQL query
    const sql = `SELECT Id,ManufacturerName FROM ${tableName}
    WHERE ${columnSet}`;

    // Log the SQL query
    logger.info(` DB Query : Get ManufacturerById Sql : ${sql}`);

    // Execute the query and retrieve the result
    const result = await connection.query(sql, [...values]);

    // Return the manufacturer record
    return result[0];
};


/**
 * Creates a query to insert a new manufacturer into the database.
 * @param {Object} manufacturer - The manufacturer object.
 * @param {string} manufacturer.ManufacturerName - The name of the manufacturer.
 * @returns {Promise<number>} The number of affected rows.
 */
exports.createManufacturerQuery = async ({ ManufacturerName }) => {
    // Define the SQL query
    const sql = `INSERT INTO ${tableName} ( ManufacturerName ) VALUES (?)`;

    // Execute the query and get the result
    const result = await connection.query(sql, [ManufacturerName]);

    // Extract the number of affected rows from the result
    const affectedRows = result ? result.affectedRows : 0;

    // Return the number of affected rows
    return affectedRows;
}


/**
 * Update the manufacturer record with the given parameters.
 * @param {object} params - The parameters to update.
 * @param {number} id - The ID of the manufacturer to update.
 * @returns {Promise<object>} - The result of the update query.
 */
exports.updateManufacturerQuery = async (params, id) => {
    // Generate the column set and values for the update query
    const { columnSet, values } = multipleColumnSet(params);

    // Construct the update query
    const sql = `UPDATE ${tableName} SET ${columnSet} WHERE id = ?`;

    // Log the update query
    logger.info(`DB Query : Update Manufacturer Sql : ${sql}`);

    // Execute the update query
    const result = await connection.query(sql, [...values, id]);

    // Return the result of the update query
    return result;
}

/**
 * Deletes a manufacturer from the database based on the provided ID.
 *
 * @param {number} id - The ID of the manufacturer to delete.
 * @returns {Promise<Object>} - A promise that resolves to the result of the delete operation.
 */
exports.deleteManufacturerQuery = async (id) => {
    // Construct the SQL query
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;

    // Log the generated SQL query
    logger.info(`DB Query : Delete Manufacturer Sql : ${sql}`);

    // Execute the query and retrieve the result
    const result = await connection.query(sql, [id]);

    // Return the result
    return result;
}
