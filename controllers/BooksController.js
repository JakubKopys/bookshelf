var Book        = require('../models/Book.js');
var Author      = require('../models/Author.js');
var app         = require('../app.js');
// var customerViewModel = require('../viewModels/customer.js');

class BooksController {
  show(req, res, next) {
    Book.findById(req.params.id).populate('author').exec((err, book) => {
      if (err) return next(err);
      if (!book) return next(); // book not found - pass this on to 404 handler
      res.render('books/show', {
        book: book,
        author: book.author
      });
    });
  }

  index(req, res, next) {
    Book.find({}, 'title', (err, books) => {
      if(err) return next(err);

      // res.json(books);
      res.render('books/index', {
        books: books,
        name: '/books'
      });
    });
  }

  new(req, res, next) {
    Author.find((err, authors) => {
      res.render('books/new', {
        authors: authors
      });
    });
  }

  create(req, res, next) {
    //TODO: add validation
    new Book({
      title: req.body.title,
      author: req.body.author
    }).save((err, book) => {
      if (err) return next(err);
      res.redirect(303, '/books');
    });
  }


  edit(req, res, next) {
    // TODO Use populate instead of nesting findBy and callbacks
    // idk
    Author.find((err, authors) => {
      Book.findById(req.params.id, (err, book) => {
        if (err) return next(err);
        if (!book) return next(); // book not found - pass this on to 404 handler
        res.render('books/edit', {
          book: book,
          authors: authors
        });
      });
    });
  }

  update(req, res, next) {
    //TODO: validate and redirect to edit on err -> use named edit routes
    var id = req.params.id;
    var title = req.body.title;
    var newAuthor = req.body.author;
    Book.findById(id, (err, book) => {
      var oldAuthor = book.author;
      book.update({ $set: {
        title: title,
        author: newAuthor
      }}, (err) => {
        if (err) return next(err);
        if (oldAuthor != newAuthor) {
          console.log("Authors changed");
          // Authors changed, so we have to remove book from old one
          // and add to the new authors books
          // removing book id from old authors books
          Book.changeAuthors(book._id, oldAuthor, newAuthor);
        };
        res.redirect('/books');
      });
    });
  }

  delete(req, res, next) {
    Book.findOneAndRemove({'_id': req.params.id}, (err, book) => {
      if (err) return next(err);
      console.log("Deleting book: "+ book);

      // remove book from its authors books
      Author.findByIdAndUpdate(book.author, {$pull: {books: book.id}}, (err, author) => {
        if (err) return console.log(err);
        console.log("Author after update: " + author);
        res.redirect(303, '/books');
      });
    });
  }

  search(req, res, next) {
    var title = req.params.title
    var regExp = new RegExp();

    var isValid = true;
    try {
        regExp = new RegExp(title, "i")
    } catch(e) {
        isValid = false;
    }

    if(!isValid) return res.json("Invalid search term.");
    Book.find({title: new RegExp(title, "i")}, (err, books) => {
      res.json(books);
    });
  }
}

module.exports = new BooksController();
