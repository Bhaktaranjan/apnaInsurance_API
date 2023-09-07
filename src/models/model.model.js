const connection = require('../db/db-connection');
const { multipleColumnSet, multipleColumnSetQueryParams } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'variant';

exports.getAllVariantsWithVehicleModelNameQuery = async (params = {}) => {
    // Construct the base SQL query
    let sql = `SELECT variant.Id, variant.VariantName, variant.ManufacturerId, variant.VehicleModelId, vehicle_model.VehicleModelName, manufacturer.ManufacturerName FROM variant
    LEFT JOIN vehicle_model ON variant.VehicleModelId = vehicle_model.Id 
    LEFT JOIN manufacturer ON vehicle_model.ManufacturerId = manufacturer.Id WHERE variant.EntityState = 1`;

    logger.info(`DB Query: Get AllVariantsWithVehicleModelName Sql: ${sql}`);

    // Check if there are any additional filter parameters
    if (Object.keys(params).length <= 0) {
        // If not, execute the query and return the result
        return await connection.query(sql);
    }

    // Generate the column set and values for the filter parameters
    const { columnSetQueryParams, values } = multipleColumnSetQueryParams(params);
    // Append the filter condition to the SQL query
    sql += ` LIMIT ${values[1]}, ${values[0]}`;
    logger.info(` DB Query : Get AllEnquiries Sql : ${sql}`);

    // Execute the query with the filter parameters and return the result
    return await connection.query(sql, [...values]);
}

/**
 * Retrieves all Variantmodel s from the database.
 * 
 * @param {Object} params - Optional filter parameters.
 * @returns {Promise<Array>} - A promise that resolves to an array of Variantmodel s.
 */
exports.getAllVariantsQuery = async (params = {}) => {
    // Construct the base SQL query
    let sql = `SELECT * FROM ${tableName}`;
    logger.info(`DB Query: Get AllVariantModels Sql: ${sql}`);

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

exports.getAllVariantsByVehicleModelIdQuery = async (VehicleModelId) => {
    // Construct the base SQL query
    let sql = `SELECT Id,VariantName, VehicleModelId, ManufacturerId FROM ${tableName} WHERE  VehicleModelId = ?`;
    logger.info(`DB Query: Get AllVariantsByVehicleModelId Sql: ${sql}`);

    // Execute the query and return the result

    return await connection.query(sql, [VehicleModelId]);
}

/**
 * Creates a Variantmodel  query in the database.
 * 
 * @param {Object} options - The options for creating the Variantmodel  query.
 * @param {number} options.VehicleId - The ID of the vehicle Variantmodel.
 * @param {number} options.ManufacturerId - The ID of the manufacturer.
 * @param {string} options.Name - The name of the Variantmodel .
 * @returns {Promise<Object>} - The result of the SQL query execution.
 */
exports.createVariantQuery = async ({ VehicleModelId, ManufacturerId, VariantName }) => {
    // Create the SQL query
    const sql = `INSERT INTO ${tableName} (VehicleModelId, ManufacturerId, VariantName ) VALUES (?,?,?)`;

    // Log the SQL query
    logger.info(` DB Query : Create Variant Sql : ${sql}`);

    // Execute the SQL query and get the result
    const result = await connection.query(sql, [VehicleModelId, ManufacturerId, VariantName]);
    return result;
}

/**
 * Update a Variantmodel  query.
 * 
 * @param {Object} params - The parameters used to generate the update query.
 * @param {number} id - The ID of the Variantmodel  to update.
 * @returns {Object} - The result of the update query.
 */
exports.updateVariantQuery = async (params, id) => {
    // Generate column set and values for the update query
    const { columnSet, values } = multipleColumnSet(params);

    // Generate the SQL query
    const sql = `UPDATE ${tableName} SET ${columnSet} WHERE id = ?`;

    // Log the update query
    logger.info(`DB Query: Update Variant SQL: ${sql}`);

    // Execute the update query with the values and ID
    const result = await connection.query(sql, [...values, id]);

    // Return the result of the update query
    return result;
}

/**
 * Deletes a Variantmodel  from the database based on its ID.
 * @param {number} id - The ID of the Variantmodel  to delete.
 * @returns {Promise} A promise that resolves to the result of the deletion operation.
 */
exports.deleteVariantQuery = async (id) => {
    // Construct the SQL query to delete the Variantmodel 
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;

    // Log the generated SQL query
    logger.info(`DB Query : Delete Variant Sql : ${sql}`);

    // Execute the SQL query with the provided ID parameter
    const result = await connection.query(sql, [id]);

    // Return the result of the deletion operation
    return result;
}
