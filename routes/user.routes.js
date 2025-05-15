import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { protect } from '../middleware/validate.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';


const userRouter = express.Router();


/**
 * @route POST /api/user/
 * @desc Get all users
 */

userRouter.get('/', protect, async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        next(err);
    }
});


/**
 * @route POST /api/user/:id
 * @desc change user role
 * @access Private
 * @access Admin
 */
userRouter.post('/:id', protect, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: 'Role is required' });
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
}
);


export default userRouter;