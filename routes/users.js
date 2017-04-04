var UsersController = require('../controllers/UsersController.js'),
    router          = require('express').Router(),
    passport        = require('passport'),
    auth            = require('../lib/auth.js');

router.post('/login', passport.authenticate('local'), UsersController.loginUser);
router.post('/register', UsersController.registerUser);
router.post('/:id', UsersController.update);

router.use(auth.verify);
router.get('/', UsersController.index);
router.get('/logout', UsersController.logout);

module.exports = router;
