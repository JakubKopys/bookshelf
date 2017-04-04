var User  = require('../models/User.js');
var passport = require('passport');
var util = require('util');
var jwt = require('jsonwebtoken');
var app = require('../app.js');

class UserController {
  index(req, res) {
    User.find((err, users) => {
      if (err) return next(err);
      res.json(users);
    });
  }
  loginUser(req, res, next) {
    var user = req.user;
    //if user is found and password matches create a token
    var token = jwt.sign({
      user: user._id
    }, app.get('jwtSecret'), {
      expiresIn: '1440m' // expires in 24 hours.
    });
    // return the information including token as json
    res.json({
      success: true,
      token: token
    });
  }
  registerUser(req, res, next) {
    req.checkBody('username', 'Invalid username').isLength({min:2, max: 50});
    req.checkBody('password', 'Invalid password').isLength({min:2, max: 50});
    req.checkBody('email', 'Invalid email').isEmail();

    req.getValidationResult().then(result => {
      if (result.isEmpty()) {
        User.register(new User({
          username: req.body.username,
          email: req.body.email
        }), req.body.password, (err, user) => {
          if (err) {
            console.log(err);
            // return next(err);

            // 11000 is mongodb code for unique constarint validation
            if (err.code && err.code === 11000) {
              return res.status(409).send({
                success: false,
                message: 'This email is already taken.'
              });
            }
            // REST API ERROR
            return res.status(409).send({
              success: false,
              message: err.message
            });
          }
          res.json({
            success: true,
            message: 'User successfully registered.',
          });
        });
      } else {
        req.session.errors = result.array();

        res.status(422).send({
          succes: false,
          errors: result.array(),
          message: 'Invalid user data.'
        });
      }
    });
  }
  update(req, res, next) {
    if (Object.keys(req.body).length === 0)
      return res.json({
        msg: "No changeset provided."
      });

    User.findOne({_id: req.params.id}, (err, user) => {
      if (err) return res.status(500).json({
        success: false,
        message: 'Server error.'
      });

      if (!user) return res.status(404).json({
        success: false,
        message: 'User with given id not found.'
      });

      if ('username' in req.body)
        req.checkBody('username', 'Invalid username').isLength({min:2, max: 50});
      if ('password' in req.body)
        req.checkBody('password', 'Invalid password').isLength({min:2, max: 50});
      if ('email' in req.body)
        req.checkBody('email', 'Invalid email').isEmail();

      req.getValidationResult().then( result => {
        var promises = [];


        var errors = result.mapped();
        var err_msg = {
          username: true,
          password: true,
          email: true
        };

        if (('username' in req.body) && !('username' in errors)) {
          promises.push()
        }

        if (('email' in req.body) && !('email' in errors)) {
          user.update({email: req.body.email}).exec((err, user) => {
            // TODO: add email: error to errors array instead of that
            if (err) {
              // 11000 is mongodb code for unique constarint validation
              if (true) {
                errors["email"] = {
                  "param": "email",
                  "msg": "inv email",
                  "value": req.body.email
                }
              }
            }
          });
        }

        if (('password' in req.body) && !('password' in errors)) {
          user.setPassword(req.body.password, (err) => {
            if (err) return res.status(500).json({
              success: false,
              message: 'Server error. password'
            });
          });
        }

        if (Object.keys(errors).length > 0) {
          res.json({
            success: false,
            errors: errors,
          });
        } else {
          res.json({
            success: true,
            msg: "successfully updated user."
          });
        }
      });

    });
  }
  logout(req, res, next) {
    req.logout();
    res.redirect('/');
  }
}

module.exports = new UserController();
