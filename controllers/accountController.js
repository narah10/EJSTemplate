const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const baseController = {}
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

async function buildRegister(req, res, next) {
let nav = await utilities.getNav()
res.render("account/register", {
    title: "Registration",
    nav,
    errors: null,
})
}
  
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  }


  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }


 /* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process LOGOUT request
* ************************************ */
async function accountLogout(req, res) {
  try {
    res.clearCookie("jwt");
    req.flash("notice", "You have succesfully logged out");
    return res.redirect('/');
  } catch (error) {
    console.error('Logout Error:', error);
    req.flash('error', 'An error occurred during logout. Please try again.');
    return res.redirect('/');
  }
}

/* ***************************
 *  Build edit Account view
 * ************************** */
async function accountBuildEditView (req, res, next) {
  let nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);
  const accountData = await accountModel.getAccountById(account_id);
  try {
    res.render("account/edit-account", {
        title: "Edit Account Info",
        nav,
        errors: null,
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
    })
  } catch (error) {
    error.status = 500;
    console.error(error.status);
    next(error);
  }
}

/* ***************************
 *  Edit Account
 * ************************** */
async function accountUpdate (req, res, next) {
  let nav = await utilities.getNav();
    const { 
      account_id,
      account_firstname,
      account_lastname,
      account_email
    } = req.body
    console.log(`**********************updaDateAccountControllerAccountId${account_id}`)
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )
    console.log(`**********************updaDateAccountController${updateResult}`)
    if (updateResult) {
      const accountData = await accountModel.getAccountById(account_id);
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      req.flash("notice", "The account was successfully updated.");
      res.redirect("/account/");
    } else {
      req.flash("notice", "Sorry, the account was not successfully updated.");
      res.status(501).render("./account/edit-account", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  }

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, accountLogout, accountBuildEditView, accountUpdate }