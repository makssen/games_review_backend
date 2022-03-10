const Router = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { check } = require('express-validator');

const router = new Router();

router.post('/signup', [
        check('email', 'Email cannot be empty').isEmail(),
        check('password', 'Password must be between 4 and 10 characters').isLength({ min: 8, max: 15 }),
        check('username', 'Username cannot be empty').notEmpty()
    ],
    userController.signup
);
router.post('/login', userController.login);
router.post('/', roleMiddleware('ADMIN'), userController.admin);
router.get('/auth', authMiddleware, userController.auth);
router.get('/', roleMiddleware('ADMIN'), userController.getAll);
router.delete('/:id', roleMiddleware('ADMIN'), userController.delete);

module.exports = router;