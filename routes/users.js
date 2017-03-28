var UsersController = require('../controllers/UsersController.js'),
    router          = require('express').Router(),
    passport        = require('passport');

router.get('/', UsersController.index);
router.get('/login', UsersController.login);
router.post('/login', passport.authenticate('local'), UsersController.loginUser);
router.get('/logout', UsersController.logout);
router.get('/register', UsersController.register);
router.post('/register', UsersController.registerUser);

module.exports = router;
