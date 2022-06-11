const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const login = require('./routes/login');
const pg = require('./modules/database');

const app = express();
const router = express.Router();
app.use(cors())

// Define login route
app.use("/login", login)

app.post("/get-user-by-id", (req, res) => {
    console.log("Getting user: " + req.body.id)

    const testUser = {
        id: 1,
        firstName: "Joseph",
        lastName: "Dobbelaar",
        phoneNumber: "+17818799058",
        password: "password"
    }

    const jsonContent = JSON.stringify({
        id: testUser.id,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        phoneNumber: testUser.phoneNumber,
    })

    res.end(jsonContent);
})

pg.getAllUsers();

app.listen(3001)