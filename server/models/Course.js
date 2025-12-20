const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    level: { 
        type: String, 
        required: true, 
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner' 
    },
    thumbnail: { type: String }, // Link ảnh (để string cho nhẹ, sau này tính sau)
    // Quan hệ: Một khóa học do ai tạo? (Optional: nếu muốn mở rộng cho giảng viên)
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;