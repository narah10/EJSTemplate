const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"/></a>'
      grid += '<div class="namePrice">'
      grid += '<hr/>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory view HTML
* ************************************ */
Util.buildInventoryGrid = async function(data){
  let grid = ''
  let vehicle = data
  grid += '<div id="vehicle-details">'
  grid += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors"/>`
  grid += '<div>'
  grid += `<h3>${vehicle.inv_make} ${vehicle.inv_model} Details</h3>`
  grid += `<p class="background"><span>Price</span>: <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span></p>`;
  grid += `<p><span>Description</span>: ${vehicle.inv_description}</p>`
  grid += `<p class="background"><span>Color</span>: ${vehicle.inv_color}</p>`
  grid += `<p><span>Miles</span>: ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>`
  grid += '</div>'
  grid += '</div>'
  return grid
}


/* **************************************
* Build the classification drop down
* ************************************ */
Util.buildClassificationDropDown = async function(classification_id = null){
  let data = await invModel.getClassifications()
  let dropdown = '<select name="classification_id" id="classificationList">'
  dropdown += "<option>Choose a Classification</option>"
  data.rows.forEach((row) => {
    dropdown += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      dropdown += " selected "
    }
    dropdown += ">" + row.classification_name + "</option>"
  })
  dropdown += "</select>"
  return dropdown
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.handleIntentionalErrors = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(err => {
    next({ status: 500, message: err.message });
});

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Check Account Type
 * ************************************ */
 Util.checkLoginAccountType = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        // if (err) {
        //   req.flash("notice", "Please log in");
        //   return res.redirect("/account/login");
        // }
        if (accountData && (accountData.account_type === "Employee" || accountData.account_type === "Admin")) {
          res.locals.accountData = accountData;
          res.locals.loggedin = 1;
          return next();
        } else {
          req.flash("notice", "This must NOT be used when delivering the classification or detail views as they are meant for site visitors who may not be logged in.");
          return res.redirect("/account/login");
        }
      }
    );
  } 
};


module.exports = Util