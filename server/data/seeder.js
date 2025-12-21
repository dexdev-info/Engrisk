// server/data/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        // 1. Xóa dữ liệu cũ
        // await Course.deleteMany();
        // await Lesson.deleteMany();
        await Vocabulary.deleteMany();

        console.log('Data Destroyed... 💥');

        // 2. Tạo Khóa học mẫu
        // const createdCourses = await Course.insertMany([
        //     {
        //         title: 'English for Beginners',
        //         description: 'Khóa học nền tảng dành cho người mất gốc. Tập trung vào từ vựng và ngữ pháp cơ bản.',
        //         level: 'Beginner',
        //         thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
        //     },
        //     {
        //         title: 'Giao tiếp công sở (Business English)',
        //         description: 'Tự tin giao tiếp trong môi trường làm việc chuyên nghiệp.',
        //         level: 'Intermediate',
        //         thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
        //     },
        //     {
        //         title: 'IELTS Speaking Masterclass',
        //         description: 'Chinh phục band 7.0+ kỹ năng Speaking với các tips thực chiến.',
        //         level: 'Advanced',
        //         thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
        //     }
        // ]);

        // const beginnerCourseId = createdCourses[0]._id; // Lấy ID khóa đầu tiên để gắn bài học vào

        // 3. Tạo Bài học mẫu cho khóa Beginner
        // await Lesson.insertMany([
        //     {
        //         course: beginnerCourseId,
        //         title: 'Bài 1: Chào hỏi (Greetings)',
        //         description: 'Học cách chào hỏi tự nhiên như người bản xứ.',
        //         videoUrl: 'https://www.youtube.com/embed/Fw0wpwF77es', // Link embed youtube mẫu
        //         content: 'Nội dung bài học: Hello, Hi, Good Morning...',
        //         order: 1
        //     },
        //     {
        //         course: beginnerCourseId,
        //         title: 'Bài 2: Giới thiệu bản thân',
        //         description: 'Cách giới thiệu tên, tuổi, nghề nghiệp.',
        //         videoUrl: 'https://www.youtube.com/embed/5_Z_d71Q4Uw',
        //         content: 'My name is Dex. I am a developer...',
        //         order: 2
        //     }
        // ]);

        const firstLessonId = (await Lesson.findOne({ order: 1 }))._id;

        // 4. Tạo Từ vựng mẫu (Thêm đoạn này)
        await Vocabulary.insertMany([
            {
                lesson: firstLessonId,
                word: 'Developer',
                meaning: 'Lập trình viên',
                pronunciation: '/dɪˈveləpər/',
                example: 'I want to be a Fullstack Developer.'
            },
            {
                lesson: firstLessonId,
                word: 'Bug',
                meaning: 'Lỗi phần mềm',
                pronunciation: '/bʌɡ/',
                example: 'There is a bug in my code.'
            },
            {
                lesson: firstLessonId,
                word: 'Deadline',
                meaning: 'Hạn chót',
                pronunciation: '/ˈdedlaɪn/',
                example: 'The deadline is tomorrow.'
            }
        ]);

        console.log('Data Imported! 🌱');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();