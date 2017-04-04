const credentials = require('../credentials.js');
const User        = require('../models/User.js');
const jwt         = require('jsonwebtoken');

exports.requireRole = (role) => {
  return (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) return res.status(402).json({
      success: false,
      message: 'No token provided.'
    });

    jwt.verify(token, credentials.jwt.secret, (err, decoded) => {
      if (err) return res.json({
        success: false,
        message: 'Failed to authenticate token.'
      });

      User.findById(decoded.user, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
        if (user.role === role) next();
        else return res.json({
          success: false,
          message: 'Action not allowed.'
        });
      });
    });
  }
}

exports.verify = (req, res, next) => {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    jwt.verify(token, credentials.jwt.secret, (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token return an error
    return res.status(403).send({
      succes: false,
      message: 'No token provided.'
    });
  }
}
