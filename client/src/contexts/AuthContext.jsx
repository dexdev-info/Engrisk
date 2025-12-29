import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from './auth.config';
import { Spin } from 'antd';

// 1. Tạo Provider
export const AuthProvider = ({ children }) => { // children là toàn bộ App bên trong <AuthProvider>
    const [user, setUser] = useState(null); // Lưu info user
    const [loading, setLoading] = useState(true); // Trạng thái load lần đầu
    const [error, setError] = useState(null);

    // Check login ngay khi F5 trang
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (err) {
                // Lỗi 401 nghĩa là chưa login hoặc token hết hạn -> Kệ nó
                setUser(null);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Hàm Login
    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser(data); // Backend trả về user info
        return data;
    };

    // Hàm Register
    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data); // Đăng ký xong tự login luôn
        return data;
    };

    // Hàm Logout
    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center bg-gray-50">
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    };

    // Giá trị chia sẻ cho toàn bộ App
    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};