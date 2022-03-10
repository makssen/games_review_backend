const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const { User } = require('../models/models');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const generateRefreshToken = (id, email, role) => {
    const payload = {
        id,
        email,
        role
    }
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
}

class UserController {
    async signup(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(errors));
            }

            const { email, password, username } = req.body;
            const createdUser = await User.findOne({ where: { email } });

            if (createdUser) {
                return next(ApiError.badRequest('User with this email already exists'));
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ email, password: hashPassword, username });
            const token = generateRefreshToken(user.id, user.email, user.role);

            if (!token) {
                return next(ApiError.internal('Token error'));
            }
            return res.json({ token });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return next(ApiError.internal('User with this email does not exist'));
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                return next(ApiError.internal('Invalid password'));
            }

            const token = generateRefreshToken(user.id, user.email, user.role);

            if (!token) {
                return next(ApiError.internal('Token error'));
            }
            return res.json({ token });

        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async auth(req, res, next) {
        try {
            const token = generateRefreshToken(req.user.id, req.user.emial, req.user.role);
            return res.json({ token });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async admin(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest({ message: 'Signup error', errors }));
            }

            const { email, password, username, role } = req.body;
            const createdUser = await User.findOne({ where: { email } });

            if (createdUser) {
                return next(ApiError.badRequest('User with this email already exists'));
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ email, password: hashPassword, username, role });

            return res.json(user);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let { id, email } = req.query;
            let users;

            if (!id && !email) {
                users = await User.findAll();
            }
            if (id && !email) {
                users = await User.findAll({ where: { id } });
            }
            if (!id && email) {
                users = await User.findAll({ where: { email } });
            }

            return res.json(users);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id;
            const user = await User.destroy({ where: { id } });
            return res.json(user);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new UserController();