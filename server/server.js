const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const login = require('./routes/login');
const database = require('./routes/database');

const app = express();
const router = express.Router();
app.use(cors())

// Define routes
app.use("/login", login)
app.use("/database", database)

app.listen(3001)