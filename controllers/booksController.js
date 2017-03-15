var Book        = require('../models/book.js');
var app         = require('../app.js');
// var customerViewModel = require('../viewModels/customer.js');

exports.show = (req, res, next) => {
  Book.findById(req.params.id, (err, book) => {
    if (err) return next(err);
    if (!book) return next(); // book not found - pass this on to 404 handler
    res.render('books/book', {
      book: book
    });
  });
};

exports.index = (req, res, next) => {
  Book.find((err, books) => {
    if(err) return next(err);
    res.render('books/index', {
      books: books,
      name: '/books'
    });
  });
};

exports.new = (req, res, next) => {
  res.render('books/new');
};

exports.create = (req, res, next) => {
  //TODO: add validation
  new Book({
    title: req.body.title
  }).save(() => {
    res.redirect(303, '/books' + app.namedRoutes.build('books'));
  });
};

exports.edit = (req, res, next) => {
  Book.findById({'_id': req.params.id}, (err, book) => {
    if (err) return next(err);
    if (!book) return next(); // book not found - pass this on to 404 handler
    res.render('books/edit', {
      book: book
    });
  });
};

exports.update = (req, res, next) => {
  //TODO: validate and redirect to edit on err -> use named edit routes
  var id = req.params.id;
  var title = req.body.title;
  Book.findByIdAndUpdate(id, { $set: { title: title }}, (err, book) => {
    if (err) return next(err);
    res.redirect('/books');
  });
};

exports.delete = (req, res, next) => {
  Book.findOneAndRemove({'_id': req.params.id}, (err, data) => {
    if (err) return next(err);
    res.redirect(303, '/books' + app.namedRoutes.build('books'));
  });
};
