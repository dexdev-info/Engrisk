import api from '@/lib/api';

export const authService = {
    // Đăng ký
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Đăng nhập
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    // Đăng xuất
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // Lấy thông tin user hiện tại (Check session)
    getCurrentUser: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },
};