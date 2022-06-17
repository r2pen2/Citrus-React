// Library imports
const express = require('express');
const cors = require('cors');

// Route imports
const login = require('./routes/login');
const database = require('./routes/database');
const static = require('./routes/static');

// Define express server with CORS
const app = express();
app.use(cors())

// Define routes
app.use("/login", login)
app.use("/database", database)
app.use("/static", static)

// Start server on port 3001
app.listen(3001)