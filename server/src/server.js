const app = require('./app');
const connectDB = require('./config/database');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} 🔥`);
});

// Handle unhandled promise rejections (Phòng trường hợp crash bất ngờ)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});