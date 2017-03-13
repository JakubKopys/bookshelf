var express     = require('express'),
    exphbs      = require('express-handlebars'),
    morgan      = require('morgan'),
    formidable  = require('formidable'),
    mongoose    = require('mongoose'),
    credentials = require('./credentials.js'),
    helpers     = require('./lib/helpers.js');

var app = express();
app.set('port', process.env.PORT || 3000);

// set up static content middleware
app.use(express.static(__dirname + '/public'));

// set up connection to the mongodb using mongoose
var options = {
  user: credentials.mongo.dev.user,
  pass: credentials.mongo.dev.pass
}
mongoose.connect(credentials.mongo.dev.url, options);

// set up handlebars view engine
var hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: helpers,
    partialsDir: [
      'views/partials/',
    ],
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(require('body-parser').urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('home');
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
  console.log( 'Express started in ' + app.get('env') +
	' mode on http://localhost: '+ app.get('port') +
	'; press Ctrl-C to terminate.' );
});
