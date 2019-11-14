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
  res.render('index');
  console.log('hello')
});

// pull in the test dat when on the dashboard
router.get('/dashboard', function (req, res) {
  let page = "dashboard"
  console.log('Page: ' + page)

  if (!req.session.data.idv) {
    console.log('no session data')
    let idvFile = 'verification-requests.json'
    let path = 'app/data/'
    req.session.data.idv = loadJSONFromFile(idvFile, path)
  }

  req.session.data.idv_total = req.session.data.idv.length

  console.log(req.session.data.idv)

  res.render('dashboard');
})

module.exports = router;
