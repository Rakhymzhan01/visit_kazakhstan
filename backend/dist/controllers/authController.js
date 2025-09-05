"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.createUser = exports.changePassword = exports.updateProfile = exports.getProfile = exports.login = exports.createUserValidation = exports.loginValidation = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
// Validation rules
exports.loginValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
];
exports.createUserValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    (0, express_validator_1.body)('name').isLength({ min: 2, max: 100 }).trim(),
    (0, express_validator_1.body)('role').optional().isIn(['ADMIN', 'SUPER_ADMIN']),
];
// Generate JWT token
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};
// Login
const login = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { email, password } = req.body;
        // Find user
        const user = await User_1.User.findOne({ email });
        if (!user || !user.isActive) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        // Generate token
        const token = generateToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
// Get current user profile
const getProfile = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user.id).select('-password');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({
            success: true,
            data: {
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                }
            },
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProfile = getProfile;
// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim().length < 2) {
            res.status(400).json({ error: 'Name must be at least 2 characters long' });
            return;
        }
        const user = await User_1.User.findById(req.user.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        user.name = name.trim();
        await user.save();
        res.json({
            success: true,
            data: {
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    lastLogin: user.lastLogin,
                    updatedAt: user.updatedAt,
                }
            },
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateProfile = updateProfile;
// Change password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ error: 'Current password and new password are required' });
            return;
        }
        if (newPassword.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
            res.status(400).json({
                error: 'New password must be at least 8 characters with uppercase, lowercase, and number',
            });
            return;
        }
        // Get current user with password
        const user = await User_1.User.findById(req.user.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        // Verify current password
        const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            res.status(400).json({ error: 'Current password is incorrect' });
            return;
        }
        // Hash new password
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 12);
        // Update password
        user.password = hashedNewPassword;
        await user.save();
        res.json({
            success: true,
            message: 'Password updated successfully',
        });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.changePassword = changePassword;
// Create new admin user (Super Admin only)
const createUser = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { email, password, name, role = 'ADMIN' } = req.body;
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ error: 'User with this email already exists' });
            return;
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // Create user
        const newUser = new User_1.User({
            email,
            password: hashedPassword,
            name,
            role,
        });
        await newUser.save();
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: newUser._id.toString(),
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role,
                    createdAt: newUser.createdAt,
                }
            },
        });
    }
    catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createUser = createUser;
// Logout (client-side token removal)
const logout = async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map