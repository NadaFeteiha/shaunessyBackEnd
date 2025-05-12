import { Router } from 'express';
import { Event } from '../models/Event.model.js';
import { validateEvent, validateId } from '../middleware/validate.js';
import { ResponseHandler } from '../utils/ResponseHandler.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

const eventRouter = Router();

/**
 * @route GET /api/events
 * @desc Get all events
 * @query type - Filter by event type
 * @query upcoming - Only get upcoming events (true/false)
 */
eventRouter.get('/', async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.type) filter.type = req.query.type;
        if (req.query.upcoming === 'true') {
            filter.date = { $gte: new Date() };
        }

        const events = await Event.find(filter)
            .sort({ date: 1, startTime: 1 }); // Sort by soonest first

        ResponseHandler.success(res, events);
    } catch (err) {
        next(new ErrorHandler('Failed to fetch events', 500, err));
    }
});

/**
 * @route POST /api/events
 * @desc Create a new event
 */
eventRouter.post('/', validateEvent, async (req, res, next) => {
    try {
        const event = new Event(req.body);
        await event.save();
        ResponseHandler.success(res, event, 'Event created successfully', 201);
    } catch (err) {
        if (err.code === 11000) {
            next(new ErrorHandler('Event name already exists', 409, err));
        } else {
            next(new ErrorHandler('Failed to create event', 500, err));
        }
    }
});

/**
 * @route GET /api/events/:id
 * @desc Get single event by ID
 */
eventRouter.get('/:id', validateId, async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            throw new ErrorHandler('Event not found', 404);
        }
        ResponseHandler.success(res, event);
    } catch (err) {
        next(err);
    }
});

/**
 * @route PATCH /api/events/:id
 * @desc Update an event
 */
eventRouter.patch('/:id', validateId, validateEvent, async (req, res, next) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            throw new ErrorHandler('Event not found', 404);
        }

        ResponseHandler.success(res, event, 'Event updated successfully');
    } catch (err) {
        if (err.code === 11000) {
            next(new ErrorHandler('Event name already exists', 409, err));
        } else {
            next(err);
        }
    }
});

/**
 * @route DELETE /api/events/:id
 * @desc Delete an event
 */
eventRouter.delete('/:id', validateId, async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            throw new ErrorHandler('Event not found', 404);
        }
        ResponseHandler.success(res, null, 'Event deleted successfully');
    } catch (err) {
        next(err);
    }
});


/**
 * @route GET /api/events/history
 * @desc Get past events sorted by most recent first
 * @query limit - Maximum number of events to return (default: 10)
 */
eventRouter.get('/history', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const events = await Event.find({
            date: { $lt: new Date() }
        })
            .sort({ date: -1 }) // Most recent first
            .limit(limit);

        ResponseHandler.success(res, events);
    } catch (err) {
        next(new ErrorHandler('Failed to fetch historical events', 500, err));
    }
});

/**
 * @route GET /api/events/date/:date
 * @desc Get events for a specific date
 * @param date - Date in YYYY-MM-DD format
 */
eventRouter.get('/date/:date', async (req, res, next) => {
    try {
        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(req.params.date)) {
            throw new ErrorHandler('Invalid date format. Use YYYY-MM-DD', 400);
        }

        const date = new Date(req.params.date);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const events = await Event.find({
            date: {
                $gte: date,
                $lt: nextDay
            }
        }).sort({ startTime: 1 }); // Sort by time

        ResponseHandler.success(res, events);
    } catch (err) {
        next(err);
    }
});

export default eventRouter;