import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        type: {
            type: String,
            required: true,
            enum: ["news", "event"],
        },
    },
    { timestamps: true }
);

const News = mongoose.model("News", NewsSchema);
export default News;
