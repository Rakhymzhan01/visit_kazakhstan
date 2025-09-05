"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const blog_1 = __importDefault(require("./routes/blog"));
const content_1 = __importDefault(require("./routes/content"));
const upload_1 = __importDefault(require("./routes/upload"));
const tours_1 = __importDefault(require("./routes/tours"));
const categories_1 = __importDefault(require("./routes/categories"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '5001', 10);
// Security middleware
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com'] // Replace with your frontend domain
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Logging middleware
app.use((0, morgan_1.default)('combined'));
// Static file serving for uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Visit Kazakhstan Admin API is running',
        timestamp: new Date().toISOString()
    });
});
// API routes
app.use('/api/auth', auth_1.default);
app.use('/api/blog', blog_1.default);
app.use('/api/content', content_1.default);
app.use('/api/upload', upload_1.default);
app.use('/api/tours', tours_1.default);
app.use('/api/categories', categories_1.default);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        message: `The endpoint ${req.originalUrl} does not exist.`
    });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
// Connect to database and start server
async function startServer() {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await (0, database_1.connectDB)();
        // Create admin user if it doesn't exist
        await createDefaultAdmin();
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`🔑 Login: admin@visitkazakhstan.com / Admin123!`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
// Function to create default admin user
async function createDefaultAdmin() {
    try {
        const bcrypt = require('bcryptjs');
        const { User } = require('./models/User');
        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: 'admin@visitkazakhstan.com' });
        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            return;
        }
        // Hash password
        const hashedPassword = await bcrypt.hash('Admin123!', 12);
        // Create admin user
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@visitkazakhstan.com',
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true
        });
        await adminUser.save();
        console.log('✅ Default admin user created successfully');
        console.log('📧 Email: admin@visitkazakhstan.com');
        console.log('🔑 Password: Admin123!');
    }
    catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
}
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map