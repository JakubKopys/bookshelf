var express         = require('express'),
    exphbs          = require('express-handlebars'),
    methodOverride  = require('method-override'),
    morgan          = require('morgan'),
    formidable      = require('formidable'),
    mongoose        = require('mongoose'),
    credentials     = require('./credentials.js'),
    Book            = require('./models/Book.js'),
    Author          = require('./models/Author.js');;

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
app.use('/',        require('./routes/home.js'));
app.use('/books',   require('./routes/books.js'));
app.use('/authors', require('./routes/authors.js'));

//TODO add repl/move utils functions to utils lib
function descBooks() {
  Book.find().populate('author').exec((err, books) => {
    console.log(JSON.stringify(books, null, "\t"));
  });
}

function addBook(author) {
  new Book({
    title: "Author book",
    author: author._id
  }).save((err, book) => {
    if(err) return console.log(err);
    console.log("Created book: " + book);
    author.update({$push: {books: book._id}}, (err, auth) => {
      if (err) return console.log(err);
      console.log("Updated Author: " + auth);
    });
  });
}

// Seed dummy data
Author.find((err, authors) => {
  if(authors.length) return;

  new Author({
    name: 'Jakub Kopyś'
  }).save((err, author) => {
    addBook(author);
  });

  new Author({
    name: 'Jan Kowalski'
  }).save((err, author) => {
    if (err) return console.log(err);
    addBook(author);
  });

  new Author({
    name: 'Juliusz Słowacki'
  }).save((err, author) => {
    if (err) return console.log(err);
    addBook(author);
  });
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
