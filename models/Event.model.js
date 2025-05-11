import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: "Social",
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        repeat: {
            type: String,
            enum: ['none', 'weekly', 'monthly', 'yearly'],
            default: 'none',
        },
        repeatUntil: {
            type: Date,
            default: null,
        }
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);
export default Event;
