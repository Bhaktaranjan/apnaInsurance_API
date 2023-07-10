const connection = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'fueltype';

exports.getAllFuelTypesQuery = async (params = {}) => {
    console.log(Object.keys(params).length);
    // Construct the base SQL query
    let sql = `SELECT * FROM ${tableName}`;
    logger.info(`DB Query: Get AllFuelTypes Sql: ${sql}`);

    // Check if there are any additional filter parameters
    if (Object.keys(params).length <= 0) {
        // If not, execute the query and return the result
        return await connection.query(sql);
    } else {

        // Generate the column set and values for the filter parameters
        const { columnSet, values } = multipleColumnSet(params);
        console.log('columnSet', columnSet);
        // Append the filter condition to the SQL query
        sql += ` WHERE ${columnSet}`;
        console.log('sql', sql);
        // Execute the query with the filter parameters and return the result
        return await connection.query(sql, [...values]);
    }
}

exports.createFuelTypeQuery = async ({ FuelType }) => {

    // Construct the SQL query

    const sql = `INSERT INTO ${tableName} (FuelType) VALUES (?)`;

    // Execute the query and get the result
    const result = await connection.query(sql, [FuelType]);

    return result;
}

exports.updateFuelTypeQuery = async (params, id) => {
    // console.log(params);
    // console.log(id);
    const { columnSet, values } = multipleColumnSet(params);
    const sql = `UPDATE ${tableName} SET ${columnSet} WHERE id = ?`;

    logger.info(`DB Query : Update FuelType Sql : ${sql}`);

    const result = await connection.query(sql, [...values, id]);

    return result;
}

exports.deleteFuelTypeQuery = async (id) => {
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;

    logger.info(`DB Query : Delete FuelType Sql : ${sql}`);

    const result = await connection.query(sql, [id]);

    return result;
}