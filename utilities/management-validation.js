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

module.exports = validate