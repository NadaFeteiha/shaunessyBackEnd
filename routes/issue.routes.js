import express from 'express';
import { Issue } from '../models/issues.model.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { validateId, validateIssue, protect } from '../middleware/validate.js';
import { ResponseHandler } from '../utils/ResponseHandler.js';

const issueRouter = express.Router();

// Get all issues
issueRouter.get('/', async (req, res, next) => {
    try {
        const issues = await Issue.find();
        ResponseHandler.success(res, issues);
    } catch (err) {
        next(err);
    }
});

issueRouter.post('/', protect, validateIssue, async (req, res, next) => {
    try {
        const { title, description } = req.body;

        // Check for duplicate title
        const existing = await Issue.findOne({ title });
        if (existing) throw new ErrorHandler('Issue with this Title already exists', 409);

        const issue = await Issue.create({ title, description });
        res.status(201).json({ success: true, data: issue });
    } catch (err) {
        next(err);
    }
});

// Delete an issue by id
issueRouter.delete('/:id', protect, validateId, async (req, res) => {
    try {
        const deleted = await Issue.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return ResponseHandler.notFound(res, 'Issue not found');
        }
        ResponseHandler.success(res, null, 'Issue deleted successfully');
    } catch (err) {
        ResponseHandler.serverError(res, 'Failed to delete Issue', err);
    }
});

export default issueRouter;