var mongoose      = require('mongoose'),
    Schema        = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var authorSchema = mongoose.Schema({
    name: String,
    books: [{ type: Number, ref: 'Book' }]
});

autoIncrement.initialize(mongoose.connection);
authorSchema.plugin(autoIncrement.plugin, 'Author');
var Author = mongoose.model('Author', authorSchema);

module.exports = Author;
