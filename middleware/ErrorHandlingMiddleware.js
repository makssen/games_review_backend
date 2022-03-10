const ApiError = require('../error/ApiError');

module.exports = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }
    res.status(505).json({ message: 'unexpected_error' });
}