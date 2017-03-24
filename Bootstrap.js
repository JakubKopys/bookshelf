var express         = require('express'),
    exphbs          = require('express-handlebars'),
    methodOverride  = require('method-override'),
    morgan          = require('morgan'),
    formidable      = require('formidable'),
    mongoose        = require('mongoose'),
    credentials     = require('./credentials.js');

class Bootstrap {

  constructor() {
    //initialize express app
    this.app = express();
    this.app.set('port', process.env.PORT || 3000);
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

    // DELETE method - override with POST having ?_method=DELETE
    this.app.use(methodOverride('_method'));

    // set up static content middleware
    this.app.use(express.static(__dirname + '/public'));
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
    this.app.use('/',        require('./routes/home.js'));
    this.app.use('/books',   require('./routes/books.js'));
    this.app.use('/authors', require('./routes/authors.js'));

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
