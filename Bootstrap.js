var express         = require('express'),
    exphbs          = require('express-handlebars'),
    methodOverride  = require('method-override'),
    morgan          = require('morgan'),
    formidable      = require('formidable'),
    mongoose        = require('mongoose'),
    jwt             = require('jsonwebtoken'),
    credentials     = require('./credentials.js'),
    User            = require('./models/User.js');

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


  views() {
    // set up handlebars view engine
    var hbs = exphbs.create({
        defaultLayout: 'main',
        extname: '.hbs',
        helpers: require('./lib/helpers.js'),
        partialsDir: [
          'views/partials/',
        ],
    });
    this.app.engine('.hbs', hbs.engine);
    this.app.set('view engine', '.hbs');
  }

  misc() {
    // set up logging
    this.app.use(morgan('dev'));

    // forms set up - middleware to pare URL-encoded body
    // enables app to use req.body
    this.app.use(require('body-parser').urlencoded({ extended: true }));
    this.app.use(require('body-parser').json());

    // DELETE method - override with POST having ?_method=DELETE
    this.app.use(methodOverride('_method'));

    // set up static content middleware
    this.app.use(express.static(__dirname + '/public'));


    // passport setup

    this.app.use(cookieParser());
    this.app.use(require('express-session')({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
    }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Passport config
    var User = require('./models/User.js');
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

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("connected to mongodb");
    });
  }

  routes() {
    // set up routes

    // enabling views to use {{user}} to get logged in user
    // (req.user set by passport.js)
    this.app.use('/', (req, res, next) => {
      res.locals.user = req.user;
      next();
    });

    this.app.use('/',         require('./routes/home.js'));
    this.app.use('/books',    require('./routes/books.js'));
    this.app.use('/authors',  require('./routes/authors.js'));
    this.app.use('/users',    require('./routes/users.js'));


    // API ROUTES

    // get an instance of router for api routes
    var apiRoutes = express.Router();

    // route to authenticate a user (POST /api/authenticate)
    apiRoutes.post('/authenticate', passport.authenticate('local'),
    (req, res, next) => {
      var user = req.user;
      //if user is found and password matches create a token
      var token = jwt.sign(user, this.app.get('jwtSecret'), {
        expiresIn: '1440m' // expires in 24 hours.
      });
      // return the information including token as json
      res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
      });
    });


    // route middleware to verify a token
    apiRoutes.use((req, res, next) => {
      // check header or url parameters or post parameters for token
      var token = req.body.token || req.query.token || req.headers['x-access-token'];

      // decode token
      if (token) {
        jwt.verify(token, this.app.get('jwtSecret'), (err, decoded) => {
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
    });

    apiRoutes.get('/', (req, res) => {
      res.json({message: 'API INDEX'});
    });

    apiRoutes.get('/users', (req, res) => {
      User.find((err, users) => {
        res.json(users);
      });
    });

    // apply the routes to our application with the prefix /api
    this.app.use('/api', apiRoutes);

    // 404 catch-all handler (middleware)
    this.app.use((req, res, next) => {
    	res.status(404);
    	res.render('404');
    });

    // 500 error handler (middleware)
    this.app.use((err, req, res, next) => {
    	console.error(err.stack);
    	res.status(500);
    	res.render('500');
    });
  }

  run() {
    this.views();
    this.misc();
    this.database();
    this.routes();
    return this.app;
  }
}

module.exports = new Bootstrap();
