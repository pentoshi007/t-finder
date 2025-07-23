const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Technician = require('../models/Technician');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @desc    Register a new technician
// @route   POST /api/technicians/register
// @access  Public
exports.registerTechnician = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    category,
    city,
    state,
    bio,
    skills,
    experience,
    hourlyRate,
  } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: 'technician',
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const technician = new Technician({
      user: user.id,
      phone,
      category,
      location: { city, state },
      bio,
      skills: skills.split(',').map(skill => skill.trim()),
      experience,
      hourlyRate,
    });

    await technician.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get technicians by query
// @route   GET /api/technicians
// @access  Public
exports.getTechnicians = async (req, res) => {
  const {
    category,
    location,
    minRate,
    maxRate,
    rating,
    sortBy = 'rating',
    limit = 50
  } = req.query;

  let query = {};
  let sort = {};

  // Category filter
  if (category) {
    const categoryDoc = await require('../models/Category').findOne({ name: category });
    if (categoryDoc) {
      query.category = categoryDoc._id;
    }
  }

  // Location filter
  if (location) {
    query['location.city'] = new RegExp('^' + location + '$', 'i');
  }

  // Rate filter
  if (minRate || maxRate) {
    query.hourlyRate = {};
    if (minRate) query.hourlyRate.$gte = parseInt(minRate);
    if (maxRate) query.hourlyRate.$lte = parseInt(maxRate);
  }

  // Rating filter
  if (rating) {
    query.averageRating = { $gte: parseFloat(rating) };
  }

  // Sorting
  switch (sortBy) {
    case 'price-low':
      sort.hourlyRate = 1;
      break;
    case 'price-high':
      sort.hourlyRate = -1;
      break;
    case 'experience':
      sort.experience = -1;
      break;
    case 'rating':
    default:
      sort.averageRating = -1;
      break;
  }

  try {
    const technicians = await Technician.find(query)
      .populate('category', 'name')
      .populate('user', 'name email')
      .sort(sort)
      .limit(parseInt(limit));

    res.json(technicians);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single technician
// @route   GET /api/technicians/:id
// @access  Public
exports.getTechnicianById = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id)
      .populate('category', 'name')
      .populate('user', 'name email');

    if (!technician) {
      return res.status(404).json({ msg: 'Technician not found' });
    }

    res.json(technician);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Technician not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Add a review to a technician
// @route   POST /api/technicians/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const technicianId = req.params.id;
  const userId = req.user.id;

  try {
    // 1. Check for completed booking
    const completedBooking = await Booking.findOne({
      user: userId,
      technician: technicianId,
      status: 'completed',
    });
    if (!completedBooking) {
      return res.status(403).json({ msg: 'You can only review after completing a booking with this technician.' });
    }

    // 2. Prevent duplicate review
    const existingReview = await Review.findOne({ user: userId, technician: technicianId });
    if (existingReview) {
      return res.status(400).json({ msg: 'You have already reviewed this technician.' });
    }

    // 3. Create review
    const review = new Review({
      user: userId,
      technician: technicianId,
      rating,
      comment,
    });
    await review.save();

    // 4. Update technician average rating
    const stats = await Review.aggregate([
      { $match: { technician: review.technician } },
      { $group: { _id: '$technician', averageRating: { $avg: '$rating' } } },
    ]);
    if (stats.length > 0) {
      await require('../models/Technician').findByIdAndUpdate(technicianId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
      });
    }

    res.status(201).json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all reviews for a technician
// @route   GET /api/technicians/:id/reviews
// @access  Public
exports.getReviewsForTechnician = async (req, res) => {
  try {
    const reviews = await Review.find({ technician: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
