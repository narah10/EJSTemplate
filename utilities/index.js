const invModel = require("../models/inventory-model")
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
* Build the classification view HTML
* ************************************ */
Util.buildInventoryGrid = async function(data){
  let grid = ''
  let vehicle = data[0]
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
Util.buildClassificationDropDown = async function(){
  let data = await invModel.getClassifications()
  let classificationOptions = '<select name="classification">' 
  classificationOptions+= '<option>Choose a Classification</option>'
  data.rows.forEach((row) => {
    classificationOptions +=
      `<option value="${row.classification_id}">${row.classification_name}</option>`;
  });
  classificationOptions+= '</select>'
  return classificationOptions;
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

module.exports = Util