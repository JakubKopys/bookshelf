var mongoose      = require('mongoose'),
    Schema        = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var bookSchema = mongoose.Schema({
    title: String,
    author: {
        type: Number,
        ref: 'Author'
    }
});

autoIncrement.initialize(mongoose.connection);
bookSchema.plugin(autoIncrement.plugin, 'Book');
var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
