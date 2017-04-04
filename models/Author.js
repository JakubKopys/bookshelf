var mongoose      = require('mongoose'),
    Schema        = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var authorSchema = mongoose.Schema({
    name: String,
    books: [{ type: Number, ref: 'Book' }]
});

// ON DELETE: CASCADE for books
authorSchema.post('remove', (author) => {
  console.log("POST REMOVE: " + author);
  require('./Book.js').remove({author: author._id}, (err, book) => {
    if (err) return console.log(err);
  });
});

autoIncrement.initialize(mongoose.connection);
authorSchema.plugin(autoIncrement.plugin, {
    model: 'Author',
    startAt: 1
});
var Author = mongoose.model('Author', authorSchema);

module.exports = Author;
