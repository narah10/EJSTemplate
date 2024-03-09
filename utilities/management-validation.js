const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  Registration Classification Rules
 * ********************************* */
validate.registerClassificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .isLength({min: 1})
        .matches(/^[a-zA-Z]+$/)
        .withMessage("A valid classification name is required.")
        .custom(async (classification_name) => {
            const classificationExists = await invModel.checkClassifications(classification_name)
            if (classificationExists){
            throw new Error("Classification Name exists. Please register with a different classification Name")
            }
        }),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name
      })
      return
    }
    next()
  }

/* ******************************
 * Registration Inventory Rules
 * ***************************** */
validate.registerInventoryRules = () => {
  return [
    body("classification_id")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .withMessage("Please select a vehicle classification."),

    body("inv_make")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Add the vehicle make."),
    
  body("inv_model")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Add the vehicle model."),

  body("inv_description")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Add the vehicle description."),

  body("inv_image")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Add the vehicle image."),

  body("inv_thumbnail")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Add the vehicle thumbnail."),

  body("inv_price")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Add the vehicle price.")
  .isNumeric({ no_symbols: true })
  .withMessage("Vehicle Price has to be a Decimal or Digits"),

  body("inv_year")
  .trim()
  .isLength({ min: 4, max: 4 })
  .withMessage("The vehicle year needs to be a 4-digit year")
  .isInt({ min: 1900, max: new Date().getFullYear() })
  .withMessage("Invalid vehicle year"),

  body("inv_miles")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Add the vehicle miles.")
  .isNumeric({ no_symbols: true })
  .withMessage("The vehicle miles can only be digits"),

  body("inv_color")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Add the vehicle color."),
  ]
}

/* ******************************
 * Check inventory data and return errors or continue to registration
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classification_id, 
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color
    })
    return
  }
  next()
}


module.exports = validate