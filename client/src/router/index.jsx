import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { Suspense, lazy } from 'react';
// import { RequireAuth } from './requireAuth';

// Layouts
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import ErrorBoundary from '../components/common/ErrorBoundary';
import NotFound from '../pages/NotFound';

// Lazy Pages
const Dashboard = lazy(() => <div className="p-6">Dashboard Real Content Coming Soon</div>);
import Courses from '../pages/Courses';
import CourseDetail from '../pages/CourseDetail';

// Auth Pages (Eager load login/register cho nhanh)
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Loading Fallback
const Loading = () => (
    <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải..." />
    </div>
);

// Router Configuration
const router = createBrowserRouter([
    {
        // === AUTH ROUTES ===
        path: '/',
        element: <AuthLayout />,
        errorElement: <ErrorBoundary />, // Bắt lỗi cho cụm này
        children: [
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
        ],
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
            { path: 'profile', element: <div>Profile Page</div> },
        ],
    },
    { path: '*', element: <NotFound /> }
]);

export default router;