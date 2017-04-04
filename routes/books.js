var BooksController = require('../controllers/BooksController.js'),
    router          = require('express').Router(),
    auth            = require('../lib/auth.js');

// middleware verifing jwt token
router.use(auth.verify);

router.get('/:id', BooksController.show);
router.delete('/:id', auth.requireRole('ADMIN'), BooksController.delete);
router.get('/search/:title', BooksController.search);
router.put('/:id', auth.requireRole('ADMIN'), BooksController.update);
router.get('/', BooksController.index);
router.post('/', auth.requireRole('ADMIN'), BooksController.create);

module.exports = router;
