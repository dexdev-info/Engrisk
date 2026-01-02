import api from '../lib/api.js'
import axios from 'axios'

export const authService = {
  // Đăng ký
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Đăng nhập
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  logout: async () => {
    await api.post('/auth/logout', {})
  },

  // Hàm refresh token để lấy access token mới
  refresh: async () => {
    const response = await axios.post(
      '/api/auth/refresh-token',
      {},
      { withCredentials: true }
    )
    return response.data // { accessToken }
  },

  // Lấy thông tin user hiện tại (Check session)
  getCurrentUser: async () => {
    const response = await api.get('/users/profile')
    return response.data
  }
}
