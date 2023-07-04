const connection = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const logger = require('../middleware/logger');

const tableName = 'enquires';

exports.findAllEnquiriesQuery = async (params = {}) => {
    let sql = `SELECT * FROM ${tableName} ORDER BY Id DESC`;
    logger.info(` DB Query : Get AllEnquiries Sql : ${sql}`);

    if (!Object.keys(params).length) {
        return await connection.query(sql);
    }

    const { columnSet, values } = multipleColumnSet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
}

exports.createEnquiryQuery = async ({
    Name,
    DOB,
    PermanentAddress,
    ContactNumber,
    EmailId,
    Vehicle,
    MakeName,
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
}) => {

    const sql = `INSERT INTO ${tableName} (
        Name, 
        DOB,
        PermanentAddress,
        ContactNumber,
        EmailId,
        Vehicle,
        MakeName,
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
        NomineeRelationship) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    logger.info(` DB Query : Create Enquiry Sql : ${sql}`);

    const result = await connection.query(sql,
        [
            Name,
            DOB,
            PermanentAddress,
            ContactNumber,
            EmailId,
            Vehicle,
            MakeName,
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
            NomineeRelationship
        ]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
};