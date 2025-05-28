import express from 'express';
import { HOA } from '../models/HOA.model.js';
import { protect } from '../middleware/validate.js';


const HOARouter = express.Router();

/**
 * @route GET /api/hoa/
 * @desc Get all HOAs
 */
HOARouter.get('/', async (req, res, next) => {
    try {
        const hoas = await HOA.find();
        res.json(hoas);
    } catch (err) {
        next(err);
    }
}
);

/**
 * @route POST /api/hoa/
 * @desc Create a new HOA
 */
HOARouter.post('/', protect, async (req, res, next) => {
    try {
        console.log(req.body);
        const { fName, lName, imgUrl, title } = req.body;

        if (!fName || !lName || !imgUrl || !title) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const hoa = await HOA.create({ fName, lName, imgUrl, title });

        res.status(201).json({
            success: true,
            hoa
        });
    } catch (err) {
        next(err);
    }
}
);

/**
 * @route DELETE /api/hoa/:id
 * @desc Delete a HOA
 */
HOARouter.delete('/:id', protect, async (req, res, next) => {
    try {
        const { id } = req.params;

        const hoa = await HOA.findByIdAndDelete(id);

        if (!hoa) {
            return res.status(404).json({ message: 'HOA not found' });
        }

        res.json({ message: 'HOA deleted successfully' });
    } catch (err) {
        next(err);
    }
}
);

/**
 * @route PUT /api/hoa/:id
 * @desc Update a HOA
 */
HOARouter.patch('/:id', protect, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { fName, lName, imgUrl, title } = req.body;

        if (!fName || !lName || !imgUrl || !title) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const hoa = await HOA.findByIdAndUpdate(id, { fName, lName, imgUrl, title }, { new: true });

        if (!hoa) {
            return res.status(404).json({ message: 'HOA not found' });
        }

        res.json(hoa);
    } catch (err) {
        next(err);
    }
}
);

export default HOARouter;