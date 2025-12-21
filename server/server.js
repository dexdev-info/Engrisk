// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const courseRoutes = require('./routes/courseRoutes');

// 1. Load config từ file .env
dotenv.config();

// 2. Kết nối Database
connectDB();

// 3. Khởi tạo app Express
const app = express();

const userRoutes = require('./routes/userRoutes');

// 4. Middleware (Quan trọng)
app.use(cors()); // Cho phép Client gọi API
app.use(express.json()); // Cho phép đọc data JSON từ body (giống $request->json() trong Laravel)
app.use(express.urlencoded({ extended: true })); // Cho phép đọc data từ form-urlencoded
app.use(cookieParser()); // Cho phép đọc cookie từ request
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// 5. Route test (Để xem server sống hay chết)
app.get('/', (req, res) => {
  res.send('API is running... 🚀');
});

// 6. Lắng nghe port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`);
});