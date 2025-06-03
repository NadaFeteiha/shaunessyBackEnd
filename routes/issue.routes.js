import express from 'express';
import { Issue } from '../models/issues.model.js';
import { issueSchema } from '../validators/issue.validator.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { validateId, validateIssue, protect } from '../middleware/validate.js';

const issueRouter = express.Router();

// Get all issues
issueRouter.get('/', async (req, res, next) => {
    try {
        const issues = await Issue.find();
        res.status(200).json({ success: true, data: issues });
    } catch (err) {
        next(err);
    }
});

issueRouter.post('/', protect, validateIssue, async (req, res, next) => {
    try {
        const { id, title, description } = req.body;

        // Check for duplicate title or id
        const existing = await Issue.findOne({ $or: [{ id }, { title }] });
        if (existing) throw new ErrorHandler('Issue with this ID or Title already exists', 409);

        const issue = await Issue.create({ id, title, description });
        res.status(201).json({ success: true, data: issue });
    } catch (err) {
        next(err);
    }
});

// Delete an issue by id
issueRouter.delete('/:id', protect, async (req, res, next) => {
    try {
        const deleted = await Issue.findOneAndDelete({ id: req.params.id });
        if (!deleted) throw new ErrorHandler('Issue not found', 404);
        res.status(200).json({ success: true, message: 'Issue deleted' });
    } catch (err) {
        next(err);
    }
});

export default issueRouter;