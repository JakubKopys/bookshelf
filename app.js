var Bootstrap = require('./Bootstrap.js'),
    Book      = require('./models/Book.js'),
    Author    = require('./models/Author.js');

// bootstrap app
var app = module.exports = Bootstrap.run();

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

Book.findOneAndUpdate({_id: 110}, {$set: {
  title: ':DDDl',
  author: 110
}}, (err, book) => {
  if (err) return console.log(err);
  console.log(book);
});
// Book.changeAuthors(91, 1, 2);
// Book.findOne({_id: 91}, (err, book) => {
//   if(err) return console.log(err);
//   console.log(book);
//   book.update({ $set: {
//     title: 'XDDDDDDD',
//   }}, (err, book) => {
//     console.log(require('util').inspect(book, { depth: null }));
//   });
// });

app.listen(app.get('port'), () => {
  console.log( 'Express started in ' + app.get('env') +
	' mode on http://localhost: '+ app.get('port') +
	'; press Ctrl-C to terminate.' );
});
