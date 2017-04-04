var AuthorsController = require('../controllers/AuthorsController.js'),
    router            = require('express').Router(),
    auth              = require('../lib/auth.js');

// middleware verifing jwt token
router.use(auth.verify);

router.get('/:id', AuthorsController.show);
router.delete('/:id', auth.requireRole('ADMIN'), AuthorsController.delete);
router.get('/search/:name', AuthorsController.search);
router.put('/:id', auth.requireRole('ADMIN'), AuthorsController.update);
router.post('/', auth.requireRole('ADMIN'), AuthorsController.create);
router.get('/', AuthorsController.index);

module.exports = router;
