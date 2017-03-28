//TODO add repl/move utils functions to utils lib
const Author  = require('../models/Author.js');
const User    = require('../models/User.js');

function addBook(author) {
  new Book({
    title: "Author book",
    author: author._id
  }).save((err, book) => {
    if(err) return console.log(err);
  });
}


module.exports = {
  descBooks: function() {
    Book.find().populate('author').exec((err, books) => {
      console.log(JSON.stringify(books, null, "\t"));
    });
  },

  seedAuthors: () => {
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
  },

  seedUser: () => {
    User.find((err, users) => {
      if (users.length) return;

      User.register(new User({username: 'Jakub'}), 'foobar',
      (err, user) => {
        if (err) return console.log(err);
        console.log("Added user: " + user);
      });

    });
  },
}
