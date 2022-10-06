const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

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
app.get("/credits", (req, res) => {
    res.sendFile(__dirname + "/server/static/credits.html");
})
app.get("/features", (req, res) => {
    res.sendFile(__dirname + "/server/static/pageUnderConstruction.html");
})
app.get("/apps", (req, res) => {
    res.sendFile(__dirname + "/server/static/pageUnderConstruction.html");
})
app.get("/pricing", (req, res) => {
    res.sendFile(__dirname + "/server/static/pageUnderConstruction.html");
})
app.get("/faq", (req, res) => {
    res.sendFile(__dirname + "/server/static/pageUnderConstruction.html");
})
app.get("/billing", (req, res) => {
    res.sendFile(__dirname + "/server/static/pageUnderConstruction.html");
})
app.get("/roadmap", (req, res) => {
    res.sendFile(__dirname + "/server/static/pageUnderConstruction.html");
})
app.get("/blog", (req, res) => {
    res.sendFile(__dirname + "/server/static/pageUnderConstruction.html");
})
app.get("/support", (req, res) => {
    res.sendFile(__dirname + "/server/static/pageUnderConstruction.html");
})
app.get("/status", (req, res) => {
    res.sendFile(__dirname + "/server/static/pageUnderConstruction.html");
})
app.get("/privacy", (req, res) => {
    res.sendFile(__dirname + "/server/static/pageUnderConstruction.html");
})
app.get("/terms", (req, res) => {
    res.sendFile(__dirname + "/server/static/pageUnderConstruction.html");
})
app.get("/eula", (req, res) => {
    res.sendFile(__dirname + "/server/static/pageUnderConstruction.html");
})

// Serve React build
app.use(express.static(__dirname + "/client/build"));
// Serve react app
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/client/build/index.html");
});
