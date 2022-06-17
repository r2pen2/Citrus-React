// Library imports
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

// Set up router
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

module.exports = {
    router: router,
}