import Joi from 'joi';

export const newsJoiSchema = Joi.object({
    title: Joi.string()
        .min(4).max(200).required()
        .messages({
            'string.empty': 'Title is required',
            'string.min': 'Title must be at least 5 characters',
            'string.max': 'Title cannot exceed 200 characters'
        }),

    description: Joi.string()
        .min(50).max(5000).required()
        .messages({
            'string.empty': 'Description is required',
            'string.min': 'Description must be at least 50 characters',
            'string.max': 'Description cannot exceed 5000 characters'
        }),

    image: Joi.string()
        .allow('')
        .optional(),

    type: Joi.string().required()
        .messages({
            'any.only': 'Type must be either "news" or "event"'
        })
});
