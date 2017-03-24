var mongoose      = require('mongoose'),
    Book          = require('./Book.js'),
    Schema        = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var authorSchema = mongoose.Schema({
    name: String,
    books: [{ type: Number, ref: 'Book' }]
});


// ON DELETE: CASCADE for books
authorSchema.post('remove', (author) => {
  console.log("POST REMOVE: " + author);
  Book.remove({author: author._id}, (err, book) => {
    if (err) return console.log(err);
    console.log("Deleting book: " + book);
  });
});

autoIncrement.initialize(mongoose.connection);
authorSchema.plugin(autoIncrement.plugin, 'Author');
var Author = mongoose.model('Author', authorSchema);

module.exports = Author;
