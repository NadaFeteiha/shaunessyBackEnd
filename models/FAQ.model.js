import mongoose from 'mongoose';

const FAQSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, 'Question is required'],
            unique: true,
            trim: true,
            minlength: [10, 'Question must be at least 10 characters'],
            maxlength: [500, 'Question cannot exceed 500 characters']
        },
        answer: {
            type: String,
            required: [true, 'Answer is required'],
            minlength: [20, 'Answer must be at least 20 characters'],
            maxlength: [2000, 'Answer cannot exceed 2000 characters']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: ['general', 'technical', 'account', 'billing', 'other'],
                message: 'Category must be general, technical, account, billing, or other'
            },
            index: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret.__v;
                return ret;
            }
        },
        toObject: { virtuals: true }
    }
);

// Text index for search functionality
FAQSchema.index({ question: 'text', answer: 'text' });

export const FAQ = mongoose.model('FAQ', FAQSchema);