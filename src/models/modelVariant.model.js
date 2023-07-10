const connection = require('../db/db-connection');
const { multipleColumnSet, multipleColumnSetQueryParams } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'model_variant';

exports.getAllModelVariantsQuery = async (params = {}) => {
    console.log(Object.keys(params).length);
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
        // console.log('columnSetQueryParams', columnSetQueryParams);
        // Append the filter condition to the SQL query
        sql += ` WHERE ${columnSetQueryParams}`;

        // Execute the query with the filter parameters and return the result
        return await connection.query(sql, [...values]);
    }
}

exports.createModelVariantQuery = async ({ VehicleModelId, ManufaturerId, Name }) => {
    // Create the SQL query
    console.log('VehicleModelId, ManufaturerId, Name ', VehicleModelId, ManufaturerId, Name);
    const sql = `INSERT INTO ${tableName} (VehicleModelId, ManufaturerId, Name ) VALUES (?,?,?)`;

    // Log the SQL query
    logger.info(` DB Query : Create ModelVariant Sql : ${sql}`);

    // Execute the SQL query and get the result
    const result = await connection.query(sql, [VehicleModelId, ManufaturerId, Name]);
    return result;
}

exports.updateModelVariantQuery = async (params, id) => {
    // console.log(params);
    // console.log(id);
    const { columnSet, values } = multipleColumnSet(params);
    const sql = `UPDATE ${tableName} SET ${columnSet} WHERE id = ?`;

    logger.info(`DB Query : Update ModelVariant Sql : ${sql}`);

    const result = await connection.query(sql, [...values, id]);

    return result;
}

exports.deleteModelVariantQuery = async (id) => {
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;

    logger.info(`DB Query : Delete ModelVariant Sql : ${sql}`);

    const result = await connection.query(sql, [id]);

    return result;
}