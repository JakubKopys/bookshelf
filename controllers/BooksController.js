var Book        = require('../models/Book.js');
var Author      = require('../models/Author.js');

class BooksController {
  show(req, res, next) {
    Book.findById(req.params.id).populate('author').exec((err, book) => {
      if (err) return next(err);
      if (!book) return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
      res.json(book);
    });
  }

  index(req, res, next) {
    Book.find({}, 'title', (err, books) => {
      if(err) return next(err);

      res.json(books);
    });
  }

  create(req, res, next) {
    //TODO: add validation
    new Book({
      title: req.body.title,
      author: req.body.author
    }).save((err, book) => {
      if (err) return res.status(500).json(err);
      res.json({
        success: true,
        msg: 'Book created.',
        book: book
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
        res.json({
          success: true,
          msg: 'Successfully updated book.'
        });
      });
    });
  }

  delete(req, res, next) {
    Book.findOneAndRemove({'_id': req.params.id}, (err, book) => {
      if (err) return next(err);

      if (!book) return res.json({
        success: false,
        message: 'Book not found.'
      });

      console.log("Deleting book: "+ book);

      // remove book from its authors books
      Author.findByIdAndUpdate(book.author, {$pull: {books: book.id}}, (err, author) => {
        if (err) return console.log(err);
        console.log("Author after update: " + author);
        res.json({
          success: true,
          message: 'Book deleted.'
        });
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
