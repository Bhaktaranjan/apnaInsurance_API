const connection = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'user';

/**
 * Finds a user based on the provided parameters.
 * @param {object} params - The parameters used to search for the user.
 * @returns {object} - The found user.
 */
exports.findOneUserQuery = async (params) => {
    // Generate column set and values for the query
    const { columnSet, values } = multipleColumnSet(params);

    // Generate the SQL query
    const sql = `SELECT * FROM ${tableName}
    WHERE ${columnSet}`;

    // Log the DB query
    logger.info(` DB Query : Get User Sql : ${sql}`);

    // Execute the query and get the result
    const result = await connection.query(sql, [...values]);

    // Return the first row (user)
    return result[0];
};

/**
 * Creates a user query and inserts it into the database.
 *
 * @param {Object} userData - The user data.
 * @param {string} userData.Name - The name of the user.
 * @param {string} userData.Email - The email of the user.
 * @param {string} userData.UserName - The username of the user.
 * @param {string} userData.Password - The password of the user.
 * @param {string} userData.PhoneNo - The phone number of the user.
 * @param {string} userData.Role - The role of the user.
 * @returns {number} - The number of affected rows.
 */
exports.createUserQuery = async (userData) => {
    const {
        Name,
        Email,
        UserName,
        Password,
        PhoneNo,
        Role,
    } = userData;

    const sql = `
        INSERT INTO ${tableName}
        (Name, Email, UserName, Password, PhoneNo, Role)
        VALUES
        (?,?,?,?,?,?)
    `;

    logger.info(`DB Query: Create User SQL: ${sql}`);

    const result = await connection.query(sql, [
        Name,
        Email,
        UserName,
        Password,
        PhoneNo,
        Role,
    ]);

    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
};

/**
 * Update the password for a specific user in the database.
 * @param {object} params - The parameters for updating the password.
 * @param {string} params.password - The new password.
 * @param {string} params.salt - The salt used for hashing the password.
 * @param {number} id - The ID of the user whose password is being updated.
 * @returns {Promise<object>} - The result of the update query.
 */
exports.updatePasswordQuery = async (params, id) => {
    // Generate the column set and corresponding values for the update query
    const { columnSet, values } = multipleColumnSet(params);

    // Construct the SQL query
    const sql = `UPDATE ${tableName} SET ${columnSet} WHERE id = ?`;

    // Log the update password SQL query
    logger.info(`DB Query : Update Password Sql : ${sql}`);

    // Execute the update query
    const result = await connection.query(sql, [...values, id]);
    return result;
};
