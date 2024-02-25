const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');
const utilities = require("../utilities")

router.get('/trigger', utilities.handleIntentionalErrors(errorController.errorLink));

module.exports = router;