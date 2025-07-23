const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician',
        required: true
    },
    service: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    scheduledTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in hours
        default: 2
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rejected'],
        default: 'pending'
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    contactPhone: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Index for efficient queries
BookingSchema.index({ technician: 1, scheduledDate: 1 });
BookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', BookingSchema);