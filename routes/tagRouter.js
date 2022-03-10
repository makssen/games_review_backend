const Router = require('express');
const tagController = require('../controllers/tagController');

const router = new Router();

router.get('/', tagController.getAll);

module.exports = router;