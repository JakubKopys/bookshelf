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
      var errors = result.mapped();
      var err_msg = {
        username: true,
        password: true,
        email: true
      };

      if (('username' in req.body) && !('username' in errors)) {
        user.update({username: req.body.username}, (err, user) => {
          if (err) return res.status(500).json({
            success: false,
            message: 'Server error. username'
          });
        });
      }

      if (('email' in req.body) && !('email' in errors)) {
        // user.update({email: req.body.email}, (err, user) => {
        //   // TODO: add email: error to errors array instead of that
        //   if (err) {
        //     // 11000 is mongodb code for unique constarint validation
        //     if (true) {
        //       errors["email"] = {
        //         "param": "email",
        //         "msg": "inv email",
        //         "value": req.body.email
        //       }
        //     }
        //     console.log(errors);
        //
        //   }
        // });
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
            console.log(errors);
          }
        });
      }
      console.log("errs: " + Object.keys(errors));

      if (('password' in req.body) && !('password' in errors)) {
        user.setPassword(req.body.password, (err) => {
          if (err) return res.status(500).json({
            success: false,
            message: 'Server error. password'
          });
        });
      }
      return res.send(errors.email);
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
      //res.json(Object.values(err_msg).includes(false));
    });

    // if ('username' in req.body) {
    //   req.checkBody('username', 'Invalid username').isLength({min:2, max: 50});
    //   req.getValidationResult().then(result => {
    //     if (result.isEmpty()) {
    //       user.update({username: req.body.username}, (err, user) => {
    //         if (err) return res.status(500).json({
    //           success: false,
    //           message: 'Server error.'
    //         });
    //       });
    //     } else {
    //       return res.status(422).json({
    //         succes: false,
    //         message: 'Invalid username.'
    //       });
    //     }
    //   });
    // }
    // if ('email' in req.body) {
    //   req.checkBody('email', 'Invalid email').isEmail();
    //   req.getValidationResult().then(result => {
    //     if (result.isEmpty()) {
    //       user.update({email: req.body.email}, (err, user) => {
    //         if (err) return res.status(500).json({
    //           success: false,
    //           message: 'Server error.'
    //         });
    //       });
    //     } else {
    //       return res.status(422).json({
    //         succes: false,
    //         message: 'Invalid email.'
    //       });
    //     }
    //   });
    // }
    // if ('password' in req.body) {
    //   req.checkBody('password', 'Invalid password').isLength({min:6, max: 50});
    //   req.getValidationResult().then(result => {
    //     if (result.isEmpty()) {
    //       user.setPassword(req.body.password, (err) => {
    //         if (err) return res.status(500).json({
    //           success: false,
    //           message: 'Server error.'
    //         });
    //       });
    //     } else {
    //       return res.status(422).json({
    //         succes: false,
    //         message: 'Invalid email.'
    //       });
    //     }
    //   });
    // }
    //res.json({success: true});
  });
}
