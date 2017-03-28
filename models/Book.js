var mongoose      = require('mongoose'),
    Author        = require('./Author.js');
    Schema        = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var bookSchema = Schema({
    title: String,
    author: {
        type: Number,
        ref: 'Author'
    }
});

bookSchema.statics.changeAuthors = (bookId, oldAuthor, newAuthor) => {
  console.log("CHanign authors");
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


// TODO: UŻYJ TEGO DO POST FIND AND update
// znajduje autoróœ z daną książką -> więc nie potrzebujemy id starego autora
// bu usunąć książkę mu (pierwsze find może być findOne)
// JEDNAK NEI MAM NWOEGU AUTORA XDDXXDXDXDXDXDXDDX
// Author.find({"books": bookId}, (err, author) => {
//   // pierw usun autorowi książkę
//   author.update({$pull: {books: id}}, err => {
//     if (err) console.log(err);
//     // tutaj dodaj nowemu autorowi
//     Author.findByIdAndUpdate(newAuthor, {$push: {books: id}});
//   });
// });

autoIncrement.initialize(mongoose.connection);
bookSchema.plugin(autoIncrement.plugin, {
    model: 'Book',
    startAt: 1
});

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
