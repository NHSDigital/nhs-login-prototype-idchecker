// External dependencies
const express = require('express');
const router = express.Router();
const fs = require("fs-extra")


// Load JSON data from file ----------------------------------------------------

// fileName excludes path but includes extension e.g. file.json
function loadJSONFromFile(fileName, path = "app/data/") {
  let jsonFile = fs.readFileSync(path + fileName)
  return JSON.parse(jsonFile) // Return JSON as object
}

// Add your routes here - above the module.exports line

// Documentation router
router.get('/', function(req , res){
  res.render('index')
});

router.post("/", function (req, res) {

  let prototype = {} || req.session.data.prototype
  let startPage = 'signin'

  let prototypeData = req.session.data.version

    console.log(prototypeData)

    prototype.release = prototypeData

    if (prototype.release == 'A') {
      startPage = 'dashboard'
    } else if (prototype.release == 'B') {
      startPage = 'dashboard2'
    }

    var redirect = '/' + startPage

    req.session.data.prototype = prototype
    delete req.session.data.version

  res.redirect(redirect)

})

// pull in the test data when on the dashboard
router.get('/dashboard', function (req, res) {
  let page = "dashboard"
  if (!req.session.data.idv) {
    let idvFile = 'verification-requests.json'
    let path = 'app/data/'
    req.session.data.idv = loadJSONFromFile(idvFile, path)
  }
  req.session.data.idv_total = req.session.data.idv.length
  res.render('dashboard');
})

router.post("/dashboard", function (req, res) {

  let prototype = {} || req.session.data.prototype

  console.log('yikes')
  //
  let userData = req.session.data.user
  prototype.user = userData
  //
  console.log('user number: ' + prototype.user)

  req.session.data.prototype = prototype

  res.redirect('id-checker-review')

})

module.exports = router;

// Dev Mode

function devModeRoute(req, res, next) {
  if (!req.session.data['devMode']) {
    console.log('no data found');
    var devMode = req.query.devMode;
    if (devMode === 'true') {
      console.log('devmode detected');
      req.session.data['devMode'] = 'true'
      console.log('local storage updated');
    } else {
      console.log('devmode not detected');
    }
  } else {
    console.log('data found and set to ' +  req.session.data['devMode'] )
  }
  next()
}

router.get("/*", devModeRoute);
router.get("/", devModeRoute);
