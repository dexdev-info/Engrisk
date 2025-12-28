// server/controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password, 
        });

        if (user) {
            generateToken(res, user._id); // <--- Tạo token và set cookie luôn
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/auth (Login)
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Dùng hàm matchPassword đã viết trong Model
        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id); // <--- Set cookie
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), // Set ngày hết hạn về quá khứ để xóa cookie
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

const getUserProfile = async (req, res) => {
    // req.user đã có sẵn nhờ middleware 'protect' ở trên
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    };
    res.status(200).json(user);
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
};