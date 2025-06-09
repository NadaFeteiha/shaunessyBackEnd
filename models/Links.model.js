import mongoose from 'mongoose';

const LinksSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        link: {
            type: String,
            required: [true, 'Link is required'],
            trim: true,
        },
    },
    { timestamps: true }
);

export const Link = mongoose.model('Link', LinksSchema);