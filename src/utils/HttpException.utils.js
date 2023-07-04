const moment = require('moment');

class HttpException extends Error {
    constructor(status, message, data) {
        super(message);
        this.status = status;
        this.message = message;
        this.data = data;
        console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} Error: ${message}`);
    }
}

module.exports = HttpException;