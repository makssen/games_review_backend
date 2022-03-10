const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const postRouter = require('./postRouter');
const tagRouter = require('./tagRouter');

router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/tag', tagRouter);

module.exports = router;