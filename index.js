const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');
const logger = require('./src/middleware/logger')

const userRouter = require('./src/routes/user.route');
const enquiryRouter = require('./src/routes/enquiry.route');
const manufacturerRouter = require('./src/routes/manufacturer.route');
const modelVariantRouter = require('./src/routes/model.route');
const vehicleModelRouter = require('./src/routes/vehicle.route');
const fuelTypeRouter = require('./src/routes/fuelType.route');

// Init express
const app = express();

// Init environment

dotenv.config();
// require('dotenv').config({ debug: true })

// parse requests of content-type: application/json
// parses incoming requests with JSON payloads

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// enabling cors for all requests by using cors middleware

app.use(cors());

// Enable pre-flight

app.options('*', cors());

const PORT = Number(process.env.PORT || 3939);
const PORTSSL = Number(process.env.PORTSSL || 3939);
logger.info(`Port number : ${PORT}`);


app.use(`/userapi`, userRouter);
app.use(`/enquiryapi`, enquiryRouter);
app.use(`/manufacturerapi`, manufacturerRouter);
app.use(`/makeapi`, modelVariantRouter);
app.use(`/vehicleapi`, vehicleModelRouter);
app.use(`/fuelTypeapi`, fuelTypeRouter);

app.get('/', function (req, res) {
    res.send(`Automaton App listening on port ${PORT}`);
});

//SSL Server Setting
https
    .createServer({
        key: fs.readFileSync(path.resolve('dist/ssl/server.key')),
        cert: fs.readFileSync(path.resolve('dist/ssl/server.crt')),
        passphrase: 'changeit',
    },
        app
    )
    .listen(PORTSSL, function () {
        logger.success(`Automaton SSL app listening on port ${PORTSSL}`);
    })

app.listen(PORT, function () {
    logger.success(
        `Automaton started on port ${PORT}`
    );
});

module.exports = app;