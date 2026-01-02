import axios from 'axios';

// Biến lưu Access Token trong RAM (Closure) - Không lưu LocalStorage
let accessToken = null;

// Hàm để các file khác (như AuthContext) cập nhật token vào đây
export const setAccessToken = (token) => {
  accessToken = token;
};

// Hàm lấy token (nếu cần debug)
export const getAccessToken = () => accessToken;

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
// Biến để tránh gọi refresh token nhiều lần cùng lúc khi có nhiều request lỗi 401
let isRefreshing = false;
let failedQueue = [];

// Hàm xử lý hàng đợi các request bị lỗi
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Bỏ qua nếu lỗi không phải 401 hoặc request này là request refresh token (tránh loop)
    if (originalRequest.url.includes('/auth/refresh-token')) {
      return Promise.reject(error);
    }

    // ❌ BỎ QUA logout
    if (originalRequest._isLogoutRequest) {
      return Promise.reject(error);
    }

    // ❌ BỎ QUA refresh request
    if (originalRequest._isRefreshRequest) {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 (Unauthorized) và chưa từng thử lại (retry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu đang có một tiến trình refresh chạy rồi -> Xếp hàng đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      // Đánh dấu request này đang được retry
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API Refresh Token (Cookie tự động gửi đi)
        // Dùng axios thuần để tránh bị loop vô tận bởi interceptor của instance 'api'
        const response = await axios.post(
          '/auth/refresh-token',
          {},
          {
            baseURL: '/api', // Cần set base URL vì axios này độc lập
            withCredentials: true,
            _isRefreshRequest: true, // Dùng để nhận biết trong interceptor nếu cần
          },
        );

        const { accessToken: newAccessToken } = response.data;

        // 1. Lưu token mới vào RAM
        setAccessToken(newAccessToken);

        // 2. Gắn token mới vào Header của request mặc định
        api.defaults.headers.common['Authorization'] =
          `Bearer ${newAccessToken}`;

        // 3. Xử lý các request đang chờ trong hàng đợi
        processQueue(null, newAccessToken);

        // 4. Thử lại request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (_error) {
        processQueue(_error, null);
        // Nếu refresh fail -> Coi như hết phiên -> Logout
        setAccessToken(null);
        // Xóa token mặc định
        api.defaults.headers.common['Authorization'] = '';
        return Promise.reject(_error); // Đẩy lỗi xuống cho component xử lý (chuyển về login)
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
