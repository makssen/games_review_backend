const ApiError = require('../error/ApiError');
const { Tag, PostTag } = require('../models/models');

class TagController {
    async getAll(req, res, next) {
        try {
            const tags = await Tag.findAll();
            return res.json(tags);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new TagController();