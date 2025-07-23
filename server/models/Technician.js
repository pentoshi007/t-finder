const mongoose = require('mongoose');

const TechnicianSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    location: {
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
    },
    phone: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    experience: {
      type: Number, // in years
      required: true,
    },
    hourlyRate: {
      type: Number, // in INR
      required: true,
    },
    availability: {
      type: String,
      required: true,
      default: 'Mon-Fri, 9am-5pm',
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual property to get reviews for a technician
TechnicianSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'technician',
  justOne: false,
});

// Middleware to calculate average rating when reviews are fetched
async function calculateAverageRating(technicianId) {
  const stats = await this.model('Review').aggregate([
    { $match: { technician: technicianId } },
    {
      $group: {
        _id: '$technician',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await this.model('Technician').findByIdAndUpdate(technicianId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
    });
  } else {
    await this.model('Technician').findByIdAndUpdate(technicianId, {
      averageRating: 0,
    });
  }
}

// You would call calculateAverageRating after a new review is added or updated.

module.exports = mongoose.model('Technician', TechnicianSchema);

