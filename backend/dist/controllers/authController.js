"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.createUser = exports.changePassword = exports.updateProfile = exports.getProfile = exports.login = exports.createUserValidation = exports.loginValidation = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
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
        const user = await database_1.prisma.user.findUnique({
            where: { email },
        });
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
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        // Create audit log
        await database_1.prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'LOGIN',
                entityType: 'User',
                entityId: user.id,
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent'),
            },
        });
        // Generate token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
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
        const user = await database_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({
            success: true,
            data: { user },
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
        const updatedUser = await database_1.prisma.user.update({
            where: { id: req.user.id },
            data: { name: name.trim() },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                lastLogin: true,
                updatedAt: true,
            },
        });
        // Create audit log
        await database_1.prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'UPDATE',
                entityType: 'User',
                entityId: req.user.id,
                newValues: { name: name.trim() },
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent'),
            },
        });
        res.json({
            success: true,
            data: { user: updatedUser },
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
        const user = await database_1.prisma.user.findUnique({
            where: { id: req.user.id },
        });
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
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedNewPassword },
        });
        // Create audit log
        await database_1.prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'PASSWORD_CHANGE',
                entityType: 'User',
                entityId: user.id,
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent'),
            },
        });
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
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(409).json({ error: 'User with this email already exists' });
            return;
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // Create user
        const newUser = await database_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
        // Create audit log
        await database_1.prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'CREATE',
                entityType: 'User',
                entityId: newUser.id,
                newValues: { email, name, role },
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent'),
            },
        });
        res.status(201).json({
            success: true,
            data: { user: newUser },
        });
    }
    catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createUser = createUser;
// Logout (client-side token removal, server-side audit log)
const logout = async (req, res) => {
    try {
        // Create audit log
        await database_1.prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'LOGOUT',
                entityType: 'User',
                entityId: req.user.id,
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent'),
            },
        });
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