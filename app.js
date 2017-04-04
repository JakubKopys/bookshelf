var Bootstrap = require('./Bootstrap.js'),
    Book      = require('./models/Book.js'),
    Author    = require('./models/Author.js'),
    User      = require('./models/User.js'),
    seeder    = require('./lib/seedDB.js');

// bootstrap app
var app = module.exports = Bootstrap.run();

seeder.seedAuthors();
seeder.seedUsers();

app.listen(app.get('port'), () => {
  console.log( 'Express started in ' + app.get('env') +
	' mode on http://localhost: '+ app.get('port') +
	'; press Ctrl-C to terminate.' );
});
