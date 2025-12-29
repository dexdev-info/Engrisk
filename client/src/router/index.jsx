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
// const Dashboard = lazy(() => import('@/pages/Dashboard')); // Chưa có file này thì khoan bật
const Dashboard = () => <div className="p-6">Dashboard Real Content Coming Soon</div>;
const Courses = () => <div className="p-6">Courses List Coming Soon</div>;

// Auth Pages (Eager load login/register cho nhanh)
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

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
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'register',
                element: <Register />,
            },
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
            {
                // Redirect root to dashboard
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: 'courses',
                element: <Courses />,
            },
            {
                path: 'vocabulary',
                element: <div>Vocabulary Page</div>,
            },
            {
                path: 'profile',
                element: <div>User Profile</div>,
            },
        ],
    },
    {
        // === 404 NOT FOUND ===
        path: '*',
        element: <NotFound />,
    }
]);

export default router;