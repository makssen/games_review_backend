const Router = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('../utils/multer');

const router = new Router();

router.get('/', postController.getAll);
router.get('/search', postController.search);
router.get('/:id', postController.getById);
router.post('/', [authMiddleware, multer.array('images', 3)], postController.create);
router.post('/comment', authMiddleware, postController.createComment);
router.put('/:id', [authMiddleware, multer.array('images', 3)], postController.update);
router.put('/like/:id', authMiddleware, postController.liked);
router.delete('/:id', authMiddleware, postController.delete);

module.exports = router;