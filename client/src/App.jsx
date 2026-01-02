import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import router from './router/index.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          fontFamily: 'Inter, sans-serif'
        }
      }}
    >
      {/* Bọc AuthProvider ngoài RouterProvider */}
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App
