var Bootstrap = require('./Bootstrap.js'),
    Book      = require('./models/Book.js'),
    Author    = require('./models/Author.js'),
    seeder    = require('./lib/seedDB.js');

// bootstrap app
var app = module.exports = Bootstrap.run();

seeder.seedAuthors();
seeder.seedUser();

// Book.findOneAndUpdate({_id: 110}, {$set: {
//   title: ':DDDl',
//   author: 110
// }}, (err, book) => {
//   if (err) return console.log(err);
//   console.log(book);
// });
// Book.changeAuthors(91, 1, 2);
// Book.findOne({_id: 91}, (err, book) => {
//   if(err) return console.log(err);
//   console.log(book);
//   book.update({ $set: {
//     title: 'XDDDDDDD',
//   }}, (err, book) => {
//     console.log(require('util').inspect(book, { depth: null }));
//   });
// });

app.listen(app.get('port'), () => {
  console.log( 'Express started in ' + app.get('env') +
	' mode on http://localhost: '+ app.get('port') +
	'; press Ctrl-C to terminate.' );
});
