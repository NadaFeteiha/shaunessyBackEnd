import { schoolJoiSchema, idJoiSchema } from '../validators/school.validator.js';
import { ResponseHandler } from '../utils/ResponseHandler.js';
import { faqJoiSchema } from '../validators/faq.validator.js';
import { newsJoiSchema } from '../validators/news.validator.js';
import { eventJoiSchema } from '../validators/event.validator.js';
import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { User } from '../models/User.model.js';

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new ErrorHandler('Not authorized to access this route', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        next(err);
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not authorized`, 403));
        }
        next();
    };
};

export const validateSchool = async (req, res, next) => {
    const { error } = schoolJoiSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message.replace(/['"]+/g, '')
        }));
        return ResponseHandler.error(res, errors);
    }
    next();
};

export const validateId = (req, res, next) => {
    const { error } = idJoiSchema.validate(req.params.id);
    if (error) {
        return ResponseHandler.error(res, 'Invalid ID format', 400);
    }
    next();
};

export const validateFAQ = async (req, res, next) => {
    const { error } = faqJoiSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message.replace(/['"]+/g, '')
        }));
        return ResponseHandler.error(res, errors);
    }
    next();
};

export const validateNews = async (req, res, next) => {
    const { error } = newsJoiSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message.replace(/['"]+/g, '')
        }));
        return ResponseHandler.error(res, errors);
    }
    next();
};

export const validateEvent = async (req, res, next) => {
    const { error } = eventJoiSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message.replace(/['"]+/g, '')
        }));
        return ResponseHandler.validationError(res, errors);
    }
    next();
};