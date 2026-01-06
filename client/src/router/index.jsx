import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { Suspense, lazy } from 'react'
// import { RequireAuth } from './requireAuth.js';

// Layouts
import MainLayout from '../components/layouts/MainLayout.jsx'
import AuthLayout from '../components/layouts/AuthLayout.jsx'
import ErrorBoundary from '../components/common/ErrorBoundary.jsx'
import NotFound from '../pages/NotFound.jsx'

// Lazy Pages
const Dashboard = lazy(() => (
  <div className="p-6">Dashboard Real Content Coming Soon</div>
))

// Auth Pages
import Login from '../pages/auth/Login.jsx'
import Register from '../pages/auth/Register.jsx'

// Main pages
import Courses from '../pages/Courses.jsx'
import CourseDetail from '../pages/CourseDetail.jsx'
import Lesson from '../pages/Lesson.jsx'

// Loading Fallback
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <Spin size="large" tip="Đang tải..." />
  </div>
)

// Router Configuration
const router = createBrowserRouter([
  {
    // === AUTH ROUTES ===
    path: '/',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />, // Bắt lỗi cho cụm này
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

      // Course Routes
      { path: 'courses', element: <Courses /> },
      { path: 'courses/:slug', element: <CourseDetail /> }, // Dynamic route

      { path: 'vocabulary', element: <div>Vocabulary Page</div> },
      { path: 'profile', element: <div>Profile Page</div> }
    ]
  },
  // === LESSON ROUTES (PROTECTED) ===
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
  // { path: '*', element: <ErrorBoundary /> }
])

export default router
