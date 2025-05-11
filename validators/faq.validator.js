import Joi from 'joi';

export const faqJoiSchema = Joi.object({
    question: Joi.string()
        .min(10).max(500).required()
        .messages({
            'string.empty': 'Question is required',
            'string.min': 'Question must be at least 10 characters',
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
        .valid('general', 'technical', 'account', 'billing', 'other').required()
        .messages({
            'any.only': 'Category must be general, technical, account, billing, or other'
        })
});

export const faqIdJoiSchema = Joi.string().hex().length(24);