var BooksController = require('../controllers/BooksController.js'),
    // NamedRouter     = require('named-routes'),
    // app             = require('../app.js'),
    router          = require('express').Router();


// enable express router to use named routes by extending it
// var namedRouter = new NamedRouter();
// namedRouter.extendExpress(app);
// namedRouter.registerAppHelpers(app);
// namedRouter.extendExpress(router);

router.get('/new', BooksController.new);
router.get('/:id', BooksController.show);
router.delete('/:id', BooksController.delete);
router.get('/edit/:id', BooksController.edit);
router.get('/search/:title', BooksController.search);
router.put('/:id', BooksController.update);
router.get('/', BooksController.index);
router.post('/', BooksController.create);

module.exports = router;
