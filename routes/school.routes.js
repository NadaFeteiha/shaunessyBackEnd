import { Router } from 'express';
import { School } from '../models/School.model.js';
import { validateSchool, validateId, protect, authorize } from '../middleware/validate.js';
import { ResponseHandler } from '../utils/ResponseHandler.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

const schoolRouter = Router();

/**
 * @route GET /api/schools
 * @desc Get all schools 
 */
schoolRouter.get('/', async (req, res, next) => {
    try {
        const schools = await School.find();
        ResponseHandler.success(res, schools);
    } catch (err) {
        next(new ErrorHandler('Failed to fetch schools', 500, err));
    }
});

/**
 * @route {POST} /api/schools
 * @desc Create a new school
 */
schoolRouter.post('/', protect, authorize('admin'), validateSchool, async (req, res, next) => {
    try {
        const school = new School(req.body);
        await school.save();
        ResponseHandler.success(res, school, 'School created successfully', 201);
    } catch (err) {
        if (err.code === 11000) {
            next(new ErrorHandler('School name already exists', 409, err));
        } else {
            next(new ErrorHandler('Failed to create school', 500, err));
        }
    }
});

/**
 * @route patch /api/schools/:id
 * @desc Update a school
 */
schoolRouter.patch('/:id', protect, authorize('admin'), validateId, validateSchool, async (req, res, next) => {
    try {
        const school = await School.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!school) {
            throw new ErrorHandler('School not found', 404);
        }

        ResponseHandler.success(res, school, 'School updated successfully');
    } catch (err) {
        next(err);
    }
});

/**
 * @route DELETE /api/schools/:id
 * @desc Delete a school
 */
schoolRouter.delete('/:id', protect, authorize('admin'), validateId, async (req, res, next) => {
    try {
        const school = await School.findByIdAndDelete(req.params.id);
        if (!school) {
            throw new ErrorHandler('School not found', 404);
        }
        ResponseHandler.success(res, null, 'School deleted successfully');
    } catch (err) {
        next(err);
    }
});

export default schoolRouter;