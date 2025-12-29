import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true, // Quan trọng: Để gửi kèm Cookie (HttpOnly)
});

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Xử lý lỗi chung (VD: 401 thì logout, 500 thì báo lỗi server)
        if (error.response && error.response.status === 401) {
            // Logic logout hoặc refresh token sẽ nằm ở đây
            console.warn('Unauthorized! Redirecting to login...');
        }
        return Promise.reject(error);
    }
);

export default api;