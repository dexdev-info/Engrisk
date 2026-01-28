import { useState } from 'react'
import { Layout, theme } from 'antd'
import { Outlet } from 'react-router-dom'
import AppSidebar from '@/app/layouts/Sidebar.jsx'
import AppHeader from '@/app/layouts/Header.jsx'
import { useAuth } from '@/features/auth/hooks/useAuth.js'

const { Content } = Layout

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const { loading } = useAuth()
  if (loading) return null // hoặc spinner

  return (
    <Layout className="min-h-screen">
      <AppSidebar collapsed={collapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 240,
          transition: 'all 0.2s',
          minHeight: '100vh'
        }}
      >
        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          {/* Outlet là nơi nội dung các trang con (Dashboard, Courses...) hiển thị */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
