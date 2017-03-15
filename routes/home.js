var homeController  = require('../controllers/homeController.js');
var router          = require('express').Router();

router.get('/', homeController.index);

module.exports = router;
