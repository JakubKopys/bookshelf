var express         = require('express'),
    exphbs          = require('express-handlebars'),
    methodOverride  = require('method-override'),
    morgan          = require('morgan'),
    formidable      = require('formidable'),
    mongoose        = require('mongoose'),
    credentials     = require('./credentials.js'),
    Book            = require('./models/book.js');

// enable app var to be used in any file by requiring app.js
var app = module.exports = express();

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
    helpers: require('./lib/helpers.js'),
    partialsDir: [
      'views/partials/',
    ],
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// forms set up - middleware to pare URL-encoded body
// enables app to use req.body
app.use(require('body-parser').urlencoded({ extended: true }));
// DELETE method - override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// Logging
app.use(morgan('dev'));

// set up routes
app.use('/',      require('./routes/home.js'));
app.use('/books', require('./routes/books.js'));

// Seed dummy data
Book.find((err, books) => {
  if(books.length) return;

  new Book({
    title: 'Test Book #1'
  }).save();

  new Book({
    title: 'Test Book #2'
  }).save();

  new Book({
    title: 'Test Book #3'
  }).save();
});

// 404 catch-all handler (middleware)
app.use((req, res, next) => {
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), () => {
  console.log( 'Express started in ' + app.get('env') +
	' mode on http://localhost: '+ app.get('port') +
	'; press Ctrl-C to terminate.' );
});
