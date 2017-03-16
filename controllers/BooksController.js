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
      if (err) next(err);

      // Add new book to authors books
      Author.findByIdAndUpdate(book.author, {$push: {books: book._id}},(err, auth) => {
        if (err) return console.log(err);
      });
      res.redirect(303, '/books');
    });
  }


  edit(req, res, next) {
    // TODO Use populate instead of nesting findBy and callbacks
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
    Book.findById(id, (err, book)=>{
      var oldAuthor = book.author;
      book.update({ $set: {
        title: title,
        author: newAuthor
      }}, (err, book) => {
        if (err) return next(err);
        if (oldAuthor != newAuthor) {
          console.log("Authors changed");
          // TODO maybe add model function doing so? Or other helper one
          // Authors changed, so we have to remove book from old one
          // and add to the new authors books
          // removing book id from old authors books
          Author.findById(oldAuthor, (err, old) => {
            if (err) return console.log(err);
            console.log("removed from: " + old);
            console.log("usuwana ksiązka: " + id);
            old.update({$pull: {books: id}}, (err, a) => {
              if (err) console.log(err);
              console.log("Old after update: " + old);
            });
          });
          // adding book to new author
          Author.findByIdAndUpdate(newAuthor, {$push: {books: id}},(err, auth) => {
            if (err) return console.log(err);
          });
        };
        res.redirect('/books');
      });
    });

    // TODO change authors of the book -> newauthor and oldauthor variables
  }

  delete(req, res, next) {
    Book.findOneAndRemove({'_id': req.params.id}, (err, data) => {
      if (err) return next(err);
      res.redirect(303, '/books' + app.namedRoutes.build('books'));
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
