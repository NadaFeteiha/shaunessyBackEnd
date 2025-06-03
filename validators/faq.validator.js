import Joi from 'joi';

export const faqJoiSchema = Joi.object({
    question: Joi.string()
        .min(5).max(500).required()
        .messages({
            'string.empty': 'Question is required',
            'string.min': 'Question must be at least 5 characters',
            'string.max': 'Question cannot exceed 500 characters'
        }),

    answer: Joi.string()
        .min(20).max(2000).required()
        .messages({
            'string.empty': 'Answer is required',
            'string.min': 'Answer must be at least 20 characters',
            'string.max': 'Answer cannot exceed 2000 characters'
        }),

    category: Joi.string()
        .required()
        .messages({
            'any.only': 'Category not allowed'
        })
});

export const faqIdJoiSchema = Joi.string().hex().length(24);