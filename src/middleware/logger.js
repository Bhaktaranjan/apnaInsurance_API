const moment = require('moment');

const logger = {
    success: (log, data) => console.log(moment().format('YYYY-MM-DD HH:mm:ss'), '- Success - ', log),
    info: (log, data = '') => console.log(moment().format('YYYY-MM-DD HH:mm:ss'), '- Info - ', log, data),
    error: (log) => console.log(moment().format('YYYY-MM-DD HH:mm:ss'), '- Error - ', log),
    warning: (log) => console.log(moment().format('YYYY-MM-DD HH:mm:ss'), '- Warning - ', log),
};

module.exports = logger;