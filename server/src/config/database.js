import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    // Kết nối tới MongoDB URI lấy từ biến môi trường
    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log(`MongoDB Connected: ${conn.connection.host} 🍃`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1) // Thoát chương trình nếu lỗi
  }
}

export default connectDB
