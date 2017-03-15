var mongoose      = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');

var bookSchema = mongoose.Schema({
    title: String
});
autoIncrement.initialize(mongoose.connection);
bookSchema.plugin(autoIncrement.plugin, 'Book');
var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
