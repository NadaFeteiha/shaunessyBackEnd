import Joi from 'joi';

export const eventJoiSchema = Joi.object({
    title: Joi.string()
        .min(5).max(100).required()
        .messages({
            'string.empty': 'Event title is required',
            'string.min': 'Event title must be at least 5 characters',
            'string.max': 'Event title cannot exceed 100 characters'
        }),

    description: Joi.string()
        .min(20).max(2000).required()
        .messages({
            'string.empty': 'Description is required',
            'string.min': 'Description must be at least 20 characters',
            'string.max': 'Description cannot exceed 2000 characters'
        }),

    date: Joi.date()
        .required()
        .messages({
            'date.base': 'Event date is required'
        }),

    location: Joi.string()
        .max(200).required()
        .messages({
            'string.empty': 'Location is required',
            'string.max': 'Location cannot exceed 200 characters'
        }),

    type: Joi.string()
        .valid('Social', 'Educational', 'Sports', 'Cultural', 'Business')
        .default('Social'),

    startTime: Joi.date()
        .required()
        .messages({
            'date.base': 'Start time is required'
        }),

    endTime: Joi.date()
        .greater(Joi.ref('startTime'))
        .required()
        .messages({
            'date.base': 'End time is required',
            'date.greater': 'End time must be after start time'
        }),

    repeat: Joi.string()
        .valid('none', 'weekly', 'monthly', 'yearly')
        .default('none'),

    repeatUntil: Joi.date()
        .when('repeat', {
            is: Joi.not('none'),
            then: Joi.date().greater(Joi.ref('date')).required(),
            otherwise: Joi.optional()
        })
        .messages({
            'date.greater': 'Repeat until date must be after event date'
        })
});


export const eventHistorySchema = Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(10)
});

export const eventDateSchema = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/);