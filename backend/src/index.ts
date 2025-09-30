import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { connectDB } from './config/database';

// Import routes
import authRoutes from './routes/auth';
import blogRoutes from './routes/blog';
import contentRoutes from './routes/content';
import uploadRoutes from './routes/upload';
import tourRoutes from './routes/tours';
import categoryRoutes from './routes/categories';
import destinationRoutes from './routes/destinations';
import categoryPageInfoRoutes from './routes/categoryPageInfo';
import migrateRoutes from './routes/migrate';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5001', 10);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with your frontend domain
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Higher limit for development
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('combined'));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Visit Kazakhstan Admin API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/category-page-info', categoryPageInfoRoutes);
app.use('/api/migrate', migrateRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist.`
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    await connectDB();
    
    // Create admin user if it doesn't exist
    await createDefaultAdmin();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔑 Login: admin@visitkazakhstan.com / Admin123!`);
    });
  } catch (error) {
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
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

startServer();

export default app;