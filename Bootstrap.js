var express         = require('express'),
    exphbs          = require('express-handlebars'),
    methodOverride  = require('method-override'),
    morgan          = require('morgan'),
    formidable      = require('formidable'),
    mongoose        = require('mongoose'),
    jwt             = require('jsonwebtoken'),
    expressJWT      = require('express-jwt'),
    credentials     = require('./credentials.js'),
    validator       = require('express-validator'),
    expressSession  = require('express-session'),
    util            = require('util'),
    User            = require('./models/User.js'),
    Book            = require('./models/Book.js'),
    Author          = require('./models/Author.js')
    auth            = require('./lib/auth.js');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');

class Bootstrap {

  constructor() {
    //initialize express app
    this.app = express();
    this.app.set('port', process.env.PORT || 3000);
    this.app.set('jwtSecret', credentials.jwt.secret);
  }

  misc() {
    // set up logging
    this.app.use(morgan('dev'));

    // forms set up - middleware to pare URL-encoded body
    // enables app to use req.body
    this.app.use(require('body-parser').urlencoded({ extended: true }));
    this.app.use(require('body-parser').json());
    this.app.use(validator());

    // DELETE method - override with POST having ?_method=DELETE
    this.app.use(methodOverride('_method'));

    // set up static content middleware
    this.app.use(express.static(__dirname + '/public'));

    // passport setup
    this.app.use(cookieParser());
    this.app.use(expressSession({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
    }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Passport config
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
  }

  database() {
    // set up connection to the mongodb using mongoose
    var options = {
      user: credentials.mongo.dev.user,
      pass: credentials.mongo.dev.pass
    }
    mongoose.connect(credentials.mongo.dev.url, options);
    mongoose.Promise = require('bluebird');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("connected to mongodb");
    });
  }

  routes() {
    // set up routes

    this.app.use('/books',    require('./routes/books.js'));
    this.app.use('/authors',  require('./routes/authors.js'));
    this.app.use('/users',    require('./routes/users.js'));

    //TODO: routes to list books with its authors, and authors with theirs books

    // 404 catch-all handler (middleware)
    this.app.use((req, res, next) => {
    	res.status(404);
    	res.json({
        message: 'Not found.'
      });
    });

    // 500 error handler (middleware)
    this.app.use((err, req, res, next) => {
    	console.error(err.stack);
    	res.status(500);
    	res.json({
        message: 'Server error.'
      });
    });
  }

  run() {
    this.misc();
    this.database();
    this.routes();
    return this.app;
  }
}

module.exports = new Bootstrap();
