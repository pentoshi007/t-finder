const User = require('../models/User');
const Technician = require('../models/Technician');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user or technician
// @route   POST /api/register
// @access  Public
exports.register = async (req, res) => {
    const { name, email, password, role, category, city, phone, bio, skills, experience, hourlyRate } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
        return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    try {
        // Check if user already exists in either collection
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        // --- Create a new User record first ---
        const user = new User({
            name,
            email,
            password,
            role, // 'user' or 'technician'
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // --- If role is technician, create a Technician record ---
        if (role === 'technician') {
            // Validation for technician fields
            if (!category || !city || !phone || !bio || !skills || !experience || !hourlyRate) {
                // If technician-specific fields are missing, delete the just-created user to avoid orphaned records
                await User.findByIdAndDelete(user.id);
                return res.status(400).json({ msg: 'Please fill all technician fields' });
            }

            const technician = new Technician({
                user: user.id, // Link to the User model
                category,
                location: { city, state: req.body.state || '' }, // Assuming state might be optional
                phone,
                bio,
                skills: skills.split(',').map(skill => skill.trim()), // Convert comma-separated string to array
                experience,
                hourlyRate,
            });
            await technician.save();
        }

        // --- Generate JWT Token ---
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// --- Your existing loginUser, getUserProfile, updateUserProfile functions can remain below ---

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' },
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

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user.role === 'technician') {
            const technician = await Technician.findOne({ user: req.user.id }).populate('category');
            return res.json({ user, technician });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    const { name, email, password } = req.body;

    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        userFields.password = await bcrypt.hash(password, salt);
    }

    try {
        let user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: userFields },
            { new: true }
        ).select('-password');

        // If the user is a technician, update the technician profile
        if (user.role === 'technician') {
            const { category, city, phone, description, skills, experience, availability } = req.body;
            const technicianFields = {};
            if (category) technicianFields.category = category;
            if (city) technicianFields.city = city;
            if (phone) technicianFields.phone = phone;
            if (description) technicianFields.description = description;
            if (skills) technicianFields.skills = skills;
            if (experience) technicianFields.experience = experience;
            if (availability) technicianFields.availability = availability;

            let technician = await Technician.findOne({ user: req.user.id });
            if (technician) {
                technician = await Technician.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: technicianFields },
                    { new: true }
                );
            }
            return res.json({ user, technician });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};