import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Event title is required'],
            unique: true,
            trim: true,
            minlength: [5, 'Event title must be at least 5 characters'],
            maxlength: [100, 'Event title cannot exceed 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            minlength: [20, 'Description must be at least 20 characters'],
            maxlength: [2000, 'Description cannot exceed 2000 characters']
        },
        date: {
            type: Date,
            required: [true, 'Event date is required']
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            maxlength: [200, 'Location cannot exceed 200 characters']
        },
        type: {
            type: String,
            default: "Social",
            enum: {
                values: ['Social', 'Educational', 'Sports', 'Cultural', 'Business'],
                message: 'Event type must be Social, Educational, Sports, Cultural, or Business'
            }
        },
        startTime: {
            type: Date,
            required: [true, 'Start time is required']
        },
        endTime: {
            type: Date,
            required: [true, 'End time is required'],
            validate: {
                validator: function (endTime) {
                    return endTime > this.startTime;
                },
                message: 'End time must be after start time'
            }
        },
        repeat: {
            type: String,
            enum: ['none', 'weekly', 'monthly', 'yearly'],
            default: 'none'
        },
        repeatUntil: {
            type: Date,
            default: null,
            validate: {
                validator: function (repeatUntil) {
                    if (this.repeat === 'none') return true;
                    return repeatUntil > this.date;
                },
                message: 'Repeat until date must be after event date'
            }
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
EventSchema.index({ date: 1, startTime: 1 });

export const Event = mongoose.model('Event', EventSchema);