import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { Suspense, lazy } from 'react'
// import { RequireAuth } from './requireAuth.js';

// Layouts
import MainLayout from '../components/layouts/MainLayout.jsx'
import AuthLayout from '../components/layouts/AuthLayout.jsx'
import ErrorBoundary from '../components/common/ErrorBoundary.jsx'
import NotFound from '../pages/NotFoundPage.jsx'

// Auth Pages
import Login from '../pages/auth/LoginPage.jsx'
import Register from '../pages/auth/RegisterPage.jsx'

// Main pages
import Courses from '../pages/CoursesPage.jsx'
import CourseDetail from '../pages/CourseDetailPage.jsx'
import Lesson from '../pages/LessonPage.jsx'
// import Vocabulary from '../pages/VocabularyPage.jsx'

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
    default: () => <div className="p-6">Achievement Real Content Coming Soon</div>
  })
)

// === VOCABULARY LAZY IMPORTS ===
// 1. Layout chứa Tabs
const VocabularyLayout = lazy(
  () => import('../pages/vocabulary/VocabularyLayout.jsx')
)
// 2. Các trang con
const VocabularyPublic = lazy(
  () => import('../pages/vocabulary/VocabularyPublicPage.jsx')
)
const MyVocabulary = lazy(
  () => import('../pages/vocabulary/MyVocabularyPage.jsx')
)
const MyVocabularyList = lazy(
  () => import('../pages/vocabulary/MyVocabularyListPage.jsx')
)
const ReviewHub = lazy(() => import('../pages/vocabulary/ReviewHubPage.jsx'))
const Flashcards = lazy(() => import('../pages/vocabulary/FlashcardsPage.jsx'))

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
            element: <VocabularyLayout />,
            children: [
              // Mặc định vào /vocabulary public
              { index: true, element: <VocabularyPublic /> },
              { path: 'my', element: <MyVocabulary /> },
              // Vẫn nằm trong Tabs vì user cần switch lại tab My Vocab dễ dàng
              { path: 'my/:status', element: <MyVocabularyList /> }
            ]
          },

          // NHÓM 2: GIAO DIỆN HỌC TẬP (Review & Flashcards)
          // Tách riêng ra khỏi VocabularyLayout để KHÔNG hiển thị Tabs
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
