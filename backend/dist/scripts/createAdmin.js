"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const createAdmin = async () => {
    try {
        await (0, database_1.connectDB)();
        console.log('Connected to MongoDB');
        // Check if admin already exists
        const existingAdmin = await User_1.User.findOne({ email: 'admin@visitkazakhstan.com' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email: admin@visitkazakhstan.com');
            console.log('Password: Admin123!');
            process.exit(0);
        }
        // Create admin user
        const hashedPassword = await bcryptjs_1.default.hash('Admin123!', 12);
        const admin = new User_1.User({
            email: 'admin@visitkazakhstan.com',
            password: hashedPassword,
            name: 'Admin',
            role: 'SUPER_ADMIN',
            isActive: true,
        });
        await admin.save();
        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@visitkazakhstan.com');
        console.log('Password: Admin123!');
        console.log('');
        console.log('You can now login to the admin panel at: http://localhost:3000/admin/login');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};
createAdmin();
//# sourceMappingURL=createAdmin.js.map