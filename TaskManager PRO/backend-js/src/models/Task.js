import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'completed'],
            default: 'todo',
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Recurring task fields
        isRecurring: {
            type: Boolean,
            default: false,
        },
        recurringType: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'custom'],
        },
        recurringInterval: {
            type: Number,
            min: 1,
        },
        recurringDays: [{
            type: Number,
            min: 0,
            max: 6,
        }],
        recurringDate: {
            type: Number,
            min: 1,
            max: 31,
        },
        recurringEndDate: {
            type: Date,
        },
        parentTaskId: {
            type: Schema.Types.ObjectId,
            ref: 'Task',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ parentTaskId: 1 });

export const Task = mongoose.model('Task', taskSchema);
