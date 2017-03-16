var AuthorsController = require('../controllers/AuthorsController.js'),
    NamedRouter     = require('named-routes'),
    app             = require('../app.js'),
    router          = require('express').Router();


// enable express router to use named routes by extending it
// namedRouter.extendExpress(router);

router.get('/new', AuthorsController.new);
router.get('/:id', AuthorsController.show);
router.delete('/:id', AuthorsController.delete);
router.get('/edit/:id', AuthorsController.edit);
router.get('/search/:name', AuthorsController.search);
router.put('/:id', AuthorsController.update);
router.post('/', AuthorsController.create);
router.get('/', AuthorsController.index);

module.exports = router;
