import { Router } from 'express';
import { News } from '../models/News.model.js';
import { validateNews, validateId, protect, authorize } from '../middleware/validate.js';
import { ResponseHandler } from '../utils/ResponseHandler.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

const newsRouter = Router();

/**
 * @route GET /api/news
 * @desc Get paginated news items
 * @query page - Page number (default: 1)
 * @query limit - Items per page (default: 10)
 * @query type - Filter by type (news|event)
 * @query search - Search term
 */
newsRouter.get('/', async (req, res, next) => {
    try {
        // Parse pagination parameters with defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};
        if (req.query.type) filter.type = req.query.type;
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }

        // Execute queries in parallel
        const [newsItems, totalItems] = await Promise.all([
            News.find(filter)
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit),
            News.countDocuments(filter)
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalItems / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        ResponseHandler.success(res, {
            items: newsItems,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNext,
                hasPrev
            }
        });
    } catch (err) {
        next(new ErrorHandler('Failed to fetch news items', 500, err));
    }
});

/**
 * @route POST /api/news
 * @desc Create a new news item
 */
newsRouter.post('/', protect, authorize('admin', 'moderator'), validateNews, async (req, res, next) => {
    try {
        const newsItem = new News(req.body);
        await newsItem.save();
        ResponseHandler.success(res, newsItem, 'News item created successfully', 201);
    } catch (err) {
        if (err.code === 11000) {
            next(new ErrorHandler('News title already exists', 409, err));
        } else {
            next(new ErrorHandler('Failed to create news item', 500, err));
        }
    }
});

/**
 * @route GET /api/news/:id
 * @desc Get single news item by ID
 */
newsRouter.get('/:id', validateId, async (req, res, next) => {
    try {
        const newsItem = await News.findById(req.params.id);
        if (!newsItem) {
            throw new ErrorHandler('News item not found', 404);
        }
        ResponseHandler.success(res, newsItem);
    } catch (err) {
        next(err);
    }
});

/**
 * @route PATCH /api/news/:id
 * @desc Update a news item
 */
newsRouter.patch('/:id', protect, authorize('admin', 'moderator'), validateId, validateNews, async (req, res, next) => {
    try {
        console.log("*************** Patch",req.body);
        const newsItem = await News.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!newsItem) {
            throw new ErrorHandler('News item not found', 404);
        }

        console.log("new =======>", newsItem);
        ResponseHandler.success(res, newsItem, 'News item updated successfully');
    } catch (err) {
        if (err.code === 11000) {
            next(new ErrorHandler('News title already exists', 409, err));
        } else {
            next(err);
        }
    }
});

/**
 * @route DELETE /api/news/:id
 * @desc Delete a news item
 */
newsRouter.delete('/:id', protect, authorize('admin', 'moderator'), validateId, async (req, res, next) => {
    try {
        const newsItem = await News.findByIdAndDelete(req.params.id);
        if (!newsItem) {
            throw new ErrorHandler('News item not found', 404);
        }
        ResponseHandler.success(res, null, 'News item deleted successfully');
    } catch (err) {
        next(err);
    }
});

export default newsRouter;