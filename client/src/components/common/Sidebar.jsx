import { Layout, Menu, ConfigProvider } from 'antd'
import {
  DashboardOutlined,
  ReadOutlined,
  BookOutlined,
  TrophyOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'

const { Sider } = Layout

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: '/courses', icon: <ReadOutlined />, label: 'Khóa học' },
    { key: '/vocabulary', icon: <BookOutlined />, label: 'Từ vựng' },
    { key: '/achievements', icon: <TrophyOutlined />, label: 'Thành tích' },
    { type: 'divider' },
    { key: '/profile', icon: <UserOutlined />, label: 'Hồ sơ' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Cài đặt' }
  ]

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      theme="light"
      className="bg-white! border-r border-gray-100 fixed left-0 top-0 bottom-0 h-screen z-50"
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        backgroundColor: '#ffffff' // Pure white
      }}
    >
      {/* 1. Logo Area - Editorial Vibe */}
      <div
        className={`flex items-center h-20 mb-2 ${collapsed ? 'justify-center' : 'pl-8'}`}
      >
        {collapsed ? (
          <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-serif text-xl font-bold select-none">
            E
          </div>
        ) : (
          <div
            className="flex flex-col cursor-pointer select-none group"
            onClick={() => navigate('/')}
          >
            {/* Serif Font cho Logo là linh hồn của Medium style */}
            <span className="font-serif text-3xl font-bold tracking-tight text-gray-900 group-hover:opacity-80 transition-opacity">
              Engrisk
            </span>
            {/* <span className="text-xs text-gray-400 font-sans tracking-widest uppercase mt-1">
              Editorial
            </span> */}
          </div>
        )}
      </div>

      {/* 2. Menu - Override AntD styles cục bộ */}
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              // Monochrome Palette
              itemColor: '#6b7280', // Text Gray-500
              itemHoverColor: '#111827', // Hover Black
              itemSelectedColor: '#000000', // Selected Black

              // Shape & Background
              itemBorderRadius: 8, // Bo góc
              itemSelectedBg: '#f3f4f6', // Selected BG Gray-100 (Monochrome pill)
              itemHoverBg: '#f9fafb', // Hover BG Gray-50

              // Spacing & Font
              itemHeight: 48, // Nút cao hơn cho thoáng
              itemMarginInline: 16, // Cách lề 2 bên
              fontSize: 15, // Chữ to hơn 1 xíu
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' // Sans-serif cho UI
            }
          }
        }}
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="border-none bg-transparent! font-medium"
        />
      </ConfigProvider>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-6 left-0 w-full px-8 opacity-60">
          <div className="text-xs text-gray-400 font-sans">
            © 2026 Engrisk Inc.
          </div>
        </div>
      )}
    </Sider>
  )
}

export default Sidebar
