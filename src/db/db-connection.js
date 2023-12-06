const dotenv = require('dotenv');
dotenv.config();
const mysql2 = require('mysql2');
const logger = require('../middleware/logger');
// const HttpException = require('../utils/HttpException.utils');

const conn = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
})

conn.getConnection(error => {
    if (error) throw error;
    logger.success("Database connection established successfully.")
});

exports.query = async (sql, values) => {
    return new Promise((resolve, reject) => {
        const callback = (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        };
        // execute will internally call prepare and query
        conn.execute(sql, values, callback);
    }).catch((err) => {
        const mysqlErrorList = Object.keys(HttpStatusCodes);
        // convert mysql errors which in the mysqlErrorList list to http status code
        err.status = mysqlErrorList.includes(err.code) ?
            HttpStatusCodes[err.code] :
            err.status;

        throw err;
    });
};
// }

// like ENUM
const HttpStatusCodes = Object.freeze({
    ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
    ER_DUP_ENTRY: 409,
});

// module.exports = {checkConnection, query};