const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Course' // <--- Khóa ngoại trỏ về bảng Course
    },
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String, required: true }, // Link YouTube hoặc file
    content: { type: String }, // Nội dung text/ngữ pháp
    order: { type: Number, required: true }, // Thứ tự bài học trong khóa (1, 2, 3...)
}, {
    timestamps: true
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;