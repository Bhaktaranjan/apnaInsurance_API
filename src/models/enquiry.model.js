const connection = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'enquires';

/**
 * Retrieves all enquiries from the database.
 * @param {object} params - Additional query parameters.
 * @returns {Promise<Array>} - A promise that resolves to an array of enquiries.
 */
exports.findAllEnquiriesQuery = async (params = {}) => {
    console.log('findAllEnquiriesQuery Params', params);
    // Construct the base SQL query
    let sql = `SELECT * FROM ${tableName} ORDER BY Id DESC`;

    // Log the query
    logger.info(` DB Query : Get AllEnquiries Sql : ${sql}`);

    // Check if additional query parameters were provided
    if (!Object.keys(params).length) {
        // If no parameters were provided, execute the query without any additional conditions
        return await connection.query(sql);
    }

    // Generate the column set and corresponding values for the WHERE clause
    const { columnSet, values } = multipleColumnSet(params);
    sql += ` LIMIT ${params.offset}`;
    logger.info(` DB Query : Get AllEnquiries Sql : ${sql}`);

    // Execute the query with the provided parameters
    return await connection.query(sql, [...values]);
}

/**
 * Creates an enquiry query and inserts the provided data into the database.
 *
 * @param {Object} data - The data to be inserted into the database.
 * @param {string} data.Name - The name of the person creating the enquiry.
 * @param {string} data.DOB - The date of birth of the person creating the enquiry.
 * @param {string} data.PermanentAddress - The permanent address of the person creating the enquiry.
 * @param {string} data.ContactNumber - The contact number of the person creating the enquiry.
 * @param {string} data.EmailId - The email ID of the person creating the enquiry.
 * @param {string} data.Vehicle - The vehicle details of the person creating the enquiry.
 * @param {string} data.MakeName - The make name of the vehicle.
 * @param {string} data.ModelName - The model name of the vehicle.
 * @param {string} data.DateOfRegistration - The date of registration of the vehicle.
 * @param {string} data.YearOfManufacture - The year of manufacture of the vehicle.
 * @param {string} data.RtoRegistered - The RTO registered details of the vehicle.
 * @param {string} data.RegistrationNumber - The registration number of the vehicle.
 * @param {string} data.EngineNumber - The engine number of the vehicle.
 * @param {string} data.ChasisNumber - The chasis number of the vehicle.
 * @param {string} data.CubicCapacity - The cubic capacity of the vehicle.
 * @param {string} data.SeatingCapacity - The seating capacity of the vehicle.
 * @param {string} data.FuelType - The fuel type of the vehicle.
 * @param {string} data.PolicyNumber - The policy number of the vehicle.
 * @param {string} data.NomineeName - The name of the nominee.
 * @param {string} data.NomineeAge - The age of the nominee.
 * @param {string} data.NomineeRelationship - The relationship of the nominee with the person creating the enquiry.
 * @returns {number} - The number of affected rows in the database.
 */
exports.createEnquiryQuery = async (data) => {
    const {
        FirstName,
        LastName,
        DOB,
        PermanentAddress1,
        PermanentAddress2,
        PermanentAddress3,
        ContactNumber,
        EmailId,
        Manufacturer,
        Vehicle,
        ModelName,
        DateOfRegistration,
        YearOfManufacture,
        RtoRegistered,
        RegistrationNumber,
        EngineNumber,
        ChasisNumber,
        CubicCapacity,
        SeatingCapacity,
        FuelType,
        PolicyNumber,
        NomineeName,
        NomineeAge,
        NomineeRelationship,
    } = data;

    // Create the SQL query
    const sql = `INSERT INTO ${tableName} (
    FirstName,
    LastName, 
    DOB,
    PermanentAddress1,
    PermanentAddress2,
    PermanentAddress3,
    ContactNumber,
    EmailId,
    Manufacturer,
    Vehicle,
    Model,
    DateOfRegistration,
    YearOfManufacture,
    RtoRegistered,
    RegistrationNumber,
    EngineNumber,
    ChasisNumber,
    CubicCapacity,
    SeatingCapacity,
    FuelType,
    PolicyNumber,
    NomineeName,
    NomineeAge,
    NomineeRelationship) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    // Log the DB query
    logger.info(`DB Query: Create Enquiry SQL: ${sql}`);

    // Execute the query
    const result = await connection.query(sql, [
        FirstName,
        LastName,
        DOB,
        PermanentAddress1,
        PermanentAddress2,
        PermanentAddress3,
        ContactNumber,
        EmailId,
        Manufacturer,
        Vehicle,
        ModelName,
        DateOfRegistration,
        YearOfManufacture,
        RtoRegistered,
        RegistrationNumber,
        EngineNumber,
        ChasisNumber,
        CubicCapacity,
        SeatingCapacity,
        FuelType,
        PolicyNumber,
        NomineeName,
        NomineeAge,
        NomineeRelationship,
    ]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
};

/**
 * Deletes an enquiry from the database.
 *
 * @param {number} id - The ID of the enquiry to delete.
 * @returns {Promise} A Promise that resolves with the result of the query.
 */
exports.deleteEnquiryQuery = async (id) => {
    // Construct the delete query
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;

    // Log the query
    logger.info(`DB Query : Delete Enquiry Sql : ${sql}`);

    // Execute the query and return the result
    return await connection.query(sql, [id]);
}
