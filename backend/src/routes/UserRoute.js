const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/UserModel');
const router = express.Router();

// 1. POST /api/v1/user/signup
router.post('/signup',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars')
    ],
    async (req, res) => {
        // validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }

        try {
            const { username, email, password } = req.body;
            // check if a user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            // save user
            const newUser = new User({
                username,
                email,
                password: hashedPassword });
            await newUser.save();

            // success 201
            res.status(201).json({ message: 'User created successfully.', user_id: newUser._id });
        } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
);

// 2. POST /api/v1/user/login
router.post('/login',
    [
        body('email').notEmpty().withMessage('Email required'),
        body('password').notEmpty().withMessage('Password required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            // check if a user exists
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ status: false, message: 'Invalid Username and password' });
            }

            // compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ status: false, message: 'Invalid Username and password' });
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET, // make sure this is in your .env
                { expiresIn: '7d' }
            );

            // success 200
            res.status(200).json({ message: 'Login successful.' });
        } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
);

module.exports = router;