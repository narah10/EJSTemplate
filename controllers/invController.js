const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory view
 * ************************** */
invCont.buildInvView = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build Management Classfication View
 * ************************** */
invCont.buildAddClassView = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process Classification Name
 * ************************** */

invCont.registerClassification = async function(req, res) {
  const { classification_name } = req.body
  const classificationResult = await invModel.registerClassification(
    classification_name
    )
  if (classificationResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you\'ve registered ${classification_name}.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Build Add Inventory View
 * ************************** */
invCont.buildAddInvView = async function(req, res, next){
  let nav = await utilities.getNav()
  let dropdown = await utilities.buildClassificationDropDown()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    dropdown,
    errors: null,
  })
}

/* ***************************
 *  Register Add Inventory Process
 * ************************** */

invCont.registerInventory = async function(req, res) {
  console.log('runnning controller')
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  console.log(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
  const inventoryResult = await invModel.registerInventory(
    classification_id, 
    inv_make, inv_model, 
    inv_description, 
    inv_image, 
    inv_thumbnail,  
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color
    )
  if (inventoryResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you\'ve registered to the Inventory.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    let dropdown = await utilities.buildClassificationDropDown()
    let nav = await utilities.getNav()
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      dropdown,
      errors: null,
    })
  }
}



/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory by inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.invId 
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  console.log(data)
  const grid = await utilities.buildInventoryGrid(data)
  let nav = await utilities.getNav()
  const className = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/inventoryDetails", { 
    title: className,
    nav,
    grid,
    errors: null,
  })
}

module.exports = invCont
