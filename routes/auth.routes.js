import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { protect } from '../middleware/validate.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';


const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register new user
 */
authRouter.post('/register', async (req, res, next) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) throw new ErrorHandler(error.details[0].message, 400);

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            throw new ErrorHandler('User already exists with this email or username', 400);
        }

        const user = await User.create({ username, email, password });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || '30d'
        });

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 */
authRouter.post('/login', async (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) throw new ErrorHandler(error.details[0].message, 400);

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new ErrorHandler('Invalid credentials', 401);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new ErrorHandler('Invalid credentials', 401);
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || '30d'
        });

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
});

/**
 * @route GET /api/auth/me
 * @desc Get current user
 */
authRouter.get('/me', protect, async (req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

export default authRouter;