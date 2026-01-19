import { App as AntdApp, ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import router from './router/index.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

function App() {
  return (
    <ConfigProvider
      theme={{
        // 1. Global Token: Biến toàn cục
        token: {
          // Medium Style = Black is King 
          colorPrimary: '#000000', // Đổi từ xanh sang đen tuyền
          colorInfo: '#000000',
          colorLink: '#1f2937', // Link màu xám đậm (Gray-800)

          // Typography
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          // fontSize: 15, // Tăng nhẹ size chữ cơ bản cho dễ đọc (trend 2026)

          // Shape
          borderRadius: 8, // Bo góc vừa phải (Rounded-lg), không quá tròn, không quá vuông

          // Functional Colors (Vẫn giữ màu semantic để báo lỗi/thành công)
          colorSuccess: '#10b981', // Emerald-500 (Xanh ngọc, sang hơn xanh lá cây thường)
          colorWarning: '#f59e0b', // Amber-500
          colorError: '#ef4444' // Red-500
        },

        // 2. Component Override: Tinh chỉnh từng thành phần
        components: {
          Button: {
            // Nút bấm đen, chữ trắng, bo góc
            primaryShadow: '0 2px 0 rgba(0, 0, 0, 0.045)', // Giảm shadow
            algorithm: true, // Tự động tính toán màu hover/active dựa trên colorPrimary
            fontWeight: 500,
            contentFontSize: 14,
            controlHeight: 40 // Nút cao hơn chút cho thoáng
          },
          Input: {
            // Input focus sẽ hiện viền đen thay vì xanh
            activeBorderColor: '#000000',
            hoverBorderColor: '#9ca3af', // Gray-400
            controlHeight: 42 // Input to đẹp
          },
          Card: {
            // Card phẳng, ít shadow
            boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          },
          Typography: {
            fontFamilyCode: "'Fira Code', 'Menlo', 'Monaco', monospace" // Font code xịn
          }
        }
      }}
    >
      <AntdApp>
        <AuthProvider>
          <RouterProvider router={router} />
          {/* Toastify cũng cần style lại chút cho đỡ lạc quẻ (hoặc dùng mặc định cũng ok) */}
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
