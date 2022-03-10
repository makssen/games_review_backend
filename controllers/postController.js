const ApiError = require('../error/ApiError');
const { Post, Like, Tag, PostTag, Comment } = require('../models/models');
const { uploader } = require('../utils/cloudinary');
const { Op } = require('sequelize');


class PostController {
    async getAll(req, res, next) {
        try {
            let { title, type, limit, page } = req.query;
            let posts;
            page = page || 1;
            limit = limit || 9;
            let offset = page * limit - limit;
            const options = {
                limit,
                offset
            };

            if (!title && !type) {
                posts = await Post.findAndCountAll(options);
            }
            if (!title && type) {
                posts = await Post.findAndCountAll({ where: { type }, ...options });
            }
            if (title && !type) {
                posts = await Post.findAndCountAll({ where: { title }, ...options });
            }
            if (title && type) {
                posts = await Post.findAndCountAll({ where: { title, type }, ...options });
            }
            return res.json(posts);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async create(req, res, next) {
        try {
            let images = [];

            for (const file of req.files) {
                images.push(await uploader(file.path));
            }

            const post = await Post.create({...req.body, images, userId: req.user.id });

            if (req.body.tags) {
                [...req.body.tags].forEach(async(text) => {
                    const [tag] = await Tag.findOrCreate({ where: { text } });
                    PostTag.create({ postId: post.id, tagId: tag.id })
                });
            }

            return res.json(post);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const post = await Post.findOne({
                where: { id },
                include: [
                    { model: Like, as: 'likes', attributes: ['userId'] },
                    { model: Comment, as: 'comments' },
                    { model: Tag, as: 'tags' }
                ]
            });
            return res.json(post);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const id = req.params.id;
            const userId = req.user.id;
            const findPost = await Post.findOne({ where: { id } });

            if (findPost.userId !== userId) {
                return next(ApiError.badRequest('No access'));
            }

            let images = [];

            for (const file of req.files) {
                images.push(await uploader(file.path));
            }

            const post = await Post.update({...req.body, images }, { where: { id } });
            await PostTag.destroy({ where: { postId: id } });

            if (req.body.tags) {
                [...req.body.tags].forEach(async(text) => {
                    const [tag] = await Tag.findOrCreate({ where: { text } });
                    PostTag.create({ postId: id, tagId: tag.id })
                });
            }

            return res.json(post);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async liked(req, res, next) {
        try {
            const id = req.params.id;
            const userId = req.user.id;
            const { rows, count } = await Like.findAndCountAll({
                where: { postId: id, userId }
            });

            let isLiked = rows.length ? true : false;

            if (!isLiked) {
                await Like.create({ userId, postId: id });
            } else {
                await Like.destroy({ where: { userId, postId: id } });
            }

            const like = isLiked ? count - 1 : count + 1;
            const post = await Post.update({ like }, { where: { id } });
            return res.json(post);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async createComment(req, res, next) {
        try {
            const { text, userId, postId, } = req.body;
            const comment = await Comment.create({ text, postId, userId });
            return res.json(comment);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async search(req, res, next) {
        try {
            const { title } = req.query;
            const posts = await Post.findAll({
                where: {
                    [Op.or]: [{
                            title: {
                                [Op.like]: `%${title}%`
                            }
                        },
                        {
                            text: {
                                [Op.like]: `%${title}%`
                            }
                        }
                    ]
                }
            });
            return res.json(posts);
        } catch (e) {
            console.log(e)
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id;
            const userId = req.user.id;
            const findPost = await Post.findOne({ where: { id } });

            if (findPost.userId !== userId) {
                return next(ApiError.badRequest('No access'));
            }

            const post = await Post.destroy({ where: { id } });
            return res.json(post);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new PostController();