var booksController = require('../controllers/booksController.js'),
    NamedRouter     = require('named-routes'),
    app             = require('../app.js'),
    router          = require('express').Router();


// enable express router to use named routes by extending it
var namedRouter = new NamedRouter();
namedRouter.extendExpress(app);
namedRouter.registerAppHelpers(app);
namedRouter.extendExpress(router);

router.get('/new', 'new', booksController.new);
router.get('/:id', booksController.show);
router.delete('/:id', booksController.delete);
router.get('/edit/:id', booksController.edit);
router.put('/:id', booksController.update);
router.get('/', 'books', booksController.index);
router.post('/', booksController.create);

module.exports = router;
