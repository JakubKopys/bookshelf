var User  = require('../models/User.js');
var passport = require('passport');

class UserController {
  index(req, res) {
    res.render('users/index');
  }
  login(req, res) {
    res.render('users/login');
  }
  loginUser(req, res, next) {
    res.redirect(302, '/users');
  }
  register(req, res, next) {
    res.render('users/register');
  }
  registerUser(req, res, next) {
    User.register(new User({username: req.body.username}), req.body.password,
    (err, user) => {
      if (err) return next(err);
      passport.authenticate('local')(req, res, () => {
          res.redirect(302, '/users');
      });
    });
  }
  logout(req, res, next) {
    req.logout();
    res.redirect('/');
  }
}

module.exports = new UserController();
