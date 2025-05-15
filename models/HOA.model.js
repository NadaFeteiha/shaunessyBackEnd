import mongoose from 'mongoose';

const HOASchema = new mongoose.Schema(
    {
        fName: {
            type: String,
            required: [true, 'First Name is required'],
            trim: true,
        },
        lName: {
            type: String,
            required: [true, 'Last Name is required'],
            trim: true,
        },
        imgUrl: {
            type: String,
            required: [true, 'Image URL is required'],
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
    },
    { timestamps: true }
);

export const HOA = mongoose.model('HOA', HOASchema);