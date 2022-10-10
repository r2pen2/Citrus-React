const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const infoRoutes = require('./server/infoRoutes.js');
// Init express application
const app = express();

// Init env files
dotenv.config();

// Start listening on defined port
app.listen(process.env.PORT || 3000, () => {
    console.log('Now listening on port ' + process.env.PORT || 3001);
});

// BodyParser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname + "/server/static/"));
app.use("/info", infoRoutes);

// Serve React build
app.use(express.static(__dirname + "/client/build"));
// Serve react app
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/client/build/index.html");
});
