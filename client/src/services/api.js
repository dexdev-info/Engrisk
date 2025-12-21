import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Nhờ proxy nên chỉ cần gõ ngắn gọn thế này
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;