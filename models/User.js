var mongoose              = require('mongoose'),
    Schema                = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    autoIncrement         = require('mongoose-auto-increment'),
    uniqueValidator       = require('mongoose-unique-validator');

var userSchema = Schema({
    username: {
      type: String,
      required: true,
      maxlength: 50,
      minlength: 2,
      unique: true
    },
    password: {
      type: String,
      maxlength: 255,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    }
});

userSchema.statics.promote = (username, role, cb) => {
  mongoose.model('User', userSchema).findOne({username: username}, (err, user) => {
    user.update({role: role}, (err) => {
      if (err) return console.log(err);
    })
  });
}

autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    startAt: 1
});
userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(uniqueValidator);



var User = mongoose.model('User', userSchema);

module.exports = User;
