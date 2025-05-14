import mongoose from 'mongoose';

// Validation helpers
const validatePhone = (phone) => /^[\d\s-]{10,15}$/.test(phone);
const validateWebsite = (url) =>
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(url);

const SchoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'School name is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters'],
        index: true
    },
    type: {
        type: String,
        required: [true, 'School type is required'],
        enum: {
            values: ['elementary', 'middle', 'high'],
            message: 'Type must be elementary, middle, or high'
        }
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        minlength: [10, 'Address must be at least 10 characters'],
        maxlength: [200, 'Address cannot exceed 200 characters']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: validatePhone,
            message: 'Phone must be 10-15 digits'
        }
    },
    email: {
        type: String,
        required: [false, 'Email is optional'],
        unique: true,
        lowercase: true,
        maxlength: [100, 'Email cannot exceed 100 characters'],
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address'
        ]
    },
    website: {
        type: String,
        required: [true, 'Website is required'],
        validate: {
            validator: validateWebsite,
            message: 'Invalid website URL'
        },
        maxlength: [100, 'Website URL cannot exceed 100 characters']
    },
    direction: {
        type: String,
        required: [true, 'Direction is required']
    },
    district: {
        type: String,
        required: [true, 'District is required'],
        minlength: [3, 'District must be at least 3 characters'],
        maxlength: [50, 'District cannot exceed 50 characters'],
        index: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// Compound index for frequently queried fields
SchoolSchema.index({ type: 1, district: 1 });

// Pre-save hook for additional validation
SchoolSchema.pre('save', function (next) {
    // Custom validation logic can go here
    next();
});

SchoolSchema.index({ name: 1 });

export const School = mongoose.model('School', SchoolSchema);