var HomeController  = require('../controllers/HomeController.js');
var router          = require('express').Router();

router.get('/', HomeController.index);

module.exports = router;
