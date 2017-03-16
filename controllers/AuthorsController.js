var Book        = require('../models/Book.js');
var Author      = require('../models/Author.js');
var app         = require('../app.js');
// var customerViewModel = require('../viewModels/customer.js');

class AuthorsController {
  show(req, res, next) {
    Author.findById(req.params.id).populate('books').exec((err, author) => {
      if (err) return next(err);
      if (!author) return next(); // author not found - pass this on to 404 handler
      res.render('authors/show', {
        author: author,
        books: author.books
      });
    });
  }

  index(req, res, next) {
    Author.find({}, 'name', (err, authors) => {
      if(err) return next(err);

      // res.json(authors);
      res.render('authors/index', {
        authors: authors
      });
    });
  }

  new(req, res, next) {
    res.render('authors/new');
  }

  create(req, res, next) {
    new Author({
      name: req.body.name
    }).save((err) => {
      if (err) return console.log(err);
      res.redirect(303, '/authors');
    });
  }

  edit(req, res, next) {
    Author.findById(req.params.id, (err, author) => {
      if (err) return next(err);
      if (!author) return next();
      res.render('authors/edit', {
        author: author
      });
    });
  }

  update(req, res, next) {
    var id = req.params.id;
    var name = req.body.name;
    Author.findByIdAndUpdate(id, { $set: { name: name }}, (err, author) => {
      if (err) return next(err);
      if (!author) return next();
      res.redirect('/authors');
    });
  }

  delete(req, res, next) {
    Author.findOneAndRemove({'_id': req.params.id}, (err, data) => {
      if (err) return next(err);
      res.redirect(303, '/authors');
    });
  }

  search(req, res, next) {
    var name = req.params.name
    var regExp = new RegExp();

    var isValid = true;
    try {
        regExp = new RegExp(name, "i")
    } catch(e) {
        isValid = false;
    }

    if(!isValid) return res.json("Invalid search term.");
    Author.find({name: new RegExp(name, "i")}, (err, authors) => {
      res.json(authors);
    });
  }

}

module.exports = new AuthorsController();
