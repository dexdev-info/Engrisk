import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

// Routes Imports
import routes from './routes/index.js';

// Middleware Imports
import errorHandler from './middleware/errorHandler.js';

// Load env vars
dotenv.config();

// Initialize Express
const app = express();

// Body parsers & cookie parser
app.use(express.json()); // Cho phép đọc data JSON từ body (giống $request->json() trong Laravel)
app.use(express.urlencoded({ extended: true })); // Cho phép đọc data từ form-urlencoded
app.use(cookieParser()); // Cho phép đọc cookie từ request

// logging
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }

// Security middlewares
// app.use(helmet());

// Enable CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true // Allow cookies to be sent from client
    })
);

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
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// --- Error Handler middleware (Must be last) ---
app.use(errorHandler);

export default app;