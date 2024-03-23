// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities/index')
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


  //account
router.get(
  "/",
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccount))

router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

//logging out
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

//update account 
router.get("/edit/:account_id", accountController.accountBuildEditView);
router.post("/update", accountController.accountUpdate);

module.exports = router;