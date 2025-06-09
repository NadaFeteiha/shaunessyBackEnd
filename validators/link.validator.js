import Joi from 'joi';

export const linkSchema = Joi.object({
    title: Joi.string().trim().required().messages({
        'string.base': 'Title must be a string',
        'any.required': 'Title is required',
    }),
    link: Joi.string().required().messages({
        'string.base': 'Link must be a string'
    }),
});