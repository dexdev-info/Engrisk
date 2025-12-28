import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Nhờ proxy nên chỉ cần gõ ngắn gọn thế này
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
});

export default api;