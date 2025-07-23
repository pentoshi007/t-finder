const Booking = require('../models/Booking');
const Technician = require('../models/Technician');
const User = require('../models/User');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        const {
            technicianId,
            service,
            description,
            scheduledDate,
            scheduledTime,
            duration,
            address,
            contactPhone,
            notes
        } = req.body;

        // Get technician to calculate total amount
        const technician = await Technician.findById(technicianId);
        if (!technician) {
            return res.status(404).json({ msg: 'Technician not found' });
        }

        // Check if slot is available
        const existingBooking = await Booking.findOne({
            technician: technicianId,
            scheduledDate: new Date(scheduledDate),
            scheduledTime,
            status: { $in: ['pending', 'confirmed', 'in-progress'] }
        });

        if (existingBooking) {
            return res.status(400).json({ msg: 'Time slot is not available' });
        }

        const totalAmount = technician.hourlyRate * (duration || 2);

        const booking = new Booking({
            user: req.user.id,
            technician: technicianId,
            service,
            description,
            scheduledDate: new Date(scheduledDate),
            scheduledTime,
            duration: duration || 2,
            totalAmount,
            address,
            contactPhone,
            notes
        });

        await booking.save();

        const populatedBooking = await Booking.findById(booking._id)
            .populate('technician', 'user category location hourlyRate')
            .populate({
                path: 'technician',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            })
            .populate({
                path: 'technician',
                populate: {
                    path: 'category',
                    select: 'name'
                }
            })
            .populate('user', 'name email');

        res.status(201).json(populatedBooking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('technician', 'user category location hourlyRate')
            .populate({
                path: 'technician',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            })
            .populate({
                path: 'technician',
                populate: {
                    path: 'category',
                    select: 'name'
                }
            })
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get technician's bookings
// @route   GET /api/bookings/technician-bookings
// @access  Private
exports.getTechnicianBookings = async (req, res) => {
    try {
        // Find technician profile for the logged-in user
        const technician = await Technician.findOne({ user: req.user.id });
        if (!technician) {
            return res.status(404).json({ msg: 'Technician profile not found' });
        }

        const bookings = await Booking.find({ technician: technician._id })
            .populate('user', 'name email')
            .sort({ scheduledDate: 1, scheduledTime: 1 });

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('technician', 'user category location hourlyRate')
            .populate({
                path: 'technician',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            })
            .populate({
                path: 'technician',
                populate: {
                    path: 'category',
                    select: 'name'
                }
            })
            .populate('user', 'name email');

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Check if user owns this booking or is the technician
        const technician = await Technician.findOne({ user: req.user.id });
        if (booking.user._id.toString() !== req.user.id &&
            (!technician || booking.technician._id.toString() !== technician._id.toString())) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Booking not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Allow user to cancel their own booking
        if (status === 'cancelled' && booking.user.toString() === req.user.id) {
            booking.status = status;
            await booking.save();
            const updatedBooking = await Booking.findById(booking._id)
                .populate('user', 'name email')
                .populate('technician', 'user category location hourlyRate')
                .populate({
                    path: 'technician',
                    populate: {
                        path: 'user',
                        select: 'name email'
                    }
                });
            return res.json(updatedBooking);
        }

        // Check if user is the technician for this booking
        const technician = await Technician.findOne({ user: req.user.id });
        if (!technician || booking.technician.toString() !== technician._id.toString()) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

        const updatedBooking = await Booking.findById(booking._id)
            .populate('user', 'name email')
            .populate('technician', 'user category location hourlyRate')
            .populate({
                path: 'technician',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            });

        res.json(updatedBooking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get available time slots for a technician
// @route   GET /api/bookings/available-slots/:technicianId
// @access  Public
exports.getAvailableSlots = async (req, res) => {
    try {
        const { technicianId } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ msg: 'Date is required' });
        }

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Don't allow booking for past dates
        if (selectedDate < today) {
            return res.json({ availableSlots: [] });
        }

        // Get existing bookings for the date
        const existingBookings = await Booking.find({
            technician: technicianId,
            scheduledDate: selectedDate,
            status: { $in: ['pending', 'confirmed', 'in-progress'] }
        }).select('scheduledTime duration');

        // Define all possible time slots (9 AM to 6 PM)
        const allSlots = [
            '09:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00', '17:00', '18:00'
        ];

        // Filter out booked slots
        const bookedTimes = existingBookings.map(booking => booking.scheduledTime);
        const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

        // If it's today, filter out past time slots
        if (selectedDate.toDateString() === today.toDateString()) {
            const currentHour = new Date().getHours();
            const futureSlots = availableSlots.filter(slot => {
                const slotHour = parseInt(slot.split(':')[0]);
                return slotHour > currentHour;
            });
            return res.json({ availableSlots: futureSlots });
        }

        res.json({ availableSlots });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};