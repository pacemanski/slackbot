var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/carolo', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;


// const carolo = require('./routes/backend')
// app.use('/router',carolo)

