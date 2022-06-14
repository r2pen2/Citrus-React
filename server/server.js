const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const login = require('./routes/login');
const database = require('./routes/database');
const static = require('./routes/static');

const app = express();
const router = express.Router();
app.use(cors())

// Define routes
app.use("/login", login)
app.use("/database", database)
app.use("/static", static)

app.listen(3001)