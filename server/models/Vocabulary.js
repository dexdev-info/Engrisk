const mongoose = require('mongoose');

const vocabularySchema = mongoose.Schema({
    lesson: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Lesson' 
    },
    word: { type: String, required: true }, // Ví dụ: "Hello"
    meaning: { type: String, required: true }, // Ví dụ: "Xin chào"
    pronunciation: { type: String }, // Ví dụ: "/həˈloʊ/"
    example: { type: String }, // Ví dụ: "Hello, how are you?"
    image: { type: String }, // (Optional) Link ảnh minh họa
}, {
    timestamps: true
});

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);
module.exports = Vocabulary;