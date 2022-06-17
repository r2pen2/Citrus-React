// Library imports
const express = require('express');
const cors = require('cors');

// Route imports
const login = require('./routes/login');
const database = require('./routes/database');
const staticFiles = require('./routes/staticFiles');

// Define express server with CORS
const app = express();
app.use(cors())

// Define routes
app.use("/login", login.router)
app.use("/database", database.router)
app.use("/static", staticFiles.router)

// Start server on port 3001
app.listen(3001)