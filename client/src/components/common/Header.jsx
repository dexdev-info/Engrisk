import { Layout, Button, Avatar, Dropdown, Space, theme, Modal } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { toast } from 'react-toastify'

const { Header } = Layout
const { confirm } = Modal

const AppHeader = ({ collapsed, setCollapsed }) => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    confirm({
      title: 'Đăng xuất?',
      icon: <ExclamationCircleFilled style={{ color: '#ef4444' }} />, // Red-500
      content: 'Bạn có chắc chắn muốn kết thúc phiên làm việc không?',
      okText: 'Đăng xuất',
      okType: 'danger',
      cancelText: 'Ở lại',
      // Style cho Modal nút bấm gọn gàng
      okButtonProps: { size: 'middle' },
      cancelButtonProps: { type: 'text' },
      centered: true,
      onOk: async () => {
        try {
          await logout()
          toast.info('Hẹn gặp lại bạn sớm! 👋')
          navigate('/login')
        } catch (error) {
          console.error('Logout failed:', error)
          navigate('/login')
        }
      }
    })
  }

  // --- MENU ITEMS ---
  const userMenuResult = [
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      label: 'Cài đặt',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings')
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout
    }
  ]

  return (
    <Header
      // STYLE:
      // 1. !bg-white: Nền trắng tuyệt đối
      // 2. border-b border-gray-100: Viền mảnh thay vì shadow (Medium vibe)
      // 3. sticky top-0: Luôn dính ở trên cùng
      className="!bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-40 px-4 h-16"
      style={{
        padding: '0 16px',
        background: colorBgContainer,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64
        }}
      />

      <Space>
        {/* Dropdown User Menu */}
        <Dropdown
          menu={{ items: userMenuResult }}
          placement="bottomRight"
          arrow
          trigger={['click']}
        >
          <Space className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors select-none">
            {/* Logic hiển thị Avatar: Có ảnh thì hiện ảnh, không thì hiện chữ cái đầu */}
            {/* Avatar */}
            {user?.avatar ? (
              <Avatar src={user.avatar} size="default" />
            ) : (
              <Avatar
                style={{ backgroundColor: '#111827' }} // Black bg
                icon={<UserOutlined />}
                size="default"
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            )}

            <div className="flex flex-col items-start leading-tight sm:flex">
              <span className="font-semibold text-gray-800 text-sm">
                {user?.name || 'User'}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {user?.role || 'Member'}
              </span>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  )
}

export default AppHeader
