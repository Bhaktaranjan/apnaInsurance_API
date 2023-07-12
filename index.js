const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');


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

const port = Number(process.env.PORT || 3939);
console.log(`Port number : ${port}`);


app.use(`/userapi`, userRouter);
app.use(`/enquiryapi`, enquiryRouter);
app.use(`/manufacturerapi`, manufacturerRouter);
app.use(`/makeapi`, modelVariantRouter);
app.use(`/vehicleapi`, vehicleModelRouter);
app.use(`/fuelTypeapi`, fuelTypeRouter);

app.get('/', function (req, res) {
    res.send(`Apna Insurane listening on port ${port}`);
});

app.listen(port, function () {
    console.log(
        `Apna Insurane listening on port ${port}`
    );
});

module.exports = app;