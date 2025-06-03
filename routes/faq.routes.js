import { Router } from 'express';
import { FAQ } from '../models/FAQ.model.js';
import { validateId, validateFAQ, protect } from '../middleware/validate.js';
import { ResponseHandler } from '../utils/ResponseHandler.js';

const FAQRouter = Router();

/**
 * @route GET /api/faqs
 * @desc Get all FAQs
 */
FAQRouter.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (search) {
            filter.$text = { $search: search };
        }

        const faqs = await FAQ.find(filter)
            .sort({ createdAt: -1 });

        ResponseHandler.success(res, faqs);
    } catch (err) {
        ResponseHandler.serverError(res, 'Failed to fetch FAQs', err);
    }
});


/**
  * @route POST /api/faqs
  * @desc Create a new FAQ
 */
FAQRouter.post('/', protect, validateFAQ, async (req, res) => {
    try {
        console.log('Creating FAQ with data:', req.body);
        const faq = new FAQ(req.body);
        await faq.save();
        console.log('FAQ created successfully:', faq);
        ResponseHandler.success(res, faq, 'FAQ created successfully', 201);
    } catch (err) {
        if (err.code === 11000) {
            ResponseHandler.conflict(res, 'This question already exists');
        } else {
            ResponseHandler.serverError(res, 'Failed to create FAQ', err);
        }
    }
});


/**
 * @route DELETE /api/faqs/:id
 * @desc Delete a FAQ
 */
FAQRouter.delete('/:id', protect, validateId, async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndDelete(req.params.id);
        if (!faq) {
            return ResponseHandler.notFound(res, 'FAQ not found');
        }
        ResponseHandler.success(res, null, 'FAQ deleted successfully');
    } catch (err) {
        ResponseHandler.serverError(res, 'Failed to delete FAQ', err);
    }
});

export default FAQRouter;