import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
    },
    { timestamps: true }
);

export const Issue = mongoose.model('Issue', IssueSchema);