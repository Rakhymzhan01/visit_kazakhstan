"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/visit_kazakhstan_db';
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
// Prevent multiple connections in development
if (process.env.NODE_ENV === 'development' && globalThis.__mongoose) {
    mongoose_1.default.connection.close();
}
const connectDB = async () => {
    try {
        console.log('Attempting to connect to:', MONGODB_URI);
        const conn = await mongoose_1.default.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s
            bufferCommands: false, // Disable mongoose buffering
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        // Store connection globally in development
        if (process.env.NODE_ENV === 'development') {
            globalThis.__mongoose = mongoose_1.default;
        }
        return conn;
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        console.log('Please ensure MongoDB is running on port 27017');
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('🔌 MongoDB connection closed.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});
exports.default = mongoose_1.default;
//# sourceMappingURL=database.js.map