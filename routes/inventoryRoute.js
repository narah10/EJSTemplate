// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities/index')
const managementValidate = require("../utilities/management-validation")

// Route to build inventory by classification view
router.get("/", utilities.handleErrors(invController.buildInvView))
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassView))
//Process the added classification name
router.post("/add-classification", 
managementValidate.registerClassificationRules(),
managementValidate.checkClassificationData,
utilities.handleErrors(invController.registerClassification))

//Route to build add-inventory view
router.get("/add-inventory", invController.buildAddInvView)

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

module.exports = router;