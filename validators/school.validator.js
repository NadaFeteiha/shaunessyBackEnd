import Joi from 'joi';
import { School } from '../models/School.model.js';

// Joi schema for request validation
export const schoolJoiSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    type: Joi.string().valid('elementary', 'middle', 'high').required(),
    address: Joi.string().min(10).max(200).required(),
    phone: Joi.string().pattern(/^[\d\s-]{10,15}$/).required(),
    email: Joi.string().email().max(100),
    website: Joi.string().uri().max(100).required(),
    direction: Joi.string().required(),
    district: Joi.string().min(3).max(50).required()
});

// MongoDB ID validation
export const idJoiSchema = Joi.string().hex().length(24);

// Check for duplicate fields
export const checkDuplicates = async (field, value) => {
    const exists = await School.exists({ [field]: value });
    return exists ? `${field} already in use` : null;
};