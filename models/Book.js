var mongoose      = require('mongoose'),
    Author        = require('./Author.js');
    Schema        = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var bookSchema = Schema({
    title: {
      type: String,
      required: true,
      maxlength: 255,
      minlength: 2
    },
    author: {
        type: Number,
        ref: 'Author',
        required: true
    }
});
bookSchema.statics.changeAuthors = (bookId, oldAuthor, newAuthor) => {
  Author.findOneAndUpdate({_id: oldAuthor}, {$pull: {books: bookId}}, (err) => {
    if (err) console.log(err);
  });
  Author.findOneAndUpdate({_id: newAuthor}, {$push: {books: bookId}}, (err) => {
    if (err) console.log(err);
  });
};

// Add book to its authors books after saving it.
// can use post 'save' because 'save' hooks are not executed on update() or
// on findOneAndUpdate(). Mongoose 4.0 has distinct hooks for these -
// 'find' or 'update'
bookSchema.post('save', book => {
  console.log("POST BOOK SAVE: " + book);
  Author.findByIdAndUpdate(book.author,
                          {$push: {books: book._id}}, (err, author) => {
    if (err) return console.log(err);
    console.log("Added book " + book + " to author " + author)
  });
});


autoIncrement.initialize(mongoose.connection);
bookSchema.plugin(autoIncrement.plugin, {
    model: 'Book',
    startAt: 1
});

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
