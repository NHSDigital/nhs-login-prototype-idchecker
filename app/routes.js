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

router.post("/", function (req, res) {

  let prototype = {} || req.session.data['prototype']

  // pull in JSON data file
  delete req.session.data['idv']
  let idvFile = 'verification-requests.json'
  let path = 'app/data/'
  req.session.data['idv'] = loadJSONFromFile(idvFile, path)

  prototype.version = req.session.data.version
  prototype.total = req.session.data['idv'].length
  prototype.inprogress = 0
  prototype.inholding = 0
  prototype.count = 0

  req.session.data['prototype'] = prototype

  res.redirect('/' + prototype.version + '/dashboard')

})


router.post('/*/dashboard', function (req, res) {
  let prototype = req.session.data['prototype']
  prototype.thePage = 'idcheck'
  prototype.count = req.session.data.user -1
  req.session.data['prototype'] = prototype
  res.redirect('id-checker-review')
})


router.post("/*/reject", function (req, res) {
  let prototype = req.session.data['prototype']
  prototype.count = prototype.count +1
  prototype.thePage = 'dashboard'
  prototype.inprogress = 0
  req.session.data['prototype'] = prototype
  res.redirect('dashboard')
})

router.post("/*/accept", function (req, res) {
  let prototype = req.session.data['prototype']
  prototype.count = prototype.count +1
  prototype.thePage = 'dashboard'
  prototype.inprogress = 0
  req.session.data['prototype'] = prototype
  res.redirect('dashboard')
})

router.post("/*/holding", function (req, res) {
  let prototype = req.session.data['prototype']
  prototype.count = prototype.count +1
  prototype.thePage = 'dashboard'
  prototype.inprogress = 0
  prototype.inholding = 1
  req.session.data['prototype'] = prototype
  res.redirect('dashboard')
})

router.post("/*/abort", function (req, res) {
  let prototype = req.session.data['prototype']
  prototype.thePage = 'dashboard'
  prototype.inprogress = 0
  req.session.data['prototype'] = prototype
  res.redirect('dashboard')
})

router.post("/*/abort-from-dash", function (req, res) {
  let prototype = req.session.data['prototype']
  prototype.thePage = 'dashboard'
  prototype.count = prototype.count -1
  prototype.inprogress = 0
  req.session.data['prototype'] = prototype
  res.redirect('dashboard')
})

router.post("/*/return", function (req, res) {
  let prototype = req.session.data['prototype']
  prototype.inprogress = 1
  prototype.count = prototype.count +1
  prototype.thePage = 'dashboard'
  req.session.data['prototype'] = prototype
  res.redirect('dashboard')
})

router.post("/*/continue", function (req, res) {
  let prototype = req.session.data['prototype']
  prototype.thePage = 'idcheck'
  prototype.count = prototype.count -1
  prototype.inprogress = 0
  req.session.data['prototype'] = prototype
  res.redirect('id-checker-review')
})



// Dev Mode

function devModeRoute(req, res, next) {
  if (!req.session.data['devMode']) {
    // console.log('no data found');
    var devMode = req.query.devMode;
    if (devMode === 'true') {
      // console.log('devmode detected');
      req.session.data['devMode'] = 'true'
      // console.log('local storage updated');
    } else {
      // console.log('devmode not detected');
    }
  } else {
    // console.log('data found and set to ' +  req.session.data['devMode'] )
  }
  next()
}

router.get("/*", devModeRoute);
router.get("/", devModeRoute);


module.exports = router;
