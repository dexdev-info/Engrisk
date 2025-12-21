import api from './api';

const authService = {
    // Đăng ký
    register: async (userData) => {
        const response = await api.post('/users/register', userData);
        return response.data;
    },

    // Đăng nhập
    login: async (email, password) => {
        const response = await api.post('/users/login', { email, password });
        return response.data;
    },

    // Đăng xuất
    logout: async () => {
        const response = await api.post('/users/logout');
        return response.data;
    },

    // Lấy thông tin user hiện tại
    getCurrentUser: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },
};

export default authService;