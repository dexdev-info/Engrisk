const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const rateLimit = require('express-rate-limit');

// Load env vars
dotenv.config();

// Initialize Express
const app = express();

// --- Middlewares ---

// Body parser
app.use(express.json()); // Cho phép đọc data JSON từ body (giống $request->json() trong Laravel)
app.use(express.urlencoded({ extended: true })); // Cho phép đọc data từ form-urlencoded
app.use(cookieParser()); // Cho phép đọc cookie từ request

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security Headers
app.use(helmet());

// Prevent NoSQL injection (Quan trọng với MongoDB)
app.use(mongoSanitize());

// Enable CORS Cho phép Client gọi API
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true // Để nhận cookie từ client
}));

// --- Routes Mounting ---
app.get('/', (req, res) => {
    res.send('Engrisk API is running... 🚀');
});

// Import Routes
// const authRoutes = require('./routes/auth.routes');
// app.use('/api/auth', authRoutes);

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);


// --- Error Handler (Must be last) ---
app.use(errorHandler);

module.exports = app;