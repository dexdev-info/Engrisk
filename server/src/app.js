const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

// Routes Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const vocabularyRoutes = require('./routes/vocabularyRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
// const progressRoutes = require('./routes/progress.routes');
// const notificationRoutes = require('./routes/notification.routes');

// Middleware Imports
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Initialize Express
const app = express();

// Body parsers and Cookie parser middlewares
app.use(express.json()); // Cho phép đọc data JSON từ body (giống $request->json() trong Laravel)
app.use(express.urlencoded({ extended: true })); // Cho phép đọc data từ form-urlencoded
app.use(cookieParser()); // Cho phép đọc cookie từ request

// logging
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }

// Security middlewares
// app.use(helmet());

// Enable CORS Cho phép Client gọi API
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true // Để nhận cookie từ client
}));

// Prevent NoSQL injection (Quan trọng với MongoDB)
// app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// --- Routes Mounting ---
app.get('/', (req, res) => {
    res.send('Engrisk API is running... 🚀');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/exercises', exerciseRoutes);
// app.use('/api/progress', progressRoutes);
// app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// --- Error Handler middleware (Must be last) ---
app.use(errorHandler);

module.exports = app;