import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// 1. Tạo Context
const AuthContext = createContext();

// Export một Custom Hook để các component khác dùng cho tiện
// Thay vì viết: useContext(AuthContext) -> Giờ viết: useAuth()
export const useAuth = () => {
    return useContext(AuthContext);
};

// 2. Tạo Provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Lưu info user
    const [loading, setLoading] = useState(true); // Trạng thái load lần đầu

    // Check login ngay khi F5 trang
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const data = await authService.getCurrentUser();
                setUser(data);
            } catch (error) {
                // Lỗi 401 nghĩa là chưa login hoặc token hết hạn -> Kệ nó
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    // Hàm Login dùng chung cho cả App
    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser(data);
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
        await authService.logout();
        setUser(null);
    };

    // Giá trị chia sẻ cho toàn bộ App
    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};