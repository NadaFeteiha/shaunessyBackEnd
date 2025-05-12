import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            unique: true,
            trim: true,
            minlength: [10, 'Title must be at least 10 characters'],
            maxlength: [200, 'Title cannot exceed 200 characters']
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            minlength: [50, 'Description must be at least 50 characters'],
            maxlength: [5000, 'Description cannot exceed 5000 characters']
        },
        image: {
            type: String,
            validate: {
                validator: (v) => {
                    if (!v) return true; // Optional field
                    return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
                },
                message: 'Invalid image URL format'
            }
        },
        date: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            required: [true, 'Type is required'],
            minlength: [4, 'Type must be at least 4 characters'],
            maxlength: [50, 'Type cannot exceed 50 characters'],
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

// Indexes
NewsSchema.index({ title: 'text', description: 'text' });
NewsSchema.index({ date: -1 });

export const News = mongoose.model('News', NewsSchema);