var Author      = require('../models/Author.js');
var app         = require('../app.js');

class AuthorsController {
  show(req, res, next) {
    Author.findById(req.params.id).populate('books').exec((err, author) => {
      if (err) return next(err);
      if (!author) return next(); // author not found - pass this on to 404 handler
      res.json(author);
    });
  }

  index(req, res, next) {
    Author.find({}, 'name', (err, authors) => {
      if (err) return next(err);
      res.json(authors)
    });
  }


  create(req, res, next) {
    new Author({
      name: req.body.name
    }).save((err, author) => {
      if (err) return console.log(err);
      res.json({
        success: true,
        author: author
      })
    });
  }

  update(req, res, next) {
    var id = req.params.id;
    var name = req.body.name;
    Author.findByIdAndUpdate(id, { $set: { name: name }}, (err, author) => {
      if (err) return next(err);
      if (!author) return next();
      res.json({
        success: true,
        author: author
      });
    });
  }

  delete(req, res, next) {
    Author.findOne({'_id': req.params.id}, (err, author) => {
      if (err) return next(err);

      if (!author) return res.json({
        success: false,
        message: 'Author not found.'
      });

      author.remove((err, author) => {
        if (err) return next(err);

        res.json({
          success: true,
        });
      });
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
