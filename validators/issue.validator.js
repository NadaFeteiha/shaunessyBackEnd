import Joi from 'joi';

export const issueSchema = Joi.object({
    id: Joi.string().required().messages({
        'string.base': 'ID must be a string',
        'any.required': 'ID is required',
    }),
    title: Joi.string().trim().required().messages({
        'string.base': 'Title must be a string',
        'any.required': 'Title is required',
    }),
    description: Joi.string().required().messages({
        'string.base': 'Description must be a string',
        'any.required': 'Description is required',
    }),
});