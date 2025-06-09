import { Router } from 'express';
import { Link } from '../models/Links.model.js';
import { validateId, validateLink, protectAdmin } from '../middleware/validate.js';
import { ResponseHandler } from '../utils/ResponseHandler.js';

const linkRouter = Router();

/**
 * @route GET /api/links
 * @desc Get all links
 */
linkRouter.get('/', async (req, res) => {
    try {
        const links = await Link.find();
        ResponseHandler.success(res, links);
    } catch (err) {
        ResponseHandler.serverError(res, 'Failed to fetch links', err);
    }
});


/**
 * @route POST /api/links
 * @desc Create a new link
 */

linkRouter.post('/', validateLink, protectAdmin, async (req, res) => {
    try {
        console.log("==============================================")
        console.log('Creating link with data:', req.body);
        const newLink = new Link(req.body);
        await newLink.save();
        console.log('Link created successfully:', newLink);
        ResponseHandler.success(res, newLink, 'Link created successfully', 201);
    } catch (err) {
        if (err.code === 11000) {
            ResponseHandler.conflict(res, 'This link (id or title) already exists');
        } else {
            ResponseHandler.serverError(res, 'Failed to create link', err);
        }
    }
});

/**
 * @route PATCH /api/links/:id
 * @desc Update a link
 */
linkRouter.patch('/:id', protectAdmin, validateId, validateLink, async (req, res) => {
    try {
        const link = await Link.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!link) {
            return ResponseHandler.notFound(res, 'Link not found');
        }
        ResponseHandler.success(res, link, 'Link updated successfully');
    } catch (err) {
        if (err.code === 11000) {
            return ResponseHandler.conflict(res, 'This link (id or title) already exists');
        }
        ResponseHandler.serverError(res, 'Failed to update link', err);
    }
}
);

/**
 * @route DELETE /api/links/:id
 * @desc Delete a link
 */
linkRouter.delete('/:id', protectAdmin, validateId, async (req, res) => {
    try {
        const link = await Link.findByIdAndDelete(req.params.id);
        if (!link) {
            return ResponseHandler.notFound(res, 'Link not found');
        }
        ResponseHandler.success(res, null, 'Link deleted successfully');
    } catch (err) {
        ResponseHandler.serverError(res, 'Failed to delete link', err);
    }
});

export default linkRouter;