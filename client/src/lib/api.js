import axios from 'axios';

// Biến lưu Access Token trong RAM (Closure) - Không lưu LocalStorage
let accessToken = null;

// Hàm để các file khác (như AuthContext) cập nhật token vào đây
export const setAccessToken = (token) => {
  accessToken = token;
};

// Hàm lấy token (nếu cần debug)
export const getAccessToken = () => accessToken;

// Hàm xóa token (khi logout)
export const clearAccessToken = () => {
  accessToken = null;
};

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Quan trọng: Để gửi kèm Cookie (RefreshToken)
});

// --- 1. REQUEST INTERCEPTOR (Gửi đi) ---
api.interceptors.request.use(
  (config) => {
    // Nếu có token trong RAM -> Đính kèm vào Header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- 2. RESPONSE INTERCEPTOR (Nhận về) ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401: token hết hạn / chưa login
    if (status === 401) {
      clearAccessToken();
    }

    return Promise.reject(error);
  },
);

export default api;
