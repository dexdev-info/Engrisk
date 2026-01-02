import { useState, useEffect } from 'react'
import { authService } from '../services/authService.js'
import { AuthContext } from './auth.config.jsx'
import { setAccessToken, clearAccessToken } from '../lib/api.js'
import { Spin } from 'antd'

// 1. Tạo Provider
export const AuthProvider = ({ children }) => {
  // children là toàn bộ App bên trong <AuthProvider>
  const [user, setUser] = useState(null) // Lưu info user
  const [loading, setLoading] = useState(true) // Trạng thái load lần đầu

  // Check login ngay khi F5 trang
  useEffect(() => {
    let isBootstrapped = false
    if (isBootstrapped) return
    isBootstrapped = true

    const checkAuth = async () => {
      try {
        // 1. Try refresh token
        const { accessToken } = await authService.refresh()
        setAccessToken(accessToken)

        // 2. Get current user profile
        const userData = await authService.getCurrentUser()
        setUser(userData.data)
      } catch {
        clearAccessToken()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  // ===== LOGIN =====
  const login = async (email, password) => {
    const data = await authService.login(email, password)
    // Backend trả: { accessToken, user }
    setAccessToken(data.accessToken) // <--- Nạp token vào RAM
    setUser(data.user) // <--- Lưu thông tin user
    return data // cho page dùng nếu cần (redirect, toast, role...)
  }

  // ===== REGISTER =====
  const register = async (userData) => {
    // userData = { name, email, password }
    const data = await authService.register(userData)
    return data
  }

  // ===== LOGOUT =====
  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      clearAccessToken()
      setUser(null)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    )
  }

  // ===== Public API =====
  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
