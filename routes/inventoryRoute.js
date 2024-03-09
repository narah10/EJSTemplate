// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities/index')

// Route to build inventory by classification view
router.get("/", invController.buildInvView)
router.get("/add-classification", invController.buildAddClassView)
//Process the added classification name
router.post("/send-classification", invController.registerClassification)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

module.exports = router;