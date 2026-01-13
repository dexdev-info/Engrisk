import mongoose from 'mongoose'
import { config } from 'dotenv'
import colors from 'colors' // Cần cài thêm: npm install colors
import connectDB from './src/config/database'

// Load models
import { deleteMany, create } from './src/models/User'
import {
  deleteMany as _deleteMany,
  create as _create
} from './src/models/Course'
import {
  deleteMany as __deleteMany,
  create as __create
} from './src/models/Lesson'
import {
  deleteMany as ___deleteMany,
  create as ___create
} from './src/models/Vocabulary'
import {
  deleteMany as ____deleteMany,
  create as ____create
} from './src/models/Exercise'
import { deleteMany as _____deleteMany } from './src/models/UserProgress'
import { deleteMany as ______deleteMany } from './src/models/UserVocabulary'
import { deleteMany as _______deleteMany } from './src/models/ExerciseAttempt'

// Load env vars
config()

// Connect to DB
connectDB()

// --- DATA MẪU ---

const users = [
  {
    name: 'Admin User',
    email: 'admin@engrisk.com',
    password: 'password123',
    role: 'admin',
    isVerified: true
  },
  {
    name: 'John Doe',
    email: 'user@engrisk.com',
    password: 'password123',
    role: 'user',
    isVerified: true
  }
]

const importData = async () => {
  try {
    // 1. Clear old data
    await deleteMany()
    await _deleteMany()
    await __deleteMany()
    await ___deleteMany()
    await ____deleteMany()
    await _____deleteMany()
    await ______deleteMany()
    await _______deleteMany()

    console.log('Data Destroyed...'.red.inverse)

    // 2. Create Users
    const createdUsers = await create(users)
    const adminUser = createdUsers[0]._id

    console.log('Users Imported...'.green.inverse)

    // 3. Create Course
    const course = await _create({
      title: 'English for Beginners',
      description:
        'Khóa học nền tảng dành cho người mất gốc. Tập trung vào từ vựng và ngữ pháp cơ bản.',
      level: 'beginner',
      thumbnail:
        'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
      createdBy: adminUser,
      isPublished: true,
      orderIndex: 1
    })

    console.log('Course Imported...'.green.inverse)

    // 4. Create Lessons
    const lessons = await __create([
      {
        course: course._id,
        title: 'Bài 1: Chào hỏi (Greetings)',
        content: `
# Greetings

Trong bài học này, chúng ta sẽ học cách chào hỏi cơ bản trong tiếng Anh.

## 1. Formal Greetings (Trang trọng)
- **Hello**: Xin chào (Phổ biến nhất)
- **Good morning**: Chào buổi sáng
- **Good afternoon**: Chào buổi chiều
- **Good evening**: Chào buổi tối

## 2. Informal Greetings (Thân mật)
- **Hi / Hey**: Chào
- **What's up?**: Có gì mới không?
        `,
        videoUrl: 'https://www.youtube.com/embed/Fw0wpwF77es',
        duration: 15,
        orderIndex: 1,
        isPublished: true
      },
      {
        course: course._id,
        title: 'Bài 2: Giới thiệu bản thân',
        content: 'Học cách giới thiệu tên, tuổi, nghề nghiệp...',
        videoUrl: 'https://www.youtube.com/embed/5_Z_d71Q4Uw',
        duration: 20,
        orderIndex: 2,
        isPublished: true
      }
    ])

    const lesson1 = lessons[0]

    console.log('Lessons Imported...'.green.inverse)

    // 5. Create Vocabularies for Lesson 1
    const vocabs = await ___create([
      {
        word: 'Hello',
        meaning: 'Xin chào',
        pronunciation: '/həˈloʊ/',
        example: 'Hello, how are you?',
        exampleTranslation: 'Xin chào, bạn khỏe không?',
        partOfSpeech: 'interjection',
        level: 'beginner',
        audioUrl:
          'https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3'
      },
      {
        word: 'Morning',
        meaning: 'Buổi sáng',
        pronunciation: '/ˈmɔːrnɪŋ/',
        example: 'Good morning!',
        exampleTranslation: 'Chào buổi sáng!',
        partOfSpeech: 'noun',
        level: 'beginner'
      },
      {
        word: 'Teacher',
        meaning: 'Giáo viên',
        pronunciation: '/ˈtiːtʃər/',
        example: 'She is an English teacher.',
        exampleTranslation: 'Cô ấy là giáo viên tiếng Anh.',
        partOfSpeech: 'noun',
        level: 'beginner'
      }
    ])

    // Link Vocabs back to Lesson 1
    lesson1.vocabularies = vocabs.map((v) => v._id)
    await lesson1.save()

    console.log('Vocabularies Imported...'.green.inverse)

    // 6. Create Exercises for Lesson 1
    await ____create([
      {
        lesson: lesson1._id,
        title: 'Quiz 1: Chọn từ đúng',
        type: 'multiple_choice',
        question: 'Từ nào có nghĩa là "Xin chào"?',
        options: ['Hello', 'Goodbye', 'Thanks', 'Sorry'],
        correctAnswer: 'Hello',
        points: 10,
        orderIndex: 1
      },
      {
        lesson: lesson1._id,
        title: 'Quiz 2: Điền từ',
        type: 'fill_blank',
        question: 'Good ______ (Buổi sáng)!',
        correctAnswer: 'Morning',
        alternativeAnswers: ['morning'],
        points: 20,
        orderIndex: 2
      }
    ])

    console.log('Exercises Imported...'.green.inverse)
    console.log('DATA IMPORTED SUCCESS! 🌱'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await deleteMany()
    await _deleteMany()
    await __deleteMany()
    await ___deleteMany()
    await ____deleteMany()
    await _____deleteMany()
    await ______deleteMany()
    await _______deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
