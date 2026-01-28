import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { Suspense, lazy } from 'react'
// import { RequireAuth } from './requireAuth.js';

// Layouts
import MainLayout from '@/app/layouts/MainLayout.jsx'
import AuthLayout from '@/app/layouts/AuthLayout.jsx'

import ErrorBoundary from '@/app/error/ErrorBoundary.jsx'
import NotFound from '@/app/pages/NotFoundPage.jsx'

// Auth Pages
import Login from '@/features/auth/pages/LoginPage.jsx'
import Register from '@/features/auth/pages/RegisterPage.jsx'

// Main pages
import Courses from '@/features/course/pages/CoursesPage.jsx'
import CourseDetail from '@/features/course/pages/CourseDetailPage.jsx'
import Lesson from '@/features/course/pages/LessonPage.jsx'
// import Vocab from '../pages/VocabPage.jsx'

// Lazy Pages
const Dashboard = lazy(() =>
  Promise.resolve({
    default: () => <div className="p-6">Dashboard Real Content Coming Soon</div>
  })
)

const Profile = lazy(() =>
  Promise.resolve({
    default: () => <div className="p-6">Profile Real Content Coming Soon</div>
  })
)

const Achievements = lazy(() =>
  Promise.resolve({
    default: () => (
      <div className="p-6">Achievement Real Content Coming Soon</div>
    )
  })
)

// === Vocab LAZY IMPORTS ===
// 1. Layout chứa Tabs
const VocabLayout = lazy(
  () => import('@/features/vocabulary/pages/VocabLayout.jsx')
)
// 2. Các trang con
const PublicVocab = lazy(
  () => import('@/features/vocabulary/pages/PublicVocabPage.jsx')
)
const MyVocab = lazy(
  () => import('@/features/vocabulary/pages/MyVocabPage.jsx')
)
const MyVocabList = lazy(
  () => import('@/features/vocabulary/pages/MyVocabListPage.jsx')
)
const ReviewHub = lazy(
  () => import('@/features/vocabulary/pages/ReviewHubPage.jsx')
)
const Flashcards = lazy(
  () => import('@/features/vocabulary/pages/FlashcardsPage.jsx')
)

// Loading Fallback
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <Spin size="large" tip="Đang tải..." />
  </div>
)

// Router
const router = createBrowserRouter([
  {
    // === AUTH ROUTES ===
    path: '/',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> }
    ]
  },
  {
    // === APP ROUTES (PROTECTED) ===
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        <MainLayout />
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },

      // Course
      { path: 'courses', element: <Courses /> },
      { path: 'courses/:slug', element: <CourseDetail /> }, // Dynamic route

      // ===== VOCABULARY SECTION =====
      {
        path: 'vocabulary',
        children: [
          // NHÓM 1: GIAO DIỆN TABS (Public & My Vocab)
          {
            element: <VocabLayout />,
            children: [
              // Mặc định vào /Vocab public
              { index: true, element: <PublicVocab /> },
              { path: 'my', element: <MyVocab /> },
              // Vẫn nằm trong Tabs vì user cần switch lại tab My Vocab dễ dàng
              { path: 'my/:status', element: <MyVocabList /> }
            ]
          },

          // NHÓM 2: GIAO DIỆN HỌC TẬP (Review & Flashcards)
          // Tách riêng ra khỏi VocabLayout để KHÔNG hiển thị Tabs
          {
            path: 'review',
            children: [
              { index: true, element: <ReviewHub /> },
              { path: 'flashcards', element: <Flashcards /> }
            ]
          }
        ]
      },

      // Other
      { path: 'profile', element: <Profile /> },
      { path: 'achievements', element: <Achievements /> }
    ]
  },
  // === LESSON ROUTES (SEPARATE) ===
  {
    path: '/learn/:courseSlug/:lessonSlug',
    element: (
      <Suspense fallback={<Loading />}>
        <Lesson />
      </Suspense>
    ),
    errorElement: <ErrorBoundary />
  },
  { path: '*', element: <NotFound /> }
])

export default router
