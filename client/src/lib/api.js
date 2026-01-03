import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // ! Quan trọng: Để gửi kèm Cookie (RefreshToken)
  headers: {
    'Content-Type': 'application/json'
  }
})

// Biến lưu Access Token trong RAM (Closure) - Không lưu LocalStorage
let accessToken = null

// Hàm để các file khác (như AuthContext) cập nhật token vào đây
export const setAccessToken = (token) => {
  accessToken = token
}

// Hàm xóa token (khi logout)
export const clearAccessToken = () => {
  accessToken = null
}

// Hàm lấy token (nếu cần debug)
export const getAccessToken = () => accessToken

// --- 1. REQUEST INTERCEPTOR (Gửi đi) - - Ensure token is always attached ---
api.interceptors.request.use(
  (config) => {
    // Nếu có token trong RAM -> Đính kèm vào Header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// --- 2. RESPONSE INTERCEPTOR (Nhận về) ---
api.interceptors.response.use(
  (response) => response,
  (error) => {

    // 401: token hết hạn / chưa login
    if (error.response?.status === 401) {
      clearAccessToken()
      // * Optional: redirect to login
      // window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
