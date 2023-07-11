const connection = require('../db/db-connection');
const { multipleColumnSet, multipleColumnSetQueryParams } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'model_variant';

/**
 * Retrieves all model variants from the database.
 * 
 * @param {Object} params - Optional filter parameters.
 * @returns {Promise<Array>} - A promise that resolves to an array of model variants.
 */
exports.getAllModelVariantsQuery = async (params = {}) => {
    // Construct the base SQL query
    let sql = `SELECT * FROM ${tableName}`;
    logger.info(`DB Query: Get AllModelVariants Sql: ${sql}`);

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

exports.getAllModelVariantsByVehicleModelIdQuery = async (VehicleModelId) => {
    // Construct the base SQL query
    let sql = `SELECT * FROM ${tableName} WHERE  VehicleModelId = ?`;
    logger.info(`DB Query: Get AllModelVariantsByVehicleModelId Sql: ${sql}`);

    // Execute the query and return the result

    return await connection.query(sql, [VehicleModelId]);
}

/**
 * Creates a model variant query in the database.
 * 
 * @param {Object} options - The options for creating the model variant query.
 * @param {number} options.VehicleModelId - The ID of the vehicle model.
 * @param {number} options.ManufaturerId - The ID of the manufacturer.
 * @param {string} options.Name - The name of the model variant.
 * @returns {Promise<Object>} - The result of the SQL query execution.
 */
exports.createModelVariantQuery = async ({ VehicleModelId, ManufaturerId, Name }) => {
    // Create the SQL query
    const sql = `INSERT INTO ${tableName} (VehicleModelId, ManufaturerId, Name ) VALUES (?,?,?)`;

    // Log the SQL query
    logger.info(` DB Query : Create ModelVariant Sql : ${sql}`);

    // Execute the SQL query and get the result
    const result = await connection.query(sql, [VehicleModelId, ManufaturerId, Name]);
    return result;
}

/**
 * Update a model variant query.
 * 
 * @param {Object} params - The parameters used to generate the update query.
 * @param {number} id - The ID of the model variant to update.
 * @returns {Object} - The result of the update query.
 */
exports.updateModelVariantQuery = async (params, id) => {
    // Generate column set and values for the update query
    const { columnSet, values } = multipleColumnSet(params);

    // Generate the SQL query
    const sql = `UPDATE ${tableName} SET ${columnSet} WHERE id = ?`;

    // Log the update query
    logger.info(`DB Query: Update ModelVariant SQL: ${sql}`);

    // Execute the update query with the values and ID
    const result = await connection.query(sql, [...values, id]);

    // Return the result of the update query
    return result;
}

/**
 * Deletes a model variant from the database based on its ID.
 * @param {number} id - The ID of the model variant to delete.
 * @returns {Promise} A promise that resolves to the result of the deletion operation.
 */
exports.deleteModelVariantQuery = async (id) => {
    // Construct the SQL query to delete the model variant
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;

    // Log the generated SQL query
    logger.info(`DB Query : Delete ModelVariant Sql : ${sql}`);

    // Execute the SQL query with the provided ID parameter
    const result = await connection.query(sql, [id]);

    // Return the result of the deletion operation
    return result;
}
