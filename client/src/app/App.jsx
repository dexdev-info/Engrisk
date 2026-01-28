import { App as AntdApp, ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import router from '@/app/router/index.jsx'
import { AuthProvider } from '@/app/providers/AuthProvider.jsx'
import { AppProviders } from '@/app/providers/AppProviders.jsx'

function App() {
  return (
    <ConfigProvider
      theme={{
        // 1. Global Token: Biến toàn cục
        token: {
          colorPrimary: '#000000',
          colorInfo: '#000000',
          colorLink: '#1f2937',

          // Typography
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          // fontSize: 15,

          // Shape
          borderRadius: 8,

          // Functional Colors (Vẫn giữ màu semantic để báo lỗi/thành công)
          colorSuccess: '#10b981', // Emerald-500 (Xanh ngọc)
          colorWarning: '#f59e0b', // Amber-500
          colorError: '#ef4444' // Red-500
        },

        // 2. Component Override: Tinh chỉnh từng thành phần
        components: {
          Button: {
            // Nút bấm đen, chữ trắng, bo góc
            primaryShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
            algorithm: true, // Tự động tính toán màu hover/active dựa trên colorPrimary
            fontWeight: 500,
            contentFontSize: 14,
            controlHeight: 40
          },
          Input: {
            // Input focus
            activeBorderColor: '#000000',
            hoverBorderColor: '#9ca3af', // Gray-400
            controlHeight: 42 // Input to đẹp
          },
          Card: {
            // Card phẳng, ít shadow
            boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          },
          Typography: {
            fontFamilyCode: "'Fira Code', 'Menlo', 'Monaco', monospace"
          }
        }
      }}
    >
      <AntdApp>
        <AppProviders>
          <RouterProvider router={router} />
          <ToastContainer position="top-right" autoClose={3000} />
        </AppProviders>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
