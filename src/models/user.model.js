const connection = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'user';

exports.findOneUserQuery = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);
    console.log(params);
    const sql = `SELECT * FROM ${tableName}
    WHERE ${columnSet}`;
    logger.info(` DB Query : Get User Sql : ${sql}`);

    const result = await connection.query(sql, [...values]);

    // return back the first row (user)
    return result[0];
};

exports.createUserQuery = async ({
    Name,
    Email,
    UserName,
    Password,
    PhoneNo,
    Role,
}) => {
    const sql = `INSERT INTO ${tableName} (Name, Email, UserName, Password,PhoneNo, Role) VALUES (?,?,?,?,?,?)`;
    logger.info(` DB Query : Create User Sql : ${sql}`);

    const result = await connection.query(sql, [Name, Email, UserName, Password, PhoneNo, Role]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
};